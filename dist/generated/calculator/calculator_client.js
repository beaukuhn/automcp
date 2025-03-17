"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalculatorClient = void 0;
const index_js_1 = require("@modelcontextprotocol/sdk/client/index.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/client/stdio.js");
const path_1 = __importDefault(require("path"));
/**
 * Client for the Calculator service
 */
class CalculatorClient {
    constructor(options = {}) {
        this.connected = false;
        const serverPath = options.serverPath || path_1.default.join(process.cwd(), `dist/generated/calculator/calculator_server.js`);
        this.transport = new stdio_js_1.StdioClientTransport({
            command: "node",
            args: [serverPath]
        });
        this.client = new index_js_1.Client({
            name: "CalculatorClient",
            version: "1.0.0"
        }, {
            capabilities: {
                tools: {}
            }
        });
    }
    /**
     * Connect to the Calculator service
     */
    async connect() {
        if (!this.connected) {
            await this.client.connect(this.transport);
            this.connected = true;
        }
    }
    /**
     * Disconnect from the Calculator service
     */
    async disconnect() {
        if (this.connected) {
            // Client doesn't have a disconnect method in the MCP SDK
            // Just update our connection state
            this.connected = false;
        }
    }
    /**
     * Adds two numbers.
     */
    async add(args) {
        if (!this.connected) {
            await this.connect();
        }
        const result = await this.client.callTool({
            name: "add",
            arguments: args
        });
        // Extract the text content from the result
        if (Array.isArray(result.content) && result.content.length > 0 && result.content[0].type === "text") {
            return result.content[0].text;
        }
        return JSON.stringify(result);
    }
    /**
     * Multiplies two numbers.
     */
    async multiply(args) {
        if (!this.connected) {
            await this.connect();
        }
        const result = await this.client.callTool({
            name: "multiply",
            arguments: args
        });
        // Extract the text content from the result
        if (Array.isArray(result.content) && result.content.length > 0 && result.content[0].type === "text") {
            return result.content[0].text;
        }
        return JSON.stringify(result);
    }
}
exports.CalculatorClient = CalculatorClient;
