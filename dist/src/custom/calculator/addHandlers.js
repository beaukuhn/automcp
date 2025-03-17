"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAdd = handleAdd;
/**
 * Handler for the add tool
 */
async function handleAdd(args) {
    // Implement add functionality
    console.log(`add called with args: ${JSON.stringify(args)}`);
    // Example implementation - replace with actual logic
    const result = args.a + args.b;
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
