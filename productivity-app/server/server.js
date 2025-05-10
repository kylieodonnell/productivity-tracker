import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import { generateDailyReport, generateTaskStatisticsReport } from './src/claude.js';
import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
import { searchSimilarTasks } from './src/search.js';

dotenv.config();

const app = express();
const port = 3001;

//initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

//middleware
app.use(cors());
app.use(express.json());

//database connection
const pool = new Pool({
  user: 'kylieodonnell',
  host: 'localhost',
  database: 'productivity',
  password: '', 
  port: 5432,
});

//test Claude API connection
app.get('/api/test-ai', async (req, res) => {
  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 100,
      messages: [{ role: 'user', content: "Claude API is working!'" }],
    });
    
    res.json({ 
      success: true, 
      message: message.content[0].text,
      apiKeyPresent: !!process.env.CLAUDE_API_KEY 
    });
  } catch (error) {
    console.error('Error testing Claude API:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      apiKeyPresent: !!process.env.CLAUDE_API_KEY 
    });
  }
});

//get all tasks
app.get('/api/all-tasks', async (req, res) => {
  let client;
  try {
    client = await pool.connect();
    const query = `
      SELECT id, date, focuslevel as "focusLevel", description as task, time
      FROM tasks
      ORDER BY date DESC, id DESC;
    `;
    const result = await client.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching all tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  } finally {
    if (client) {
      client.release();
    }
  }
});

//get today's tasks
app.get('/api/tasks', async (req, res) => {
  let client;
  try {
    client = await pool.connect();
    const query = `
      SELECT id, date, focuslevel as "focusLevel", description as task, time
      FROM tasks
      WHERE date = CURRENT_DATE
      ORDER BY id DESC;
    `;
    const result = await client.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching daily tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  } finally {
    if (client) {
      client.release();
    }
  }
});

//add a new task
app.post('/api/tasks', async (req, res) => {
  let client;
  try {
    const { task: description, time, focusLevel } = req.body;
    
    if (!description || !time || !focusLevel) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    //convert focus level to match database constraints
    const dbFocusLevel = focusLevel === 'low' ? 'lowFocus' :
                        focusLevel === 'medium' ? 'mediumFocus' :
                        'highFocus';
    
    //parse time string to extract hours and minutes
    let timeValue;
    if (typeof time === 'string') {
      const timeMatch = time.match(/(\d+)\s*(hrs?|mins?)/i);
      if (timeMatch) {
        const value = parseInt(timeMatch[1]);
        const unit = timeMatch[2].toLowerCase();
        timeValue = unit.startsWith('hr') ? `${value}:00:00` : `00:${value}:00`;
      } else {
        return res.status(400).json({ error: 'Invalid time format' });
      }
    } else {
      timeValue = time;
    }
    
    client = await pool.connect();
    const query = `
      INSERT INTO tasks (date, focuslevel, description, time)
      VALUES (CURRENT_DATE, $1, $2, $3)
      RETURNING id, date, focuslevel as "focusLevel", description as task, time;
    `;
    const values = [dbFocusLevel, description, timeValue];
    const result = await client.query(query, values);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error adding task:', error);
    res.status(500).json({ error: 'Failed to add task' });
  } finally {
    if (client) {
      client.release();
    }
  }
});

//new endpoint for daily report
//generate a daily report based on today's tasks and last week's tasks
app.get('/api/daily-report', async (req, res) => {
  const client = await pool.connect();
  try {
    //get today's tasks
    const today = new Date().toISOString().split('T')[0];
    const todayResult = await client.query(
      'SELECT * FROM tasks WHERE date::date = $1 ORDER BY id',
      [today]
    );

    //get last week's tasks
    const lastWeekStart = new Date();
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);
    const lastWeekEnd = new Date();
    lastWeekEnd.setDate(lastWeekEnd.getDate() - 1);
    
    const lastWeekResult = await client.query(
      'SELECT * FROM tasks WHERE date::date BETWEEN $1 AND $2 ORDER BY date, id',
      [lastWeekStart.toISOString().split('T')[0], lastWeekEnd.toISOString().split('T')[0]]
    );

    const report = await generateDailyReport(todayResult.rows, lastWeekResult.rows);
    res.json({ report });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});

//generate a task statistics report based on all tasks
app.get('/api/task-statistics', async (req, res) => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM tasks ORDER BY date DESC, id');
    const report = await generateTaskStatisticsReport(result.rows);
    res.json({ report });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});

//semantic search for similar tasks
app.post('/api/search', async (req, res) => {
  const client = await pool.connect();
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }
    
    //get all tasks
    const result = await client.query(`
      SELECT id, date, focuslevel as "focusLevel", description as task, time
      FROM tasks
      ORDER BY date DESC, id DESC;
    `);
    
    //perform semantic search
    const searchResults = await searchSimilarTasks(query, result.rows);
    res.json(searchResults);
  } catch (error) {
    console.error('Error performing search:', error);
    res.status(500).json({ error: 'Failed to perform search' });
  } finally {
    client.release();
  }
});

//start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 