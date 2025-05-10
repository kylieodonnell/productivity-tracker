# Technical Decisions & Rationale

## Frontend Choices

### React + Vite

I went with React because it's what I know best and it's perfect for this kind of interactive app. I used Vite as the build tool because it's fast, modern, and the dev server is super quick. 

### CSS Modules

Kept it simple with CSS Modules. No need for Tailwind or other CSS frameworks when I can write clean, scoped CSS that does exactly what I need. The styles are component-specific and I don't have to worry about naming conflicts. It also keeps it cleaner with having all the css in a different file. Tailwind can get messy sometimes. 

## Backend Architecture

### Express + PostgreSQL

Express is lightweight and perfect for this use case. No need for a full-featured framework like NestJS when I just need a simple API server. I chose PostgreSQL database because it's reliable, handles JSON well, and the time/date functions are exactly what I needed for task tracking.

### Database Design

Kept the schema super simple:

- `id`: Auto-incrementing primary key
- `date`: For task dates
- `focuslevel`: For tracking focus levels (low/medium/high)
- `description`: The actual task
- `time`: Time spent on task

I felt like these were the most important data points needed from each task. 

## AI Integration

### Claude API

Went with Claude for the AI features because:

1. The API is straightforward to use
2. The responses are high quality
3. It's great at understanding context and generating natural language

Using it for:

- Daily reports
- Task statistics
- Semantic search

### Vector Store (ChromaDB)

Added ChromaDB for semantic search because:

1. It's lightweight and runs locally
2. No need for a separate vector database service
3. Perfect for storing and searching task embeddings

## Development Tools

### Postico2

Using Postico2 for database management because:

1. Clean, simple interface
2. Easy to run SQL queries
3. Great for viewing and editing data directly

### Environment Setup

Kept the setup process straightforward:

1. Clone the repo
2. Install dependencies
3. Set up PostgreSQL
4. Add your Claude API key
5. Import the sample data

It's meant to run locally, so I didn't want to complicate things too much. 

## Future Considerations

Might add:

1. User authentication (if this was a fully fleshed out app)
2. More visualization options
3. Export/import features
4. Mobile responsiveness improvements

But for now, it does exactly what I need it to do, track tasks, generate insights, and helps me stay productive.
