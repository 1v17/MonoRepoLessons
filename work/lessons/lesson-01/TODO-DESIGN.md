# Terminal UI Todo List Manager - Design Document

## Project Overview

This document outlines the design for a sophisticated multi-panel terminal UI todo list manager built using Node.js, TypeScript, and the blessed library. The application emphasizes proper software architecture using the Model-View-Controller (MVC) pattern to create a rich, interactive terminal user interface.

## Table of Contents

1. [System Architecture Overview](#system-architecture-overview)
2. [User Interface Design](#user-interface-design)
3. [Data Model Specification](#data-model-specification)
4. [Technical Requirements](#technical-requirements)
5. [Implementation Roadmap](#implementation-roadmap)

---

## System Architecture Overview

### MVC Architecture Explanation and Rationale

The application follows the Model-View-Controller architectural pattern to ensure separation of concerns, maintainability, and testability:

#### Model Layer

- **Purpose**: Manages data and business logic
- **Responsibilities**:
  - Todo item CRUD operations
  - Data validation and integrity
  - Persistence management
  - Business rules enforcement
  - State management
- **Benefits**: Centralized data management, easy testing, data consistency

#### View Layer

- **Purpose**: Handles user interface presentation
- **Responsibilities**:
  - Terminal UI rendering using blessed
  - Panel management and layout
  - Event handling for user interactions
  - Visual feedback and animations
  - Accessibility features
- **Benefits**: Separation of UI logic, reusable components, responsive design

#### Controller Layer

- **Purpose**: Orchestrates interaction between Model and View
- **Responsibilities**:
  - User input processing
  - Command routing and execution
  - Coordination between models and views
  - Application flow control
  - Error handling and recovery
- **Benefits**: Decoupled components, centralized business logic, easier debugging

### Component Interaction Diagrams

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│      View       │    │   Controller    │    │      Model      │
│   (blessed UI)  │    │  (Orchestrator) │    │  (Data Layer)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │ User Input            │                       │
         ├──────────────────────►│                       │
         │                       │ Validate & Process    │
         │                       ├──────────────────────►│
         │                       │                       │
         │                       │ Data Response         │
         │                       │◄──────────────────────┤
         │ UI Update             │                       │
         │◄──────────────────────┤                       │
         │                       │                       │
```

### Data Flow Between Components

1. **User Interaction Flow**:

   ```
   User Input → View → Controller → Model → Controller → View → UI Update
   ```

2. **Data Persistence Flow**:

   ```
   Model Changes → Validation → Storage → Confirmation → View Update
   ```

3. **Event Handling Flow**:
   ```
   Keyboard/Mouse → View Events → Controller Commands → Model Operations → State Changes
   ```

---

## User Interface Design

### Terminal UI Layout with Multiple Panels

The application features a responsive multi-panel layout designed for optimal terminal usage:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Terminal Todo Manager v1.0                                    [H] Help      │
├─────────────────┬───────────────────────────────────────┬───────────────────┤
│                 │                                       │                   │
│   TODO LISTS    │            MAIN PANEL                 │    QUICK STATS    │
│                 │                                       │                   │
│ ┌─────────────┐ │ ┌───────────────────────────────────┐ │ ┌───────────────┐ │
│ │ • Personal  │ │ │ [ ] Complete project proposal     │ │ │ Total: 15     │ │
│ │ • Work      │ │ │ [x] Review design document        │ │ │ Done: 8       │ │
│ │ • Shopping  │ │ │ [ ] Implement MVC architecture    │ │ │ Pending: 7    │ │
│ │ • Ideas     │ │ │ [ ] Write unit tests              │ │ │ Overdue: 2    │ │
│ └─────────────┘ │ │ [!] Fix critical bug              │ │ └───────────────┘ │
│                 │ │                                   │ │                   │
│   CATEGORIES    │ └───────────────────────────────────┘ │    FILTERS        │
│                 │                                       │                   │
│ ┌─────────────┐ │ ┌───────────────────────────────────┐ │ ┌───────────────┐ │
│ │ @ urgent    │ │ │ Title: Fix navigation bug         │ │ │ [ ] All       │ │
│ │ @ today     │ │ │ Due: 2025-09-20                   │ │ │ [x] Pending   │ │
│ │ @ this-week │ │ │ Priority: High                    │ │ │ [ ] Completed │ │
│ │ @ backlog   │ │ │ Tags: bug, urgent, frontend       │ │ │ [ ] Overdue   │ │
│ └─────────────┘ │ │ Description:                      │ │ └───────────────┘ │
│                 │ │ Navigation fails when...          │ │                   │
├─────────────────┤ └───────────────────────────────────┘ ├───────────────────┤
│ Commands:       │                                       │ Search:           │
│ n: New Todo     │              STATUS BAR               │ [_____________]   │
│ e: Edit         │   Ready | List: Work (7 items)        │                   │
│ d: Delete       │                                       │                   │
└─────────────────┴───────────────────────────────────────┴───────────────────┘
```

### Panel Descriptions and Responsibilities

#### 1. Left Panel - Navigation & Categories

- **Todo Lists**: User-defined lists (Personal, Work, etc.)
- **Categories**: Time-based and priority filters
- **Commands**: Available keyboard shortcuts
- **Dimensions**: 25% of terminal width

#### 2. Main Panel - Content Area

- **Todo List View**: Displays filtered todo items
- **Detail View**: Shows selected todo details
- **Edit Mode**: In-place editing capabilities
- **Dimensions**: 50% of terminal width

#### 3. Right Panel - Information & Controls

- **Quick Stats**: Counters and progress indicators
- **Filters**: Active filters and toggles
- **Search**: Real-time search functionality
- **Dimensions**: 25% of terminal width

#### 4. Status Bar - System Information

- **Application Status**: Ready, Loading, Error states
- **Context Info**: Current list, item count
- **Hints**: Contextual help messages

### Navigation and Interaction Patterns

#### Panel Navigation

- **Tab**: Cycle through panels (left → main → right → left)
- **Shift+Tab**: Reverse panel cycling
- **Arrow Keys**: Navigate within active panel
- **Enter**: Select/activate item
- **Escape**: Return to previous context

#### List Navigation

- **Up/Down Arrows**: Navigate todo items
- **Page Up/Down**: Scroll through large lists
- **Home/End**: Jump to first/last item
- **j/k**: Vim-style navigation (optional)

#### Content Interaction

- **Space**: Toggle todo completion
- **Enter**: Edit selected todo
- **Delete**: Mark for deletion (with confirmation)
- **Insert**: Create new todo

### Keyboard Shortcuts and Commands

#### Global Commands

| Key      | Action   | Description             |
| -------- | -------- | ----------------------- |
| `Ctrl+Q` | Quit     | Exit application        |
| `Ctrl+S` | Save     | Force save to disk      |
| `Ctrl+Z` | Undo     | Undo last action        |
| `Ctrl+Y` | Redo     | Redo last undone action |
| `F1`     | Help     | Show help panel         |
| `F2`     | Settings | Open settings panel     |

#### Todo Management

| Key     | Action   | Description              |
| ------- | -------- | ------------------------ |
| `n`     | New      | Create new todo          |
| `e`     | Edit     | Edit selected todo       |
| `d`     | Delete   | Delete selected todo     |
| `Space` | Toggle   | Toggle completion status |
| `p`     | Priority | Cycle priority levels    |
| `t`     | Tags     | Add/edit tags            |
| `Enter` | Details  | View/edit details        |

#### View Controls

| Key      | Action  | Description          |
| -------- | ------- | -------------------- |
| `f`      | Filter  | Open filter dialog   |
| `s`      | Sort    | Cycle sort options   |
| `v`      | View    | Toggle view modes    |
| `/`      | Search  | Activate search      |
| `Escape` | Clear   | Clear filters/search |
| `r`      | Refresh | Reload data          |

#### List Management

| Key      | Action      | Description          |
| -------- | ----------- | -------------------- |
| `l`      | Lists       | Switch between lists |
| `Ctrl+N` | New List    | Create new list      |
| `Ctrl+R` | Rename      | Rename current list  |
| `Ctrl+D` | Delete List | Delete current list  |

---

## Data Model Specification

### Todo Item Structure and Properties

#### Core Todo Item Schema

```typescript
interface TodoItem {
  // Unique identifier
  id: string; // UUID v4 format

  // Basic properties
  title: string; // Required, 1-200 characters
  description?: string; // Optional, up to 2000 characters
  completed: boolean; // Default: false

  // Priority and organization
  priority: Priority; // LOW, MEDIUM, HIGH, URGENT
  tags: string[]; // Array of tag strings
  listId: string; // Reference to parent list

  // Temporal properties
  createdAt: Date; // Auto-generated
  updatedAt: Date; // Auto-updated
  dueDate?: Date; // Optional deadline
  completedAt?: Date; // Set when marked complete

  // Extended properties
  estimatedTime?: number; // Minutes
  actualTime?: number; // Minutes tracked
  dependencies?: string[]; // IDs of dependent todos
  attachments?: Attachment[]; // File references

  // Metadata
  version: number; // For conflict resolution
  archived: boolean; // Default: false
}

enum Priority {
  LOW = 0,
  MEDIUM = 1,
  HIGH = 2,
  URGENT = 3,
}

interface Attachment {
  name: string;
  path: string;
  type: string;
  size: number;
  addedAt: Date;
}
```

#### Todo List Schema

```typescript
interface TodoList {
  id: string; // UUID v4 format
  name: string; // Required, 1-50 characters
  description?: string; // Optional description
  color?: string; // Hex color code
  icon?: string; // Unicode icon

  // Organization
  order: number; // Display order
  archived: boolean; // Default: false

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  itemCount: number; // Cached count
}
```

### Data Validation Rules

#### Todo Item Validation

- **title**: Required, trim whitespace, 1-200 characters
- **description**: Optional, trim whitespace, max 2000 characters
- **priority**: Must be valid Priority enum value
- **tags**: Array of strings, each 1-30 characters, alphanumeric + hyphens
- **dueDate**: Must be future date if provided
- **estimatedTime**: Positive integer, max 1440 (24 hours)
- **dependencies**: Must reference existing todo IDs

#### Todo List Validation

- **name**: Required, unique within user scope, 1-50 characters
- **color**: Valid hex color code format (#RRGGBB)
- **icon**: Single Unicode character
- **order**: Non-negative integer

### Storage Format and Persistence Strategy

#### File-Based Storage Structure

```
~/.todo-manager/
├── config.json              # Application configuration
├── data/
│   ├── lists.json           # Todo lists metadata
│   ├── todos/
│   │   ├── list-{id}.json   # Todos for specific list
│   │   └── ...
│   └── backups/
│       ├── {timestamp}.backup
│       └── ...
└── logs/
    └── app.log              # Application logs
```

#### JSON Storage Format

**lists.json**:

```json
{
  "version": "1.0",
  "lists": [
    {
      "id": "uuid-1",
      "name": "Personal",
      "description": "Personal tasks and reminders",
      "color": "#FF6B6B",
      "icon": "🏠",
      "order": 0,
      "archived": false,
      "createdAt": "2025-09-15T10:30:00Z",
      "updatedAt": "2025-09-15T10:30:00Z",
      "itemCount": 5
    }
  ]
}
```

**list-{id}.json**:

```json
{
  "version": "1.0",
  "listId": "uuid-1",
  "todos": [
    {
      "id": "todo-uuid-1",
      "title": "Complete project proposal",
      "description": "Write and submit the quarterly project proposal",
      "completed": false,
      "priority": 2,
      "tags": ["work", "deadline"],
      "listId": "uuid-1",
      "createdAt": "2025-09-15T10:30:00Z",
      "updatedAt": "2025-09-15T10:30:00Z",
      "dueDate": "2025-09-20T23:59:59Z",
      "estimatedTime": 120,
      "version": 1,
      "archived": false
    }
  ]
}
```

#### Persistence Strategy

1. **Write Operations**:

   - Atomic writes using temporary files
   - File locking to prevent corruption
   - Automatic backups before modifications
   - Validation before writing

2. **Read Operations**:

   - Lazy loading of todo lists
   - Caching for frequently accessed data
   - Background synchronization checks

3. **Backup Strategy**:
   - Daily automatic backups
   - Retention of last 30 backups
   - Export/import functionality
   - Cloud sync preparation (future feature)

---

## Technical Requirements

### Dependencies and Libraries

#### Core Dependencies

```json
{
  "dependencies": {
    "blessed": "^0.1.81", // Terminal UI framework
    "typescript": "^5.2.0", // Type safety and modern JS
    "uuid": "^9.0.0", // Unique ID generation
    "date-fns": "^2.30.0", // Date manipulation
    "chalk": "^5.3.0", // Terminal colors (fallback)
    "commander": "^11.0.0", // CLI argument parsing
    "conf": "^11.0.0", // Configuration management
    "fast-json-stable-stringify": "^2.1.0", // Consistent JSON serialization
    "jsonschema": "^1.4.1", // Data validation
    "lodash": "^4.17.21" // Utility functions
  },
  "devDependencies": {
    "@types/blessed": "^0.1.21", // TypeScript definitions
    "@types/node": "^20.5.0", // Node.js types
    "@types/uuid": "^9.0.2", // UUID types
    "@types/lodash": "^4.14.195", // Lodash types
    "jest": "^29.6.0", // Testing framework
    "@types/jest": "^29.5.3", // Jest types
    "ts-jest": "^29.1.1", // TypeScript Jest integration
    "ts-node": "^10.9.1", // TypeScript execution
    "nodemon": "^3.0.1", // Development file watching
    "eslint": "^8.47.0", // Code linting
    "@typescript-eslint/parser": "^6.4.0",
    "@typescript-eslint/eslint-plugin": "^6.4.0",
    "prettier": "^3.0.2" // Code formatting
  }
}
```

### Performance Considerations

#### Memory Management

- **Lazy Loading**: Load todo lists on demand
- **Virtual Scrolling**: Handle large lists efficiently
- **Data Caching**: Cache frequently accessed data
- **Memory Monitoring**: Track and optimize memory usage

#### Rendering Optimization

- **Differential Updates**: Only redraw changed UI elements
- **Debounced Input**: Throttle rapid user input
- **Async Operations**: Non-blocking file I/O
- **Progressive Loading**: Load data in chunks

#### Storage Performance

- **Incremental Saves**: Save only modified data
- **Compression**: Compress backup files
- **Indexing**: Maintain search indexes
- **Batch Operations**: Group multiple changes

### Cross-Platform Compatibility Requirements

#### File System Support

- **Path Handling**: Use cross-platform path utilities
- **Permissions**: Handle different file permission models
- **Encoding**: UTF-8 support across all platforms
- **Line Endings**: Handle CRLF vs LF differences

#### Keyboard Handling

- **Key Mappings**: Support platform-specific key combinations
- **Special Keys**: Handle function keys across platforms
- **International**: Support international keyboard layouts
- **Accessibility**: Screen reader compatibility

#### Environment Considerations

- **Home Directory**: Use appropriate user data directories
- **Environment Variables**: Support platform-specific variables
- **Package Management**: Support npm, yarn, pnpm
- **Process Management**: Handle signals appropriately


