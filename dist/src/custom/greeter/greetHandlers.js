"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGreet = handleGreet;
/**
 * Handler for the greet tool
 */
async function handleGreet(args) {
    // Implement greet functionality
    console.log(`greet called with args: ${JSON.stringify(args)}`);
    // Example implementation - replace with actual logic
    const result = `Hello, ${args.name}!`;
    // Return in the format expected by MCP SDK
    return {
        content: [
            {
                type: "text",
                text: String(result)
            }
        ]
    };
}
