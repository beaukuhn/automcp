import { GreeterClient } from "../generated/greeter/greeter_client.js";
import { CalculatorClient } from "../generated/calculator/calculator_client.js";

async function main() {
  console.log("Starting MCP client example...");

  // Create client instances
  const greeter = new GreeterClient();
  const calculator = new CalculatorClient();

  try {
    // Connect to services
    await greeter.connect();
    await calculator.connect();

    // Use the greeter service
    const greeting = await greeter.greet({ name: "World" });
    console.log("Greeter response:", greeting);

    // Use the calculator service
    const sum = await calculator.add({ a: 5, b: 3 });
    console.log("Calculator add response:", sum);

    const product = await calculator.multiply({ a: 4, b: 7 });
    console.log("Calculator multiply response:", product);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    // Disconnect from services
    await greeter.disconnect();
    await calculator.disconnect();
    console.log("Disconnected from services");
  }
}

main().catch(console.error);
