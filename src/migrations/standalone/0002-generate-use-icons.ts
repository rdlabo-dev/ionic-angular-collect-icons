import { Project, SourceFile, SyntaxKind } from "ts-morph";
import { CliOptions } from "../../types/cli-options";
import { parse } from "@angular-eslint/template-parser";
import { getDecoratorArgument } from "../../utils/decorator-utils";

import {
  getAngularComponentDecorator,
  isAngularComponentClass,
} from "../../utils/angular-utils";
import { IONIC_COMPONENTS } from "../../utils/ionic-utils";
import { saveFileChanges } from "../../utils/log-utils";
import { addExportToFile } from "../../utils/typescript-utils";
import { kebabCaseToCamelCase } from "../../utils/string-utils";
import path from "node:path";
import iconsData from "ionicons/dist/ionicons.json";

// パフォーマンス最適化: モジュールレベルで一度だけ作成
const IONIC_COMPONENTS_SET = new Set(IONIC_COMPONENTS);
const ICON_NAME_REGEX = /{{\s*'([^']+)'\s*}}/;

export const generateUseIcons = async (
  project: Project,
  cliOptions: CliOptions,
): Promise<boolean> => {
  const skippedIconsHtmlAll = new Set<string>();
  const ionIconsAll = new Set<string>();
  const sourceIonIcons = new Set(iconsData.icons.map((icon) => icon.name));

  for (const sourceFile of project.getSourceFiles()) {
    const filePath = sourceFile.getFilePath();

    // node_modulesを早期除外（パス解析を使用）
    if (filePath.includes("node_modules")) {
      continue;
    }

    if (filePath.endsWith(".html")) {
      const htmlAsString = sourceFile.getFullText();

      const { skippedIconsHtml, ionIcons } = detectIonicComponentsAndIcons(
        htmlAsString,
        filePath,
      );
      for (const icon of skippedIconsHtml) {
        skippedIconsHtmlAll.add(icon);
      }
      for (const icon of ionIcons) {
        if (sourceIonIcons.has(icon)) {
          ionIconsAll.add(icon);
        } else {
          skippedIconsHtmlAll.add(icon);
        }
      }
    } else if (filePath.endsWith(".ts")) {
      const templateAsString = getComponentTemplateAsString(sourceFile);
      if (templateAsString) {
        const { skippedIconsHtml, ionIcons } = detectIonicComponentsAndIcons(
          templateAsString,
          filePath,
        );
        for (const icon of skippedIconsHtml) {
          skippedIconsHtmlAll.add(icon);
        }
        for (const icon of ionIcons) {
          if (sourceIonIcons.has(icon)) {
            ionIconsAll.add(icon);
          } else {
            skippedIconsHtmlAll.add(icon);
          }
        }
      }
    }
  }

  const uniqueSkippedIconsHtmlAll = Array.from(skippedIconsHtmlAll);
  uniqueSkippedIconsHtmlAll.sort();
  if (uniqueSkippedIconsHtmlAll.length > 0) {
    console.warn(
      "[Dev] Cannot generate these icon inputs. Please check these: " +
        uniqueSkippedIconsHtmlAll.join(", "),
    );
  }

  const uniqueIonIconsAll = Array.from(ionIconsAll);
  uniqueIonIconsAll.sort();
  const uniqueIconCamelCase = uniqueIonIconsAll.map((ionIcon) =>
    kebabCaseToCamelCase(ionIcon),
  );

  let useIconFile = project.getSourceFile("use-icons.ts");

  if (useIconFile) {
    const iconFile = useIconFile.getFirstDescendantByKind(
      SyntaxKind.ExportDeclaration,
    );
    const namedExports = iconFile?.getNamedExports();
    const exportItems = namedExports?.map((namedExport) =>
      namedExport.getName(),
    );
    if (exportItems && exportItems.length === uniqueIconCamelCase.length) {
      /**
       * If the number of exported icons is the same as the number of source icons
       */
      const exportItemsSet = new Set(exportItems);
      const newIcons = uniqueIconCamelCase.filter(
        (icon) => !exportItemsSet.has(icon),
      );
      if (newIcons.length === 0) {
        console.info(`[Dev] No new icons to add or change to use-icons.ts`);
        return false;
      }
    }
  }

  if (!useIconFile) {
    useIconFile = project.createSourceFile(
      path.resolve(cliOptions.projectPath, cliOptions.iconPath),
      ``,
      {
        overwrite: true,
      },
    );
  }

  if (useIconFile && uniqueIconCamelCase.length > 0) {
    useIconFile.removeText();

    addExportToFile(useIconFile, uniqueIconCamelCase, "ionicons/icons");
    await saveFileChanges(useIconFile, cliOptions);
    return true;
  }
  return false;
};

function detectIonicComponentsAndIcons(htmlAsString: string, filePath: string) {
  const ast = parse(htmlAsString, { filePath });
  const nodes = ast.templateNodes;

  const ionicComponents = new Set<string>();
  const ionIcons = new Set<string>();
  const skippedIconsHtml: string[] = [];

  let hasRouterLinkWithHref = false;
  let hasRouterLink = false;

  const recursivelyFindIonicComponents = (node: any) => {
    if (
      node.type === "Element$1" ||
      node.type === "Element" ||
      node.type === "Template"
    ) {
      const tagName = node.type === "Template" ? node.tagName : node.name;

      if (IONIC_COMPONENTS_SET.has(tagName)) {
        ionicComponents.add(tagName);

        const routerLink =
          node.attributes.find(
            (a: any) =>
              a.name === "routerLink" ||
              a.name == "routerDirection" ||
              a.name === "routerAction",
          ) !== undefined;

        if (!hasRouterLink && routerLink) {
          hasRouterLink = true;
        }
      }

      if (node.name === "ion-icon") {
        for (const attribute of ["name", "icon", "ios", "md"]) {
          const staticNameAttribute = node.attributes.find(
            (a: any) => a.name === attribute,
          );

          if (staticNameAttribute) {
            const iconName = staticNameAttribute.value;
            ionIcons.add(iconName);
          } else {
            const boundNameAttribute = node.inputs.find(
              (a: any) => a.name === attribute,
            );

            if (boundNameAttribute) {
              const skippedIcon = node.sourceSpan.toString();

              /**
               * Attempt to find the icon name from the bound name attribute
               * when the developer has a template like this:
               * <ion-icon name="'user'"></ion-icon>
               */
              const iconNameMatch = skippedIcon.match(ICON_NAME_REGEX);

              const deepGetIconConditional = (
                ast: typeof boundNameAttribute.value.ast,
                iconsSet: Set<string>,
              ): void => {
                if (ast.trueExp.type === "LiteralPrimitive") {
                  iconsSet.add(ast.trueExp.value);
                } else if (ast.trueExp.type === "Conditional") {
                  deepGetIconConditional(ast.trueExp, iconsSet);
                } else {
                  skippedIconsHtml.push(skippedIcon);
                }

                if (ast.falseExp.type === "LiteralPrimitive") {
                  iconsSet.add(ast.falseExp.value);
                } else if (ast.falseExp.type === "Conditional") {
                  deepGetIconConditional(ast.falseExp, iconsSet);
                } else {
                  skippedIconsHtml.push(skippedIcon);
                }
              };

              if (iconNameMatch) {
                ionIcons.add(iconNameMatch[1]);
              } else if (boundNameAttribute.value.ast.type === "Conditional") {
                deepGetIconConditional(boundNameAttribute.value.ast, ionIcons);
              } else {
                // IonIcon name is a calculated value from a variable or function.
                // We can't determine the value of the name at this time.
                // The developer will need to manually import these icons.
                skippedIconsHtml.push(skippedIcon);
              }
            }
          }
        }
      }

      if (node.children.length > 0) {
        for (const childNode of node.children) {
          recursivelyFindIonicComponents(childNode);
        }
      }
    } else if (node.type === "IfBlock") {
      for (const branch of node.branches) {
        for (const childNode of branch.children) {
          recursivelyFindIonicComponents(childNode);
        }
      }
    } else if (node.type === "ForLoopBlock") {
      for (const childNode of node.children) {
        recursivelyFindIonicComponents(childNode);
      }
    } else if (node.type === "SwitchBlock") {
      for (const c of node.cases) {
        for (const childNode of c.children) {
          recursivelyFindIonicComponents(childNode);
        }
      }
    } else if (node.type === "DeferredBlock") {
      if (node.children) {
        for (const childNode of node.children) {
          recursivelyFindIonicComponents(childNode);
        }
      }

      for (const childKey of Object.keys(node)) {
        if (node[childKey]?.children) {
          for (const childNode of node[childKey].children) {
            recursivelyFindIonicComponents(
              Object.assign(childNode, {
                type: childNode.constructor.name,
              }),
            );
          }
        }
      }
    } else {
      // console.log(node.type);
    }
  };

  for (const node of nodes) {
    recursivelyFindIonicComponents(node);
  }

  return {
    ionicComponents: Array.from(ionicComponents),
    ionIcons: Array.from(ionIcons),
    skippedIconsHtml,
    hasRouterLinkWithHref,
    hasRouterLink,
  };
}

/**
 * Returns the template string value for an Angular component.
 *
 * For example:
 * ```
 * @Component({
 *  template: '<p>Testing</p>'
 * })
 * ```
 *
 * Would return:
 * ```
 * <p>Testing</p>
 * ```
 *
 * @param sourceFile The source file to parse.
 */
function getComponentTemplateAsString(sourceFile: SourceFile) {
  if (isAngularComponentClass(sourceFile)) {
    const componentDecorator = getAngularComponentDecorator(sourceFile)!;
    const templatePropertyAssignment = getDecoratorArgument(
      componentDecorator,
      "template",
    );

    if (!templatePropertyAssignment) {
      return;
    }

    // Usage: template: ``
    const templateLiteral = templatePropertyAssignment
      .getDescendantsOfKind(SyntaxKind.NoSubstitutionTemplateLiteral)[0]
      ?.getLiteralValue();

    if (templateLiteral) {
      return templateLiteral;
    }

    // Usage: template: ""
    return templatePropertyAssignment
      .getDescendantsOfKind(SyntaxKind.StringLiteral)[0]
      ?.getLiteralText();
  }
}
