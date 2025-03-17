"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseYaml = parseYaml;
const fs_1 = __importDefault(require("fs"));
const yaml_1 = __importDefault(require("yaml"));
function parseYaml(filePath) {
    const fileContents = fs_1.default.readFileSync(filePath, "utf8");
    return yaml_1.default.parse(fileContents);
}
