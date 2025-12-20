import { Project, SourceFile } from "ts-morph";
import { CliOptions } from "../../types/cli-options";

import { saveFileChanges } from "../../utils/log-utils";

export const removeAddIcons = async (
  project: Project,
  cliOptions: CliOptions,
) => {
  const filesToSave: SourceFile[] = [];

  for (const sourceFile of project.getSourceFiles()) {
    const importAddIcons = sourceFile.getImportDeclaration("ionicons");
    if (!importAddIcons) {
      // If the ionicons import does not exist, then this file do not use ion-icon
      continue;
    }
    importAddIcons.remove();

    const importIcons = sourceFile.getImportDeclaration("ionicons/icons");
    if (importIcons) {
      importIcons.remove();
    }

    const constructor = sourceFile.getClasses()[0]?.getConstructors()[0];
    if (!constructor) {
      // Create the constructor if it does not exist
      continue;
    }

    // パフォーマンス最適化: getFullText()を一度だけ呼び出す
    const addIcons = constructor.getStatements().find((l) => {
      const text = l.getFullText();
      return text.includes("addIcons");
    });

    if (addIcons) {
      addIcons.remove();
    }
    filesToSave.push(sourceFile);
  }

  await Promise.all(
    filesToSave.map((sourceFile) => saveFileChanges(sourceFile, cliOptions)),
  );
};
