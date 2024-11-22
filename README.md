# Bull Jobs Node.js Project

## Overview
A Node.js TypeScript project exploring job queues using Bull library and Redis for distributed task processing.

## Prerequisites
- Node.js
- npm
- Redis

## Installation
1. Clone the repository
2. Install dependencies:
```bash
npm install
```

## Configuration
Create a `.env` file with the following optional configurations:
- `REDIS_HOST`: Redis host (default: localhost)
- `REDIS_PORT`: Redis port (default: 6379)
- `PORT`: Server port (default: 3000)

## Scripts
- `npm run start`: Start the main application
- `npm run server`: Run server with nodemon
- `npm run worker`: Run worker with nodemon
- `npm run test`: Run tests (currently not implemented)

## Key Components
- `server.ts`: Express server with job queue endpoint
- `Queues.ts`: Queue management class
- `worker.ts`: Worker processing logic
- `worker-standalone.ts`: Standalone worker implementation

## Job Queue Workflow
1. POST job to `/job` endpoint with queue name and job data
2. Job added to specified Redis queue
3. Worker processes job asynchronously

## Dependencies
- Bull: Job queue management
- Express: Web server
- Redis: Job queue backend

## Contribution
Feel free to open issues or submit pull requests.
