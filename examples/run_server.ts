/**
 * Script to run an MCP server
 * Usage: node run_server.js <service-name>
 * Example: node run_server.js greeter
 */

import path from "path";
import { spawn } from "child_process";

// Get the service name from command line arguments
const serviceName = process.argv[2];

if (!serviceName) {
  console.error("Please provide a service name");
  console.error("Usage: node run_server.js <service-name>");
  console.error("Example: node run_server.js greeter");
  process.exit(1);
}

// Determine the path to the server file
const serverPath = path.resolve(
  process.cwd(),
  `generated/${serviceName}/${serviceName}_server.js`
);

console.log(`Starting ${serviceName} server from: ${serverPath}`);

// Run the server
const server = spawn("node", [serverPath], {
  stdio: "inherit",
});

// Handle server exit
server.on("close", (code) => {
  console.log(`${serviceName} server exited with code ${code}`);
});

// Handle CTRL+C to gracefully shut down the server
process.on("SIGINT", () => {
  console.log(`Shutting down ${serviceName} server...`);
  server.kill();
  process.exit(0);
});
