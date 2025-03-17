import fs from "fs-extra";
import ejs from "ejs";
import path from "path";
import { parseYaml } from "./parser";

export function generateCode(
  sourceYamlPath: string,
  destinationDir: string,
  overwrite: string
) {
  const config = parseYaml(sourceYamlPath);

  const templatePath = path.join(__dirname, "../templates/server.ts.ejs");
  const template = fs.readFileSync(templatePath, "utf8");

  // Render the template using the parsed YAML data
  const output = ejs.render(template, {
    service: config.service,
    tools: config.tools,
  });

  // Write the output to the destination directory (creating it if necessary)
  const outputPath = path.join(destinationDir, "server.ts");
  fs.outputFileSync(outputPath, output);
  console.log(`Server code generated at: ${outputPath}`);
}

// If this file is executed directly, use command line arguments.
if (require.main === module) {
  const [, , sourceYamlPath, destinationDir, overwrite] = process.argv;
  generateCode(sourceYamlPath, destinationDir, overwrite);
}
