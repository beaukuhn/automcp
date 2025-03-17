"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleMultiply = handleMultiply;
/**
 * Handler for the multiply tool
 */
async function handleMultiply(args) {
    // Implement multiply functionality
    console.log(`multiply called with args: ${JSON.stringify(args)}`);
    // Example implementation - replace with actual logic
    const result = args.a * args.b;
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
