# Purpose
The idea for this library is to create a language agnostic code generation tool to streamline the development of MCP servers and clients.
The inspiration for this comes from tools like graphql autogen and grpc.

# Implementation Plan for AutoMCP

1. Project Setup:

   Requirements:
   - A config/ directory (for the root config file, e.g., mcp.config.yaml)
   - A service/ directory for individual service definition YAML files (e.g., \*.openmpc.yaml)
   - A generated/ directory where the auto-generated MCP server/client code and type definitions will be placed
   - A src/custom/ directory for developer-implemented custom logic (e.g., tool handlers)
   - A src/ directory for core code (parser, generator, IR logic)
   - A scripts/ directory for CLI entry point scripts (e.g., automcp.sh)
   - A tests/ directory for unit/integration tests
   - YAML parser library
   - fs-extra for file operations
   - EJS (or another templating engine) for code generation templates
   - TypeScript at first
   - Tools like commander or inquirer (although the initial CLI can be a shell script)

2. Root Configuration (mcp.config.yaml):

   - Define global settings such as project name, version, default language, default transport, and glob patterns for locating service YAML files.
   - Include generation settings (output directories, plugins for server, client, openapi, etc.)
   - Also include declarative definitions for individual tools if desired.

3. YAML Parsing and IR Generation:
   
   - Write a parser (src/parser.ts) to read the mcp.config.yaml and service YAML files.
   - Develop an Intermediate Representation (IR) layer that converts the parsed YAML into structured objects (e.g., IRTool, IRTypeDefinition) representing each tool’s parameters, responses, and metadata.
   - This IR serves as the language-agnostic blueprint for code generation (though not necessary at first)

4. Code Generator:
   
   - Implement a generator (src/generator.ts) that uses EJS templates (stored in the templates/ directory) to create the MCP server and client code.
   - The generator will use the IR to fill in templates with tool definitions, type schemas, and composition logic.
   - Output the generated code into the generated/ directory.
   - Ensure that the generator creates stubs for custom logic (to be placed in src/custom/) without overwriting them on subsequent generations (default mode: preserve custom code; optional flag: --overwrite).

5. Tool Registry and Composition:
   
   - Implement a tool registry that maps tool names to their handler functions. This registry is built using the IR from the YAML.
   - In the generated code, use this registry to dispatch tool calls.
   - For composite tools, provide a generic composition engine that accepts a dynamic pipeline (passed via runtime parameters) and chains individual tool invocations.
   - Keep the composition logic in the application layer, not embedded in the YAML.

6. Agent Orchestration (Optional/Future):
   
   - Design an orchestration layer (or agent) that uses the generated MCP server code.
   - The agent can query the server for available tools (via endpoints like list tools) and chain them based on input or prompts.
   - This layer may interact with an LLM using prompts to generate or refine workflows.

7. CLI Interface:
 
   - Create a shell script (scripts/automcp.sh) that serves as the CLI entry point, allowing commands like:
     automcp init → to scaffold the project and create the root configuration interactively (using prompts with defaults)
     automcp generate -s <source_glob> -d <destination> [--overwrite]
   - This script will call the TypeScript generator (using ts-node) and pass through the necessary parameters.

8. Testing and Documentation:
    
   - Write unit and integration tests (in tests/) to validate that the generated code meets the expected schemas and that the custom logic remains intact during regeneration.
   - Document the workflow and usage instructions in README.md so developers know how to define tools, how to trigger code generation, and how to implement their custom logic.

9. Iteration and Future Enhancements:
   - Add support for multiple target languages (by having separate code generation templates for TypeScript, Python, etc.).
   - Build an adapter or conversion layer for integrating with existing solutions like mcp-agent.
   - Enhance the composition mechanism if needed, or even consider a more dynamic “chain” or “compose” meta tool if user requirements evolve.
