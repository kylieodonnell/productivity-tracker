import dotenv from 'dotenv';

dotenv.config();

// in memory store for tasks
let taskStore = [];

// calculate text similarity
function calculateSimilarity(text1, text2) {
  const words1 = text1.toLowerCase().split(/\s+/);
  const words2 = text2.toLowerCase().split(/\s+/);
  
  // count matching words
  const matches = words1.filter(word => words2.includes(word));
  
  // calculate similarity score (0 to 1)
  const similarity = matches.length / Math.max(words1.length, words2.length);
  return similarity;
}

// add tasks to store
export async function addTasksToVectorStore(tasks) {
  console.log('adding tasks to store:', tasks.length, 'tasks');
  taskStore = tasks;
  console.log('wooo, added tasks to store');
}

// search similar tasks, improved text similarity
export async function searchSimilarTasksVector(query, limit = 5) {
  console.log('searching for query:', query);
  
  // extract key terms from query
  const queryTerms = query.toLowerCase().split(/\s+/);
  
  // search w improved similarity
  const results = taskStore
    .map(task => {
      // create a searchable text that includes relevant information
      const taskText = `${task.task} ${task.focusLevel} ${task.time}`.toLowerCase();
      
      // calculate similarity based on word matches
      const similarity = calculateSimilarity(query, taskText);
      
      // check for specific patterns in query
      const isWeekQuery = query.toLowerCase().includes('week');
      const isDateQuery = query.toLowerCase().includes('date') || query.toLowerCase().includes('when');
      
      // adjust similarity based on context
      let adjustedSimilarity = similarity;
      if (isWeekQuery && task.date) {
        // boost similarity for week-related queries
        adjustedSimilarity += 0.2;
      }
      if (isDateQuery && task.date) {
        // boost similarity for date-related queries
        adjustedSimilarity += 0.2;
      }
      
      return {
        task: task.task,
        similarity: Math.min(adjustedSimilarity, 1), // cap at 1
        metadata: {
          id: task.id,
          date: task.date,
          focusLevel: task.focusLevel,
          time: task.time
        }
      };
    })
    .filter(result => result.similarity > 0.1) // lower threshold to catch more matches
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);

  console.log('found', results.length, 'matches');
  return results;
} 