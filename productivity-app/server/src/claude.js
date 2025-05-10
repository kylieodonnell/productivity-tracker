import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

dotenv.config();

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

export async function generateDailyReport(todayTasks, lastWeekTasks) {
  const prompt = `Generate a very concise daily productivity report (50-60 words) based on the following data:

  Today's Tasks (${new Date().toLocaleDateString()}):
  ${formatTasksForPrompt(todayTasks)}

  Last Week's Tasks (${getLastWeekDate()}):
  ${formatTasksForPrompt(lastWeekTasks)}

  Please provide:
  1. A brief summary of today's productivity
  2. A quick comparison with last week
  3. One actionable tip

  Keep it friendly and encouraging, but very concise.`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 300,
      messages: [{ role: 'user', content: prompt }],
    });
    return message.content[0].text;
  } catch (error) {
    console.error('Error generating daily report:', error);
    return "Unable to generate report at this time.";
  }
}

export async function generateTaskStatisticsReport(allTasks) {
  const prompt = `Generate a productivity insights report based on the following task data:

  ${formatTasksForPrompt(allTasks)}

  Please provide:
  1. Overall productivity patterns
  2. Focus level distribution analysis
  3. Time management insights
  4. Suggestions for improvement

  Keep the response under 200 words and make it data-driven and actionable.`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 500,
      messages: [{ role: 'user', content: prompt }],
    });
    return message.content[0].text;
  } catch (error) {
    console.error('Error generating statistics report:', error);
    return "Unable to generate report at this time.";
  }
}

function formatTasksForPrompt(tasks) {
  if (!tasks || tasks.length === 0) return "No tasks recorded.";
  
  return tasks.map(task => {
    const date = new Date(task.date).toLocaleDateString();
    let timeStr;
    
    if (typeof task.time === 'string') {
      //handle PostgreSQL time format
      const [hours, minutes] = task.time.split(':');
      if (hours === '00') {
        timeStr = `${minutes} mins`;
      } else {
        timeStr = `${hours} hrs ${minutes} mins`;
      }
    } else if (task.time?.hours) {
      timeStr = `${task.time.hours} hrs`;
    } else if (task.time?.minutes) {
      timeStr = `${task.time.minutes} mins`;
    } else {
      timeStr = 'N/A';
    }

    const focusLevel = task.focusLevel?.toLowerCase().replace('focus', '') || 'unknown';
    return `- ${task.task} (${timeStr}, ${focusLevel} focus)`;
  }).join('\n');
}

function getLastWeekDate() {
  const date = new Date();
  date.setDate(date.getDate() - 7);
  return date.toLocaleDateString();
} 