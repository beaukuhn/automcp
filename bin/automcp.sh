#!/bin/bash
# AutoMCP CLI Script (automcp.sh)
# This script supports two commands: "init" and "generate".
# Usage:
#   ./automcp.sh init
#   ./automcp.sh generate [-s <source_yaml>] [-d <destination_dir>] [--overwrite]

function usage() {
  echo "Usage: $0 {init|generate} [-s <source_yaml>] [-d <destination_dir>] [--overwrite]"
  exit 1
}

# Check if at least one argument is provided.
if [ $# -lt 1 ]; then
  usage
fi

COMMAND=$1
shift

# Set default values.
SOURCE_YAML="service/**/*.openmpc.yaml"
DEST_DIR="generated/"
OVERWRITE="false"

# Parse options for the 'generate' command.
while getopts "s:d:" opt; do
  case $opt in
    s)
      SOURCE_YAML=$OPTARG
      ;;
    d)
      DEST_DIR=$OPTARG
      ;;
    *)
      usage
      ;;
  esac
done
shift $((OPTIND - 1))

# Check for the optional --overwrite flag.
if [ "$1" == "--overwrite" ]; then
  OVERWRITE="true"
fi

if [ "$COMMAND" == "init" ]; then
  echo "Initializing AutoMCP project..."
  
  # Prompt the user for configuration details with defaults.
  read -p "Project name (MyMCPProject): " projectName
  projectName=${projectName:-MyMCPProject}
  
  read -p "Project version (1.0.0): " projectVersion
  projectVersion=${projectVersion:-1.0.0}
  
  read -p "Default target language [typescript/python] (typescript): " language
  language=${language:-typescript}
  
  read -p "Default transport [stdio/http/websocket] (stdio): " transport
  transport=${transport:-stdio}
  
  read -p "Glob pattern for service YAML files (service/**/*.openmpc.yaml): " serviceGlob
  serviceGlob=${serviceGlob:-service/**/*.openmpc.yaml}
  
  read -p "Destination directory for generated code (generated/): " destDir
  destDir=${destDir:-generated/}
  
  # Create the root configuration file.
  cat <<EOF > mcp.config.yaml
project:
  name: "$projectName"
  version: "$projectVersion"
  defaultLanguage: "$language"
  defaultTransport: "$transport"

source: "$serviceGlob"

generates:
  "$destDir":
    plugins:
      - "server"
      - "client"
      - "openapi"
EOF
  
  echo "Configuration file 'mcp.config.yaml' created."
  
elif [ "$COMMAND" == "generate" ]; then
  echo "Generating MCP code..."
  
  # Call the TypeScript generator with the source YAML, destination directory, and overwrite flag.
  npx ts-node src/generator.ts "$SOURCE_YAML" "$DEST_DIR" "$OVERWRITE"
  
  echo "Code generation complete. Check the '$DEST_DIR' directory."
  
else
  usage
fi