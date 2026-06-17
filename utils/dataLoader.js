const fs = require('fs');
const path = require('path');

/**
 * Synchronously loads and parses a JSON file.
 * Centralises the fs.readFileSync + JSON.parse pattern used across the
 * codebase so every consumer gets consistent error handling for free.
 */
function loadJsonSync(filePath) {
  const resolved = path.resolve(filePath);
  const raw = fs.readFileSync(resolved, 'utf-8');
  return JSON.parse(raw);
}

module.exports = { loadJsonSync };
