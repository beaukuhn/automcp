"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const zod_1 = require("zod");
const addHandlers_js_1 = require("../../src/custom/calculator/addHandlers.js");
const multiplyHandlers_js_1 = require("../../src/custom/calculator/multiplyHandlers.js");
// Create the MCP server
const server = new mcp_js_1.McpServer({ name: "Calculator", version: "1.0.0" });
// Register the add tool
server.tool("add", {
    a: zod_1.z.number(),
    b: zod_1.z.number(),
}, async (args) => {
    // Call the handler function
    return (0, addHandlers_js_1.handleAdd)(args);
});
// Register the multiply tool
server.tool("multiply", {
    a: zod_1.z.number(),
    b: zod_1.z.number(),
}, async (args) => {
    // Call the handler function
    return (0, multiplyHandlers_js_1.handleMultiply)(args);
});
// Set up the transport and start the MCP server
const transport = new stdio_js_1.StdioServerTransport();
server.connect(transport).then(() => {
    console.log("MCP Server is running.");
});
