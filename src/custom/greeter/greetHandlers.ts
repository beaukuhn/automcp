/**
 * Handler for the greet tool
 */
export async function handleGreet(args: { name: string }) {
  // Implement greet functionality
  console.log(`greet called with args: ${JSON.stringify(args)}`);
  
  // Example implementation - replace with actual logic
  const result = `Hello, ${args.name}!`;
  
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
