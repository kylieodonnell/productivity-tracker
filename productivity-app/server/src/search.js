import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

dotenv.config();

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

//group tasks by week
function groupTasksByWeek(tasks) {
  const weekGroups = {};
  
  tasks.forEach(task => {
    const date = new Date(task.date);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay()); //get sunday
    const weekKey = weekStart.toISOString().split('T')[0];
    
    if (!weekGroups[weekKey]) {
      weekGroups[weekKey] = [];
    }
    weekGroups[weekKey].push(task);
  });
  
  return weekGroups;
}

//format tasks for Claude
function formatTasksForPrompt(tasks) {
  return tasks.map(task => {
    const date = new Date(task.date).toLocaleDateString();
    const timeStr = task.time;
    const focusLevel = task.focusLevel?.toLowerCase().replace('focus', '') || 'unknown';
    return `- ${task.task} (${timeStr}, ${focusLevel} focus)`;
  }).join('\n');
}

export async function searchSimilarTasks(query, tasks) {
  //group tasks by week
  const weekGroups = groupTasksByWeek(tasks);
  
  //create embeddings for each week's tasks
  const weekPromises = Object.entries(weekGroups).map(async ([weekStart, weekTasks]) => {
    const tasksDescription = formatTasksForPrompt(weekTasks);
    
    const prompt = `Compare the following query with the list of tasks and rate their semantic similarity from 0 to 1, where 1 means highly similar and 0 means not similar at all. Only respond with a number between 0 and 1.

Query: "${query}"

Tasks for week of ${weekStart}:
${tasksDescription}`;

    const response = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });
    
    const similarity = parseFloat(response.content[0].text);
    
    return {
      date: weekStart,
      tasks: weekTasks,
      similarity: similarity || 0
    };
  });
  
  //wait for all similarity scores
  const results = await Promise.all(weekPromises);
  
  //sort by similarity score
  const matches = results
    .filter(result => result.similarity > 0.5) //only return reasonably similar results
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 5); //return top 5 matches
  
  return { matches };
} 