import dotenv from 'dotenv';

dotenv.config();

// in memory store for tasks
let taskStore = [];

// format time object into readable string
function formatTime(timeObj) {
  if (typeof timeObj === 'object' && timeObj !== null) {
    if ('minutes' in timeObj) {
      return `${timeObj.minutes} minutes`;
    }
    if ('hours' in timeObj) {
      return `${timeObj.hours} hours`;
    }
  }
  return timeObj || '';
}

// check if words match, including variations
// works so it also matches for words like "code" and "coded" 
function wordsMatch(word1, word2) {
  word1 = word1.toLowerCase();
  word2 = word2.toLowerCase();
  
  if (word1 === word2) return true;
  if (word1.includes(word2) || word2.includes(word1)) return true;
  
  const baseWord1 = word1.replace(/(ed|ing|s)$/, '');
  const baseWord2 = word2.replace(/(ed|ing|s)$/, '');
  
  return baseWord1 === baseWord2;
}

// calculate similarity between query and task
function calculateSimilarity(query, taskText) {
  const words1 = query.toLowerCase().split(/\s+/);
  const words2 = taskText.toLowerCase().split(/\s+/);
  
  const matches = words1.filter(word1 => 
    words2.some(word2 => wordsMatch(word1, word2))
  );
  
  //set similarity to 0
  let similarity = 0;
  
  //calculate similarity based on number of matches
  if (matches.length > 0) {
    similarity = (matches.length / Math.max(words1.length, words2.length)) * 0.4;
  }
  
  if (taskText.toLowerCase().includes(query.toLowerCase())) {
    similarity += 0.3;
  }
  
  if (similarity < 0.10) {
    return 0;
  }
  
  return Math.min(similarity, 1);
}

// add tasks to store
export async function addTasksToVectorStore(tasks) {
  taskStore = tasks;
}

// search for similar tasks
export async function searchSimilarTasksVector(query, limit = 5) {
  const results = taskStore
    .map(task => {
      const focusLevel = task.focusLevel?.replace('Focus', '').toLowerCase() || '';
      
      const taskText = [
        task.task || task.description,
        focusLevel,
        formatTime(task.time)
      ].filter(Boolean).join(' ').toLowerCase();
      
      const similarity = calculateSimilarity(query, taskText);
      
      return {
        task: task.task || task.description,
        similarity,
        metadata: {
          id: task.id,
          date: task.date,
          focusLevel: task.focusLevel,
          time: task.time
        }
      };
    })
    .filter(result => result.similarity >= 0.10)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);
  
  return results;
} 