/**
 * Handler for the multiply tool
 */
export async function handleMultiply(args: { a: number; b: number }) {
  // Implement multiply functionality
  console.log(`multiply called with args: ${JSON.stringify(args)}`);
  
  // Example implementation - replace with actual logic
  const result = args.a * args.b;
  
  // Return in the format expected by MCP SDK
  return {
    content: [
      {
        type: "text" as const,
        text: String(result)
      }
    ]
  };
}
