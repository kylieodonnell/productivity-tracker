const API_URL = 'http://localhost:3001/api';

//get tasks from the database
export async function getTasks() {
  try {
    const response = await fetch(`${API_URL}/tasks`);
    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
}

//get all tasks from the database
export async function getAllTasks() {
  try {
    const response = await fetch(`${API_URL}/all-tasks`);
    if (!response.ok) {
      throw new Error('Failed to fetch all tasks');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching all tasks:', error);
    throw error;
  }
}

//insert a task into the database
export async function insertTask(taskData) {
  try {
    const response = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to add task');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error adding task:', error);
    throw error;
  }
}


//get daily report from the database
export async function getDailyReport() {
  try {
    const response = await fetch('http://localhost:3001/api/daily-report');
    if (!response.ok) {
      throw new Error('Failed to fetch daily report');
    }
    const data = await response.json();
    return data.report;
  } catch (error) {
    console.error('Error fetching daily report:', error);
    return "Unable to generate daily report at this time.";
  }
}

//get task statistics from the database
export async function getTaskStatistics() {
  try {
    const response = await fetch('http://localhost:3001/api/task-statistics');
    if (!response.ok) {
      throw new Error('Failed to fetch task statistics');
    }
    const data = await response.json();
    return data.report;
  } catch (error) {
    console.error('Error fetching task statistics:', error);
    return "Unable to generate task statistics at this time.";
  }
} 