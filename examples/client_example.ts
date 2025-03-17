import { GreeterClient } from "../generated/greeter/greeter_client.js";
import { CalculatorClient } from "../generated/calculator/calculator_client.js";

async function testGreeter() {
  console.log("Testing Greeter service...");

  const greeter = new GreeterClient();
  let success = false;

  try {
    await greeter.connect();

    const greeting = await greeter.greet({ name: "World" });
    console.log("Greeter response:", greeting);

    // Verify expected result
    if (greeting === "Hello, World!") {
      console.log("✓ Greeting verification passed");
      success = true;
    } else {
      console.error(
        `✗ Greeting verification failed. Expected "Hello, World!" but got "${greeting}"`
      );
    }
  } catch (error) {
    console.error("Greeter Error:", error);
  } finally {
    await greeter.disconnect();
    console.log("Disconnected from Greeter service");

    // Return success status
    return success;
  }
}

async function testCalculator() {
  console.log("Testing Calculator service...");

  const calculator = new CalculatorClient();
  let success = true;

  try {
    await calculator.connect();

    // Test add
    const sum = await calculator.add({ a: 5, b: 3 });
    console.log("Calculator add response:", sum);
    if (sum === "8") {
      console.log("✓ Add verification passed");
    } else {
      console.error(`✗ Add verification failed. Expected "8" but got "${sum}"`);
      success = false;
    }

    // Test multiply
    const product = await calculator.multiply({ a: 4, b: 7 });
    console.log("Calculator multiply response:", product);
    if (product === "28") {
      console.log("✓ Multiply verification passed");
    } else {
      console.error(
        `✗ Multiply verification failed. Expected "28" but got "${product}"`
      );
      success = false;
    }
  } catch (error) {
    console.error("Calculator Error:", error);
    success = false;
  } finally {
    await calculator.disconnect();
    console.log("Disconnected from Calculator service");

    // Return success status
    return success;
  }
}

// Choose which service to test
const serviceToTest = process.argv[2] || "greeter";

async function main() {
  let success = false;

  if (serviceToTest === "greeter") {
    success = await testGreeter();
  } else if (serviceToTest === "calculator") {
    success = await testCalculator();
  } else {
    console.error(
      `Unknown service: ${serviceToTest}. Use "greeter" or "calculator".`
    );
    process.exit(1);
  }

  // Exit with appropriate code
  process.exit(success ? 0 : 1);
}

main().catch((error) => {
  console.error("Unhandled error:", error);
  process.exit(1);
});
