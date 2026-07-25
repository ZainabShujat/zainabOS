/**
 * The Knowledge Engine - Core Types
 * 
 * "Technology is invisible. Architecture is permanent."
 */

export type EntityType = 
  | 'project' 
  | 'article' 
  | 'journal' 
  | 'notebook_page' 
  | 'prompt' 
  | 'photograph' 
  | 'book';

export type Visibility = 'public' | 'private' | 'archive';

export interface EntityRelationships {
  inspired_by?: string[]; // IDs of entities that inspired this one
  resulted_in?: string[]; // IDs of entities that were born from this one
  references?: string[];  // General connections (e.g. an article referencing a book)
}

export interface EntityMetadata {
  time_of_day?: 'Morning' | 'Afternoon' | 'Golden Hour' | 'Night';
  weather?: 'Clear' | 'Rain' | 'Fog';
  location?: string;
  camera_focal_length?: number; // For photographs
  model?: string; // For AI prompts
}

/**
 * The Universal Entity Schema
 * Every object in the museum must implement this contract.
 */
export interface Entity {
  id: string;
  type: EntityType;
  title: string;
  
  // Temporal Data
  created_at: string; // ISO8601
  updated_at: string; // ISO8601
  
  // The Story
  summary: string;
  story: string; // The meta-narrative of why this exists
  reflection?: string; // What do I think now?
  
  // The Graph
  relationships: EntityRelationships;
  tags: string[];
  
  // State & Presentation
  visibility: Visibility;
  metadata?: EntityMetadata;
  
  // The actual content (parsed from MDX)
  content?: string; 
}

/**
 * The Knowledge Graph
 * The complete web of relationships that powers the museum's memory.
 */
export interface KnowledgeGraph {
  entities: Record<string, Entity>;
  // Pre-computed indexes for instant O(1) or fast traversals
  indexes: {
    byType: Record<EntityType, string[]>;
    byTag: Record<string, string[]>;
    // Graph adjacencies: adjacencyList[id] = array of connected IDs
    adjacencyList: Record<string, string[]>;
  };
}
