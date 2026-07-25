import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTENT_DIR = path.join(__dirname, '../content');
const OUTPUT_FILE = path.join(__dirname, '../src/lib/engine/knowledge_graph.json');

/**
 * Builds the static knowledge graph from markdown files.
 */
function buildGraph() {
  console.log('Building Knowledge Graph...');
  
  if (!fs.existsSync(CONTENT_DIR)) {
    console.log('Content directory not found. Creating empty graph.');
    fs.mkdirSync(CONTENT_DIR, { recursive: true });
  }

  const graph = {
    entities: {},
    indexes: {
      byType: {},
      byTag: {},
      adjacencyList: {}
    }
  };

  // Helper to read directories recursively
  function readDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        readDir(fullPath);
      } else if (fullPath.endsWith('.md') || fullPath.endsWith('.mdx')) {
        processFile(fullPath);
      }
    }
  }

  function processFile(filePath) {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data: frontmatter, content } = matter(fileContent);

    // Validate required fields
    if (!frontmatter.id || !frontmatter.type) {
      console.warn(`Warning: Skipping ${filePath} - Missing id or type in frontmatter.`);
      return;
    }

    const entity = {
      ...frontmatter,
      content: content.trim()
    };

    graph.entities[entity.id] = entity;

    // Index by Type
    if (!graph.indexes.byType[entity.type]) {
      graph.indexes.byType[entity.type] = [];
    }
    graph.indexes.byType[entity.type].push(entity.id);

    // Index by Tags
    if (entity.tags && Array.isArray(entity.tags)) {
      for (const tag of entity.tags) {
        if (!graph.indexes.byTag[tag]) {
          graph.indexes.byTag[tag] = [];
        }
        graph.indexes.byTag[tag].push(entity.id);
      }
    }

    // Initialize adjacency list
    if (!graph.indexes.adjacencyList[entity.id]) {
      graph.indexes.adjacencyList[entity.id] = [];
    }
  }

  readDir(CONTENT_DIR);

  // Second pass: Build adjacency list from relationships
  for (const entityId in graph.entities) {
    const entity = graph.entities[entityId];
    if (entity.relationships) {
      const allRelations = [
        ...(entity.relationships.inspired_by || []),
        ...(entity.relationships.resulted_in || []),
        ...(entity.relationships.references || [])
      ];

      for (const targetId of allRelations) {
        if (graph.entities[targetId]) {
          // Add to adjacency list for fast graph traversal
          if (!graph.indexes.adjacencyList[entityId].includes(targetId)) {
            graph.indexes.adjacencyList[entityId].push(targetId);
          }
          // Bidirectional implicit links (optional, for finding back-links)
          if (!graph.indexes.adjacencyList[targetId]) {
            graph.indexes.adjacencyList[targetId] = [];
          }
          if (!graph.indexes.adjacencyList[targetId].includes(entityId)) {
            graph.indexes.adjacencyList[targetId].push(entityId);
          }
        }
      }
    }
  }

  // Ensure output directory exists
  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(graph, null, 2));
  console.log(`Knowledge Graph built successfully! ${Object.keys(graph.entities).length} entities indexed.`);
}

buildGraph();
