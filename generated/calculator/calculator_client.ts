import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import path from "path";

/**
 * Client for the Calculator service
 */
export class CalculatorClient {
  private client: Client;
  private transport: StdioClientTransport;
  private connected: boolean = false;

  constructor(options: { serverPath?: string } = {}) {
    const serverPath = options.serverPath || path.join(process.cwd(), `dist/generated/calculator/calculator_server.js`);
    
    this.transport = new StdioClientTransport({
      command: "node",
      args: [serverPath]
    });

    this.client = new Client(
      {
        name: "CalculatorClient",
        version: "1.0.0"
      },
      {
        capabilities: {
          tools: {}
        }
      }
    );
  }

  /**
   * Connect to the Calculator service
   */
  async connect(): Promise<void> {
    if (!this.connected) {
      await this.client.connect(this.transport);
      this.connected = true;
    }
  }

  /**
   * Disconnect from the Calculator service
   */
  async disconnect(): Promise<void> {
    if (this.connected) {
      // Client doesn't have a disconnect method in the MCP SDK
      // Just update our connection state
      this.connected = false;
    }
  }


  /**
   * Adds two numbers.
   */
  async add(args: { a: number; b: number; }): Promise<string> {
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
  async multiply(args: { a: number; b: number; }): Promise<string> {
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