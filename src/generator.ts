import fs from "fs-extra";
import ejs from "ejs";
import path from "path";
import * as glob from "glob";
import { parseYaml } from "./parser";

// Define interfaces for the YAML structure
interface Parameter {
  name: string;
  type: string;
  description: string;
}

interface Tool {
  name: string;
  description: string;
  parameters: Parameter[];
  returns?: {
    type: string;
    description: string;
  };
}

interface NormalizedParameter {
  type: string;
  description: string;
}

interface NormalizedTool {
  description: string;
  parameters: Record<string, NormalizedParameter>;
}

export function generateCode(
  sourceYamlPattern: string,
  destinationDir: string,
  overwrite: string
) {
  // Find all files matching the glob pattern
  const files = glob.sync(sourceYamlPattern);

  if (files.length === 0) {
    console.error(`No files found matching pattern: ${sourceYamlPattern}`);
    return;
  }

  // Process each file
  for (const file of files) {
    console.log(`Processing file: ${file}`);
    const config = parseYaml(file);

    // Normalize the tools data structure to match the template expectations
    let normalizedTools: Record<string, NormalizedTool> = {};

    // Check if tools is an array (our example format) or an object (existing format)
    if (Array.isArray(config.tools)) {
      // Convert array format to object format
      config.tools.forEach((tool: Tool) => {
        normalizedTools[tool.name] = {
          description: tool.description,
          parameters: {},
        };

        // Convert parameters array to object
        if (tool.parameters) {
          tool.parameters.forEach((param: Parameter) => {
            normalizedTools[tool.name].parameters[param.name] = {
              type: param.type,
              description: param.description,
            };
          });
        }
      });
    } else {
      // Already in the expected format
      normalizedTools = config.tools;
    }

    // Create service-specific subdirectory
    const serviceName = config.service.name.toLowerCase();
    const serviceDir = path.join(destinationDir, serviceName);

    // Create the service directory if it doesn't exist
    fs.mkdirSync(serviceDir, { recursive: true });

    // Generate server code
    generateServerCode(config, normalizedTools, serviceDir);

    // Generate client code
    generateClientCode(config, normalizedTools, serviceDir);

    // Generate handler stub files for each tool
    generateHandlerStubs(normalizedTools, serviceName);
  }
}

// Generate server code
function generateServerCode(
  config: any,
  normalizedTools: Record<string, NormalizedTool>,
  serviceDir: string
) {
  const templatePath = path.join(__dirname, "../templates/server.ts.ejs");

  // Check if template exists
  if (!fs.existsSync(templatePath)) {
    console.error(`Server template not found: ${templatePath}`);
    console.log("Creating templates directory and sample template...");

    // Create templates directory if it doesn't exist
    fs.mkdirSync(path.join(__dirname, "../templates"), { recursive: true });

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
    fs.writeFileSync(
      path.join(__dirname, "../templates/server.ts.ejs"),
      sampleTemplate
    );
  }

  const template = fs.readFileSync(templatePath, "utf8");

  // Render the template using the parsed YAML data
  const output = ejs.render(template, {
    service: config.service,
    tools: normalizedTools,
  });

  // Create output filename based on service name
  const serviceName = config.service.name.toLowerCase();
  const outputFilename = `${serviceName}_server.ts`;
  const outputPath = path.join(serviceDir, outputFilename);

  // Write the output to the destination directory
  fs.outputFileSync(outputPath, output);
  console.log(`Server code generated at: ${outputPath}`);
}

// Generate client code
function generateClientCode(
  config: any,
  normalizedTools: Record<string, NormalizedTool>,
  serviceDir: string
) {
  const templatePath = path.join(__dirname, "../templates/client.ts.ejs");

  // Check if template exists
  if (!fs.existsSync(templatePath)) {
    console.error(`Client template not found: ${templatePath}`);
    console.log("Template should be created manually.");
    return;
  }

  const template = fs.readFileSync(templatePath, "utf8");

  // Render the template using the parsed YAML data
  const output = ejs.render(template, {
    service: config.service,
    tools: normalizedTools,
  });

  // Create output filename based on service name
  const serviceName = config.service.name.toLowerCase();
  const outputFilename = `${serviceName}_client.ts`;
  const outputPath = path.join(serviceDir, outputFilename);

  // Write the output to the destination directory
  fs.outputFileSync(outputPath, output);
  console.log(`Client code generated at: ${outputPath}`);
}

// Generate handler stub files for each tool
function generateHandlerStubs(
  tools: Record<string, NormalizedTool>,
  serviceName: string
) {
  // Create the custom directory if it doesn't exist
  const customDir = path.join(__dirname, "../src/custom");
  fs.mkdirSync(customDir, { recursive: true });

  // Create service-specific directory for handlers
  const serviceHandlerDir = path.join(customDir, serviceName);
  fs.mkdirSync(serviceHandlerDir, { recursive: true });

  // Generate a handler file for each tool
  Object.keys(tools).forEach((toolName) => {
    const handlerFileName = `${toolName}Handlers.ts`;
    const handlerFilePath = path.join(serviceHandlerDir, handlerFileName);

    // Only create the file if it doesn't exist
    if (!fs.existsSync(handlerFilePath)) {
      // Create a basic handler function
      const handlerContent = `/**
 * Handler for the ${toolName} tool
 */
export async function handle${
        toolName.charAt(0).toUpperCase() + toolName.slice(1)
      }(args: { ${Object.keys(tools[toolName].parameters)
        .map(
          (param) =>
            `${param}: ${tools[toolName].parameters[param].type.toLowerCase()}`
        )
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

      fs.writeFileSync(handlerFilePath, handlerContent);
      console.log(`Generated handler stub: ${handlerFilePath}`);
    } else {
      console.log(`Handler file already exists: ${handlerFilePath}`);
    }
  });
}

// Generate example implementation based on tool name and parameters
function generateExampleImplementation(
  toolName: string,
  tool: NormalizedTool
): string {
  const params = Object.keys(tool.parameters);

  if (toolName === "add" && params.includes("a") && params.includes("b")) {
    return "const result = args.a + args.b;";
  } else if (
    toolName === "multiply" &&
    params.includes("a") &&
    params.includes("b")
  ) {
    return "const result = args.a * args.b;";
  } else if (
    toolName === "subtract" &&
    params.includes("a") &&
    params.includes("b")
  ) {
    return "const result = args.a - args.b;";
  } else if (
    toolName === "divide" &&
    params.includes("a") &&
    params.includes("b")
  ) {
    return "const result = args.a / args.b;";
  } else if (toolName === "greet" && params.includes("name")) {
    return "const result = `Hello, ${args.name}!`;";
  } else {
    return "const result = `${toolName} executed with ${JSON.stringify(args)}`;";
  }
}

// If this file is executed directly, use command line arguments.
if (require.main === module) {
  const [, , sourceYamlPath, destinationDir, overwrite] = process.argv;
  generateCode(sourceYamlPath, destinationDir, overwrite);
}
