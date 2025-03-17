/**
 * Handler for the add tool
 */
export async function handleAdd(args: { a: number; b: number }) {
  // Implement add functionality
  console.log(`add called with args: ${JSON.stringify(args)}`);
  
  // Example implementation - replace with actual logic
  const result = args.a + args.b;
  
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
