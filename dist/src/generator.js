"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCode = generateCode;
const fs_extra_1 = __importDefault(require("fs-extra"));
const ejs_1 = __importDefault(require("ejs"));
const path_1 = __importDefault(require("path"));
const glob = __importStar(require("glob"));
const parser_1 = require("./parser");
function generateCode(sourceYamlPattern, destinationDir, overwrite) {
    // Find all files matching the glob pattern
    const files = glob.sync(sourceYamlPattern);
    if (files.length === 0) {
        console.error(`No files found matching pattern: ${sourceYamlPattern}`);
        return;
    }
    // Process each file
    for (const file of files) {
        console.log(`Processing file: ${file}`);
        const config = (0, parser_1.parseYaml)(file);
        // Normalize the tools data structure to match the template expectations
        let normalizedTools = {};
        // Check if tools is an array (our example format) or an object (existing format)
        if (Array.isArray(config.tools)) {
            // Convert array format to object format
            config.tools.forEach((tool) => {
                normalizedTools[tool.name] = {
                    description: tool.description,
                    parameters: {},
                };
                // Convert parameters array to object
                if (tool.parameters) {
                    tool.parameters.forEach((param) => {
                        normalizedTools[tool.name].parameters[param.name] = {
                            type: param.type,
                            description: param.description,
                        };
                    });
                }
            });
        }
        else {
            // Already in the expected format
            normalizedTools = config.tools;
        }
        // Create service-specific subdirectory
        const serviceName = config.service.name.toLowerCase();
        const serviceDir = path_1.default.join(destinationDir, serviceName);
        // Create the service directory if it doesn't exist
        fs_extra_1.default.mkdirSync(serviceDir, { recursive: true });
        // Generate server code
        generateServerCode(config, normalizedTools, serviceDir);
        // Generate client code
        generateClientCode(config, normalizedTools, serviceDir);
        // Generate handler stub files for each tool
        generateHandlerStubs(normalizedTools, serviceName);
    }
}
// Generate server code
function generateServerCode(config, normalizedTools, serviceDir) {
    const templatePath = path_1.default.join(__dirname, "../templates/server.ts.ejs");
    // Check if template exists
    if (!fs_extra_1.default.existsSync(templatePath)) {
        console.error(`Server template not found: ${templatePath}`);
        console.log("Creating templates directory and sample template...");
        // Create templates directory if it doesn't exist
        fs_extra_1.default.mkdirSync(path_1.default.join(__dirname, "../templates"), { recursive: true });
        // Create a sample template
        const sampleTemplate = `// Generated server code for <%= service.name %> v<%= service.version %>
// Description: <%= service.description %>

export class <%= service.name %>Server {
  constructor() {
    console.log("Initializing <%= service.name %> server");
  }
  
  <% tools.forEach(function(tool) { %>
  async <%= tool.name %>(<%= tool.parameters.map(p => p.name + ': ' + p.type).join(', ') %>): Promise<<%= tool.returns.type %>> {
    // TODO: Implement <%= tool.name %>
    <% if (tool.returns.type === 'string') { %>
    return "Not implemented yet";
    <% } else if (tool.returns.type === 'number') { %>
    return 0;
    <% } else if (tool.returns.type === 'boolean') { %>
    return false;
    <% } else { %>
    return null;
    <% } %>
  }
  <% }); %>
}
`;
        fs_extra_1.default.writeFileSync(path_1.default.join(__dirname, "../templates/server.ts.ejs"), sampleTemplate);
    }
    const template = fs_extra_1.default.readFileSync(templatePath, "utf8");
    // Render the template using the parsed YAML data
    const output = ejs_1.default.render(template, {
        service: config.service,
        tools: normalizedTools,
    });
    // Create output filename based on service name
    const serviceName = config.service.name.toLowerCase();
    const outputFilename = `${serviceName}_server.ts`;
    const outputPath = path_1.default.join(serviceDir, outputFilename);
    // Write the output to the destination directory
    fs_extra_1.default.outputFileSync(outputPath, output);
    console.log(`Server code generated at: ${outputPath}`);
}
// Generate client code
function generateClientCode(config, normalizedTools, serviceDir) {
    const templatePath = path_1.default.join(__dirname, "../templates/client.ts.ejs");
    // Check if template exists
    if (!fs_extra_1.default.existsSync(templatePath)) {
        console.error(`Client template not found: ${templatePath}`);
        console.log("Template should be created manually.");
        return;
    }
    const template = fs_extra_1.default.readFileSync(templatePath, "utf8");
    // Render the template using the parsed YAML data
    const output = ejs_1.default.render(template, {
        service: config.service,
        tools: normalizedTools,
    });
    // Create output filename based on service name
    const serviceName = config.service.name.toLowerCase();
    const outputFilename = `${serviceName}_client.ts`;
    const outputPath = path_1.default.join(serviceDir, outputFilename);
    // Write the output to the destination directory
    fs_extra_1.default.outputFileSync(outputPath, output);
    console.log(`Client code generated at: ${outputPath}`);
}
// Generate handler stub files for each tool
function generateHandlerStubs(tools, serviceName) {
    // Create the custom directory if it doesn't exist
    const customDir = path_1.default.join(__dirname, "../src/custom");
    fs_extra_1.default.mkdirSync(customDir, { recursive: true });
    // Create service-specific directory for handlers
    const serviceHandlerDir = path_1.default.join(customDir, serviceName);
    fs_extra_1.default.mkdirSync(serviceHandlerDir, { recursive: true });
    // Generate a handler file for each tool
    Object.keys(tools).forEach((toolName) => {
        const handlerFileName = `${toolName}Handlers.ts`;
        const handlerFilePath = path_1.default.join(serviceHandlerDir, handlerFileName);
        // Only create the file if it doesn't exist
        if (!fs_extra_1.default.existsSync(handlerFilePath)) {
            // Create a basic handler function
            const handlerContent = `/**
 * Handler for the ${toolName} tool
 */
export async function handle${toolName.charAt(0).toUpperCase() + toolName.slice(1)}(args: { ${Object.keys(tools[toolName].parameters)
                .map((param) => `${param}: ${tools[toolName].parameters[param].type.toLowerCase()}`)
                .join("; ")} }) {
  // Implement ${toolName} functionality
  console.log(\`${toolName} called with args: \${JSON.stringify(args)}\`);
  
  // Example implementation - replace with actual logic
  ${generateExampleImplementation(toolName, tools[toolName])}
  
  // Return in the format expected by MCP SDK
  return {
    content: [
      {
        type: "text" as const,
        text: String(result)
      }
    ]
  };
}
`;
            fs_extra_1.default.writeFileSync(handlerFilePath, handlerContent);
            console.log(`Generated handler stub: ${handlerFilePath}`);
        }
        else {
            console.log(`Handler file already exists: ${handlerFilePath}`);
        }
    });
}
// Generate example implementation based on tool name and parameters
function generateExampleImplementation(toolName, tool) {
    const params = Object.keys(tool.parameters);
    if (toolName === "add" && params.includes("a") && params.includes("b")) {
        return "const result = args.a + args.b;";
    }
    else if (toolName === "multiply" &&
        params.includes("a") &&
        params.includes("b")) {
        return "const result = args.a * args.b;";
    }
    else if (toolName === "subtract" &&
        params.includes("a") &&
        params.includes("b")) {
        return "const result = args.a - args.b;";
    }
    else if (toolName === "divide" &&
        params.includes("a") &&
        params.includes("b")) {
        return "const result = args.a / args.b;";
    }
    else if (toolName === "greet" && params.includes("name")) {
        return "const result = `Hello, ${args.name}!`;";
    }
    else {
        return "const result = `${toolName} executed with ${JSON.stringify(args)}`;";
    }
}
// If this file is executed directly, use command line arguments.
if (require.main === module) {
    const [, , sourceYamlPath, destinationDir, overwrite] = process.argv;
    generateCode(sourceYamlPath, destinationDir, overwrite);
}
