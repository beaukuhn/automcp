"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const zod_1 = require("zod");
const greetHandlers_js_1 = require("../../src/custom/greeter/greetHandlers.js");
// Create the MCP server
const server = new mcp_js_1.McpServer({ name: "Greeter", version: "1.0.0" });
// Register the greet tool
server.tool("greet", {
    name: zod_1.z.string(),
}, async (args) => {
    // Call the handler function
    return (0, greetHandlers_js_1.handleGreet)(args);
});
// Set up the transport and start the MCP server
const transport = new stdio_js_1.StdioServerTransport();
server.connect(transport).then(() => {
    console.log("MCP Server is running.");
});
