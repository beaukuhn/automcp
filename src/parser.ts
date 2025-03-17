import fs from "fs";
import yaml from "yaml";

export function parseYaml(filePath: string): any {
  const fileContents = fs.readFileSync(filePath, "utf8");
  return yaml.parse(fileContents);
}
