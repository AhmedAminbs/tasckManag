const fs = require('fs');
const path = require('path');
const { buildSchema } = require('graphql');
const { promisify } = require('util');

const readFileAsync = promisify(fs.readFile);

async function getUserSchema() {
  const schemaPath = path.join(__dirname, './userSchema.gql'); // Adjust path as needed
  try {
    const schemaString = await readFileAsync(schemaPath, { encoding: 'utf8' });
    console.log("Schema file content:", schemaString); // Log file content
    return buildSchema(schemaString);
  } catch (error) {
    console.error("Error reading the schema file:", error);
    throw error;
  }
}

module.exports = getUserSchema;
