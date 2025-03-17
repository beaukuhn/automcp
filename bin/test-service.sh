#!/bin/bash

# Script to test an MCP service
# Usage: ./bin/test-service.sh <service-name>
# Example: ./bin/test-service.sh greeter

set -e  # Exit on error

SERVICE_NAME=$1

if [ -z "$SERVICE_NAME" ]; then
  echo "Please provide a service name"
  echo "Usage: ./bin/test-service.sh <service-name>"
  echo "Example: ./bin/test-service.sh greeter"
  exit 1
fi

# Build the project
npm run build

# Run the client test with direct output
echo "Testing $SERVICE_NAME service..."
node dist/examples/client_example.js $SERVICE_NAME

# Check the exit code
if [ $? -eq 0 ]; then
  echo "✅ $SERVICE_NAME test PASSED"
  exit 0
else
  echo "❌ $SERVICE_NAME test FAILED"
  exit 1
fi 