import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";


import { handleGreet } from "../../src/custom/greeter/greetHandlers.js";


// Create the MCP server
const server = new McpServer({ name: "Greeter", version: "1.0.0" });


// Register the greet tool
server.tool(
  "greet", 
  {
    
    name: z.string(), 
    
  },
  async (args) => {
    // Call the handler function
    return handleGreet(args);
  }
);


// Set up the transport and start the MCP server
const transport = new StdioServerTransport();
server.connect(transport).then(() => {
  console.log("MCP Server is running.");
});