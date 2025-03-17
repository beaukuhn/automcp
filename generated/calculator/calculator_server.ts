import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";


import { handleAdd } from "../../src/custom/calculator/addHandlers.js";

import { handleMultiply } from "../../src/custom/calculator/multiplyHandlers.js";


// Create the MCP server
const server = new McpServer({ name: "Calculator", version: "1.0.0" });


// Register the add tool
server.tool(
  "add", 
  {
    
    a: z.number(), 
    
    b: z.number(), 
    
  },
  async (args) => {
    // Call the handler function
    return handleAdd(args);
  }
);

// Register the multiply tool
server.tool(
  "multiply", 
  {
    
    a: z.number(), 
    
    b: z.number(), 
    
  },
  async (args) => {
    // Call the handler function
    return handleMultiply(args);
  }
);


// Set up the transport and start the MCP server
const transport = new StdioServerTransport();
server.connect(transport).then(() => {
  console.log("MCP Server is running.");
});