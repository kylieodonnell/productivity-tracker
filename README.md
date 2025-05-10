# productivity-tracker

## Setup

### a) For the Frontend, run

```bash
cd productivity-app
npm install
npm run dev
```

### b) For the backend, run (in a separate terminal)

```bash
cd productivity-app/server
npm install
npm start
```

### c) Set up own .env

1. Create a `.env` file in the `productivity-app/server` directory
2. Add your Claude API key:

```
CLAUDE_API_KEY=your_api_key_here
```

Make sure you have PostgreSQL installed and running locally.

### d) Database Setup

1. Create a new PostgreSQL database named 'productivity'
2. Create the tasks table with the following schema:

```sql
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    focuslevel VARCHAR(20) NOT NULL,
    description TEXT NOT NULL,
    time TIME NOT NULL
);
```

3. Modify the database connection in `server.js` to match your PostgreSQL setup:

```javascript
//database connection
const pool = new Pool({
  user: 'YOUR_POSTGRES_USERNAME',  // usually your system username
  host: 'localhost',
  database: 'productivity',
  password: 'YOUR_POSTGRES_PASSWORD', // if you set one
  port: 5432,
});
```

### e) Importing Existing Data

1. Navigate to the `productivity-app/server/scripts` directory
2. There should be a tasks.csv within the folder.
3. Run the import script:

```bash
cd productivity-app/server/scripts
psql -d productivity -f import_tasks.sql
```

### f) Viewing the DB

I personally use Postico2 and that's how I created my local db. I like Postico2 because you're able to actually view the tables and run SQL commands within the application.
