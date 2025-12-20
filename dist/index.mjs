#!/usr/bin/env node

// src/index.ts
import {
  intro,
  outro,
  log as log3,
  text,
  confirm as confirm2,
  group as group2,
  spinner as spinner2
} from "@clack/prompts";
import color from "picocolors";
import { TERMINAL_INFO } from "@ionic/utils-terminal";
import { Project as Project2 } from "ts-morph";
import { existsSync as existsSync2 } from "node:fs";
import { cwd } from "node:process";

// src/utils/log-utils.ts
import { log } from "@clack/prompts";
async function saveFileChanges(sourceFile, cliOptions2) {
  sourceFile.formatText();
  if (cliOptions2.dryRun) {
    log.info("[Dry Run] Writing changes to: " + sourceFile.getFilePath());
    log.info(sourceFile.getFullText());
  } else {
    await sourceFile.save();
  }
  return sourceFile.getFullText();
}

// src/migrations/standalone/0001-remove-add-icons.ts
var removeAddIcons = async (project, cliOptions2) => {
  var _a;
  for (const sourceFile of project.getSourceFiles()) {
    const importAddIcons = sourceFile.getImportDeclaration("ionicons");
    if (!importAddIcons) {
      continue;
    }
    importAddIcons.remove();
    const importIcons = sourceFile.getImportDeclaration("ionicons/icons");
    if (importIcons) {
      importIcons.remove();
    }
    const constructor = (_a = sourceFile.getClasses()[0]) == null ? void 0 : _a.getConstructors()[0];
    if (!constructor) {
      continue;
    }
    const addIcons = constructor.getStatements().find((l) => {
      return l.getFullText().includes("addIcons");
    });
    if (addIcons) {
      addIcons.remove();
    }
    await saveFileChanges(sourceFile, cliOptions2);
  }
};

// src/migrations/standalone/0002-generate-use-icons.ts
import { SyntaxKind as SyntaxKind3 } from "ts-morph";
import { parse } from "@angular-eslint/template-parser";

// src/utils/decorator-utils.ts
import { SyntaxKind } from "ts-morph";
var getDecoratorArgument = (decorator, propertyName) => {
  const args = decorator.getArguments();
  if (args.length === 0) {
    return;
  }
  const arg = args[0];
  const prop = arg.getDescendantsOfKind(SyntaxKind.PropertyAssignment).find((n) => n.compilerNode.name.getText() === propertyName);
  return prop;
};

// src/utils/angular-utils.ts
import { SyntaxKind as SyntaxKind2 } from "ts-morph";
function isAngularComponentClass(sourceFile) {
  const componentDecorator = getAngularComponentDecorator(sourceFile);
  if (!componentDecorator) {
    return false;
  }
  const importDeclaration = sourceFile.getImportDeclaration("@angular/core");
  if (!importDeclaration) {
    return false;
  }
  const namedImports = importDeclaration.getNamedImports();
  const componentImportSpecifier = namedImports.find(
    (n) => n.getName() === "Component"
  );
  if (!componentImportSpecifier) {
    return false;
  }
  return true;
}
function getAngularComponentDecorator(sourceFile) {
  var _a;
  const componentDecorator = (_a = sourceFile.getClasses()[0]) == null ? void 0 : _a.getDecorator("Component");
  return componentDecorator;
}

// src/utils/ionic-utils.ts
var IONIC_COMPONENTS = [
  "ion-app",
  "ion-action-sheet",
  "ion-alert",
  "ion-accordion",
  "ion-accordion-group",
  "ion-avatar",
  "ion-backdrop",
  "ion-back-button",
  "ion-badge",
  "ion-breadcrumb",
  "ion-breadcrumbs",
  "ion-button",
  "ion-buttons",
  "ion-card",
  "ion-card-content",
  "ion-card-header",
  "ion-card-subtitle",
  "ion-card-title",
  "ion-checkbox",
  "ion-chip",
  "ion-col",
  "ion-content",
  "ion-datetime",
  "ion-datetime-button",
  "ion-fab",
  "ion-fab-button",
  "ion-fab-list",
  "ion-footer",
  "ion-grid",
  "ion-header",
  "ion-icon",
  "ion-img",
  "ion-infinite-scroll",
  "ion-infinite-scroll-content",
  "ion-input",
  "ion-item",
  "ion-item-divider",
  "ion-item-group",
  "ion-item-sliding",
  "ion-item-options",
  "ion-item-option",
  "ion-label",
  "ion-list",
  "ion-list-header",
  "ion-loading",
  "ion-menu",
  "ion-menu-button",
  "ion-menu-toggle",
  "ion-modal",
  "ion-nav",
  "ion-nav-link",
  "ion-note",
  "ion-picker",
  "ion-popover",
  "ion-progress-bar",
  "ion-radio",
  "ion-radio-group",
  "ion-range",
  "ion-refresher",
  "ion-refresher-content",
  "ion-reorder",
  "ion-reorder-group",
  "ion-ripple-effect",
  "ion-router",
  "ion-router-link",
  "ion-router-outlet",
  "ion-route",
  "ion-route-redirect",
  "ion-row",
  "ion-searchbar",
  "ion-segment",
  "ion-segment-button",
  "ion-select",
  "ion-select-option",
  "ion-skeleton-text",
  "ion-spinner",
  "ion-split-pane",
  "ion-tab",
  "ion-tabs",
  "ion-tab-bar",
  "ion-tab-button",
  "ion-text",
  "ion-textarea",
  "ion-thumbnail",
  "ion-toolbar",
  "ion-toast",
  "ion-toggle",
  "ion-title"
];

// src/utils/typescript-utils.ts
function addImportToFile(sourceFile, importName, moduleSpecifier) {
  const addImport = (sourceFile2, importName2, moduleSpecifier2) => {
    let importDeclaration = sourceFile2.getImportDeclaration(moduleSpecifier2);
    if (!importDeclaration) {
      importDeclaration = sourceFile2.addImportDeclaration({
        moduleSpecifier: moduleSpecifier2
      });
    }
    const importSpecifier = importDeclaration.getNamedImports().find((n) => n.getName() === importName2);
    if (!importSpecifier) {
      importDeclaration.addNamedImport(importName2);
    }
  };
  if (Array.isArray(importName)) {
    importName.forEach((name) => {
      addImport(sourceFile, name, moduleSpecifier);
    });
  } else {
    addImport(sourceFile, importName, moduleSpecifier);
  }
}
function addExportToFile(sourceFile, importName, moduleSpecifier) {
  const addExport = (sourceFile2, importName2, moduleSpecifier2) => {
    let exportDeclaration = sourceFile2.getExportDeclaration(moduleSpecifier2);
    if (!exportDeclaration) {
      exportDeclaration = sourceFile2.addExportDeclaration({
        moduleSpecifier: moduleSpecifier2
      });
    }
    const importSpecifier = exportDeclaration.getNamedExports().find((n) => n.getName() === importName2);
    if (!importSpecifier) {
      exportDeclaration.addNamedExport(importName2);
    }
  };
  if (Array.isArray(importName)) {
    importName.forEach((name) => {
      addExport(sourceFile, name, moduleSpecifier);
    });
  } else {
    addExport(sourceFile, importName, moduleSpecifier);
  }
}

// src/utils/string-utils.ts
function kebabCaseToCamelCase(str) {
  return str.split("-").map((segment, index) => {
    if (index === 0) {
      return segment;
    }
    return segment.charAt(0).toUpperCase() + segment.slice(1);
  }).join("");
}

// src/migrations/standalone/0002-generate-use-icons.ts
import path from "node:path";
import iconsData from "ionicons/dist/ionicons.json";
var generateUseIcons = async (project, cliOptions2) => {
  const skippedIconsHtmlAll = [];
  const ionIconsAll = [];
  const sourceIonIcons = iconsData.icons.map((icon) => icon.name);
  for (const sourceFile of project.getSourceFiles()) {
    if (sourceFile.getFilePath().includes("node_modules")) {
      continue;
    }
    if (sourceFile.getFilePath().endsWith(".html")) {
      const htmlAsString = sourceFile.getFullText();
      const { skippedIconsHtml, ionIcons } = detectIonicComponentsAndIcons(
        htmlAsString,
        sourceFile.getFilePath()
      );
      skippedIconsHtmlAll.push(
        ...skippedIconsHtml,
        ...ionIcons.filter((icon) => !sourceIonIcons.includes(icon))
      );
      ionIconsAll.push(
        ...ionIcons.filter((icon) => sourceIonIcons.includes(icon))
      );
    } else if (sourceFile.getFilePath().endsWith(".ts")) {
      const templateAsString = getComponentTemplateAsString(sourceFile);
      if (templateAsString) {
        const { skippedIconsHtml, ionIcons } = detectIonicComponentsAndIcons(
          templateAsString,
          sourceFile.getFilePath()
        );
        skippedIconsHtmlAll.push(
          ...skippedIconsHtml,
          ...ionIcons.filter((icon) => !sourceIonIcons.includes(icon))
        );
        ionIconsAll.push(
          ...ionIcons.filter((icon) => sourceIonIcons.includes(icon))
        );
      }
    }
  }
  const uniqueSkippedIconsHtmlAll = Array.from(new Set(skippedIconsHtmlAll));
  uniqueSkippedIconsHtmlAll.sort();
  if (uniqueSkippedIconsHtmlAll.length > 0) {
    console.warn(
      "[Dev] Cannot generate these icon inputs. Please check these: " + uniqueSkippedIconsHtmlAll.join(", ")
    );
  }
  const uniqueIonIconsAll = Array.from(new Set(ionIconsAll));
  uniqueIonIconsAll.sort();
  const uniqueIconCamelCase = uniqueIonIconsAll.map(
    (ionIcon) => kebabCaseToCamelCase(ionIcon)
  );
  let useIconFile = project.getSourceFile("use-icons.ts");
  if (useIconFile) {
    const iconFile = useIconFile.getFirstDescendantByKind(
      SyntaxKind3.ExportDeclaration
    );
    const namedExports = iconFile == null ? void 0 : iconFile.getNamedExports();
    const exportItems = namedExports == null ? void 0 : namedExports.map(
      (namedExport) => namedExport.getName()
    );
    if (exportItems && exportItems.length === uniqueIconCamelCase.length) {
      const newIcons = uniqueIconCamelCase.filter(
        (icon) => !exportItems.includes(icon)
      );
      if (newIcons.length === 0) {
        console.info(`[Dev] No new icons to add or change to use-icons.ts`);
        return false;
      }
    }
  }
  if (!useIconFile) {
    useIconFile = project.createSourceFile(
      path.resolve(cliOptions2.projectPath, cliOptions2.iconPath),
      ``,
      {
        overwrite: true
      }
    );
  }
  if (useIconFile && uniqueIconCamelCase.length > 0) {
    useIconFile.removeText();
    addExportToFile(useIconFile, uniqueIconCamelCase, "ionicons/icons");
    await saveFileChanges(useIconFile, cliOptions2);
    return true;
  }
  return false;
};
function detectIonicComponentsAndIcons(htmlAsString, filePath) {
  const ast = parse(htmlAsString, { filePath });
  const nodes = ast.templateNodes;
  const ionicComponents = [];
  const ionIcons = [];
  const skippedIconsHtml = [];
  let hasRouterLinkWithHref = false;
  let hasRouterLink = false;
  const recursivelyFindIonicComponents = (node) => {
    var _a;
    if (node.type === "Element$1" || node.type === "Element" || node.type === "Template") {
      const tagName = node.type === "Template" ? node.tagName : node.name;
      if (IONIC_COMPONENTS.includes(tagName)) {
        if (!ionicComponents.includes(tagName)) {
          ionicComponents.push(tagName);
        }
        const routerLink = node.attributes.find(
          (a) => a.name === "routerLink" || a.name == "routerDirection" || a.name === "routerAction"
        ) !== void 0;
        if (!hasRouterLink && routerLink) {
          hasRouterLink = true;
        }
      }
      if (node.name === "ion-icon") {
        for (const attribute of ["name", "icon", "ios", "md"]) {
          const staticNameAttribute = node.attributes.find(
            (a) => a.name === attribute
          );
          if (staticNameAttribute) {
            const iconName = staticNameAttribute.value;
            if (!ionIcons.includes(iconName)) {
              ionIcons.push(iconName);
            }
          } else {
            const boundNameAttribute = node.inputs.find(
              (a) => a.name === attribute
            );
            if (boundNameAttribute) {
              const skippedIcon = node.sourceSpan.toString();
              const iconNameRegex = /{{\s*'([^']+)'\s*}}/;
              const iconNameMatch = skippedIcon.match(iconNameRegex);
              const deepGetIconConditional = (ast2, icons) => {
                if (ast2.trueExp.type === "LiteralPrimitive") {
                  icons.push(ast2.trueExp.value);
                } else if (ast2.trueExp.type === "Conditional") {
                  deepGetIconConditional(ast2.trueExp, icons);
                } else {
                  skippedIconsHtml.push(skippedIcon);
                }
                if (ast2.falseExp.type === "LiteralPrimitive") {
                  icons.push(ast2.falseExp.value);
                } else if (ast2.falseExp.type === "Conditional") {
                  deepGetIconConditional(ast2.falseExp, icons);
                } else {
                  skippedIconsHtml.push(skippedIcon);
                }
                return icons;
              };
              if (iconNameMatch) {
                if (!ionIcons.includes(iconNameMatch[1])) {
                  ionIcons.push(iconNameMatch[1]);
                }
              } else if (boundNameAttribute.value.ast.type === "Conditional") {
                deepGetIconConditional(boundNameAttribute.value.ast, ionIcons);
              } else {
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
        if ((_a = node[childKey]) == null ? void 0 : _a.children) {
          for (const childNode of node[childKey].children) {
            recursivelyFindIonicComponents(
              Object.assign(childNode, {
                type: childNode.constructor.name
              })
            );
          }
        }
      }
    } else {
    }
  };
  for (const node of nodes) {
    recursivelyFindIonicComponents(node);
  }
  return {
    ionicComponents,
    ionIcons,
    skippedIconsHtml,
    hasRouterLinkWithHref,
    hasRouterLink
  };
}
function getComponentTemplateAsString(sourceFile) {
  var _a, _b;
  if (isAngularComponentClass(sourceFile)) {
    const componentDecorator = getAngularComponentDecorator(sourceFile);
    const templatePropertyAssignment = getDecoratorArgument(
      componentDecorator,
      "template"
    );
    if (!templatePropertyAssignment) {
      return;
    }
    const templateLiteral = (_a = templatePropertyAssignment.getDescendantsOfKind(SyntaxKind3.NoSubstitutionTemplateLiteral)[0]) == null ? void 0 : _a.getLiteralValue();
    if (templateLiteral) {
      return templateLiteral;
    }
    return (_b = templatePropertyAssignment.getDescendantsOfKind(SyntaxKind3.StringLiteral)[0]) == null ? void 0 : _b.getLiteralText();
  }
}

// src/migrations/standalone/index.ts
import { confirm, group, log as log2 } from "@clack/prompts";

// src/utils/package-utils.ts
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
var getActualPackageVersion = async (dir, packageName) => {
  const packageJsonPath = `${dir}/node_modules/${packageName}/package.json`;
  if (!existsSync(packageJsonPath)) {
    return null;
  }
  try {
    const packageJson = await readFile(packageJsonPath, { encoding: "utf-8" });
    const packageJsonContents = JSON.parse(packageJson);
    const version = packageJsonContents.version;
    return version;
  } catch (e) {
    return null;
  }
};

// src/utils/cli-utils.ts
import * as path2 from "path";
function getRelativePath(importFilePath, targetPath) {
  return path2.relative(path2.dirname(importFilePath), targetPath);
}
function getOptionsFromArgv(argv) {
  const options = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (!arg) {
      continue;
    }
    if (arg.startsWith("--")) {
      const key = kebabCaseToCamelCase(arg.replace("--", ""));
      const value = argv[i + 1] === void 0 || argv[i + 1].startsWith("--") ? true : ["true", "false"].includes(argv[i + 1]) ? argv[i + 1] === "true" : argv[i + 1];
      Object.assign(options, {
        [key]: value
      });
    }
  }
  return options;
}

// src/migrations/standalone/0000-initialize-add-icons.ts
var initializeAddIcons = async (project, cliOptions2) => {
  const prodModeSource = project.getSourceFile("app.config.ts") || project.getSourceFile("main.ts");
  if (prodModeSource === void 0) {
    return;
  }
  const enableProdMode = prodModeSource.getStatements().find((source) => source.getFullText().includes("enableProdMode()"));
  if (!enableProdMode) {
    return;
  }
  const importIonIcons = prodModeSource.getImportDeclaration("ionicons");
  if (importIonIcons) {
    const namedIconsImports = importIonIcons.getNamedImports();
    const importIconSpecifier = namedIconsImports.find(
      (n) => n.getName() === "addIcons"
    );
    if (importIconSpecifier) {
      const addIcons = prodModeSource.getStatements().find((l) => {
        return l.getFullText().includes("addIcons");
      });
      if (addIcons) {
        return;
      } else {
        importIconSpecifier.remove();
      }
    }
  }
  addImportToFile(prodModeSource, "addIcons", "ionicons");
  prodModeSource.addImportDeclaration({
    defaultImport: "* as allIcons",
    moduleSpecifier: "ionicons/icons"
  });
  const relativePath = getRelativePath(
    prodModeSource.getFilePath(),
    [cliOptions2.projectPath, cliOptions2.iconPath].join("/")
  );
  prodModeSource.addImportDeclaration({
    defaultImport: "* as useIcons",
    moduleSpecifier: relativePath.replace(".ts", "")
  });
  prodModeSource.insertStatements(
    enableProdMode.getChildIndex() + 1,
    `addIcons(environment.production ? useIcons : allIcons);`
  );
  return await saveFileChanges(prodModeSource, cliOptions2);
};

// src/migrations/standalone/index.ts
var runStandaloneMigration = async ({
  project,
  cliOptions: cliOptions2,
  dir,
  spinner: spinner3
}) => {
  const hasIonicAngularMinVersion = await checkInstalledIonicVersion(dir);
  if (!hasIonicAngularMinVersion) {
    return false;
  }
  spinner3.start(`Migrating project located at: ${dir}`);
  if (cliOptions2.initialize) {
    await initializeAddIcons(project, cliOptions2);
    await removeAddIcons(project, cliOptions2);
  }
  await generateUseIcons(project, cliOptions2);
  spinner3.stop(`Project migration at ${dir} completed successfully.`);
  log2.success(
    "We recommend reviewing the changes made by this migration and formatting your code (e.g., with Prettier) before committing."
  );
  return true;
};
async function checkInstalledIonicVersion(dir) {
  const ionicAngularVersion = await getActualPackageVersion(
    dir,
    "@ionic/angular"
  );
  if (!ionicAngularVersion) {
    log2.warn(
      "We could not detect the version of @ionic/angular installed in your project."
    );
    log2.warn(
      "This migration requires @ionic/angular version of 7.5.0 or later."
    );
    log2.warn("Do you want to proceed anyway?");
    const { continue: shouldContinue } = await group({
      continue: () => confirm({
        message: "Continue?",
        initialValue: false
      })
    });
    if (!shouldContinue || typeof shouldContinue !== "boolean") {
      log2.info("Migration canceled.");
      return false;
    }
  } else {
    const [major, minor] = ionicAngularVersion.split(".");
    const majorVersion = parseInt(major);
    const minorVersion = parseInt(minor);
    const logVersionError = () => {
      log2.error(
        "This migration requires an @ionic/angular version of v7.5.0 or greater."
      );
      log2.error("Install the latest version of @ionic/angular and try again.");
      log2.error("Migration canceled.");
    };
    if (majorVersion < 7) {
      logVersionError();
      return false;
    }
    if (majorVersion == 7 && minorVersion < 5) {
      logVersionError();
      return false;
    }
  }
  return true;
}

// src/index.ts
var IONIC_REPOSITORY_ISSUES_URL = "https://github.com/rdlabo-team/ionic-angular-collect-icons/issues";
var cliOptions = getOptionsFromArgv(process.argv);
var isInteractive = () => TERMINAL_INFO.tty && !TERMINAL_INFO.ci && cliOptions.interactive === true;
async function main() {
  console.clear();
  intro("@rdlabo/ionic-angular-collect-icons");
  intro(
    "This utility will collect ion-icon from your Ionic Angular project, and generate files to collect and export all icons."
  );
  const _cli = isInteractive() ? await group2({
    dryRun: () => confirm2({
      message: "Would you like to run this migration as a dry run? No changes will be written to your project.",
      initialValue: true
    }),
    projectPath: () => text({
      message: "Please enter the path to your project (default is the current working directory):",
      initialValue: cwd()
    })
  }) : Object.assign({
    // If we are in a non-interactive terminal then use defaults
    dryRun: false,
    projectPath: cwd()
  });
  const cli = Object.assign(
    _cli,
    {
      initialize: false,
      iconPath: `./src/use-icons.ts`
    },
    cliOptions
  );
  if (typeof cli.dryRun !== "boolean") {
    return;
  }
  let project;
  if (existsSync2(`${cli.projectPath}/tsconfig.json`)) {
    project = new Project2({
      tsConfigFilePath: `${cli.projectPath}/tsconfig.json`
    });
  } else {
    project = new Project2();
  }
  const s = spinner2();
  project.addSourceFilesAtPaths([
    `${cli.projectPath}/src/**/*.html`,
    `${cli.projectPath}/src/**/*.ts`,
    `./angular.json`
  ]);
  try {
    await runStandaloneMigration({
      project,
      cliOptions: cli,
      dir: cwd(),
      spinner: s
    });
  } catch (e) {
    s.stop("An error occurred during the migration.", 1);
    log3.error(e.message);
  }
  outro(
    `If you encounter any issues with this migration utility, please report them at: ${color.underline(
      IONIC_REPOSITORY_ISSUES_URL
    )}`
  );
}
main().catch(console.error);
