import { useState } from 'react';
import styles from '../styles/App.module.css';
import { TaskCard } from './TaskCard';

export function Search() {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedDates, setExpandedDates] = useState({});

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const results = await response.json();
      console.log('server response:', results);
      setSearchResults(results);
      setExpandedDates({});
    } catch (error) {
      console.error('search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // get week start date
  const getWeekStart = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  };

  const formatDateRange = (weekStart) => {
    const start = new Date(weekStart);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    
    return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
  };

  // group tasks by week
  const groupTasksByWeek = (matches) => {
    const weekGroups = {};
    
    matches.forEach(match => {
      const weekStart = getWeekStart(match.date);
      const weekKey = weekStart.toISOString();
      
      if (!weekGroups[weekKey]) {
        weekGroups[weekKey] = {
          weekStart,
          tasks: [],
          similarity: match.similarity
        };
      }
      
      // add tasks to week group  
      match.tasks.forEach(task => {
        weekGroups[weekKey].tasks.push({
          ...task,
          date: match.date
        });
      });
    });
    
    return Object.values(weekGroups).sort((a, b) => b.weekStart - a.weekStart);
  };

  const toggleDate = (date) => {
    setExpandedDates(prev => ({
      ...prev,
      [date]: !prev[date]
    }));
  };

  return (
    <section className={styles.tasksSection}>
      <h2 className={styles.sectionTitle}>Search Tasks</h2>
      
      <form onSubmit={handleSearch} className={styles.searchForm}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g., Find weeks where I completed similar coding tasks"
          className={styles.searchInput}
        />
        <button type="submit" className={styles.searchButton}>
          Search
        </button>
      </form>

      {isLoading && (
        <div className={styles.searchLoading}>
          Searching...
        </div>
      )}

      {searchResults && (
        <div className={styles.searchResults}>
          <h3 className={styles.searchResultsTitle}>Search Results</h3>
          {groupTasksByWeek(searchResults.matches).map((weekGroup, index) => (
            <div key={index} className={styles.searchResultGroup}>
              <div className={styles.searchResultHeader}>
                <h4>Week of {formatDateRange(weekGroup.weekStart)}</h4>
                <div className={styles.similarity}>
                  Similarity: {Math.round(weekGroup.similarity * 100)}%
                </div>
              </div>
              
              {/* group tasks by date within week */}
              {Object.entries(
                weekGroup.tasks.reduce((acc, task) => {
                  const date = new Date(task.date).toLocaleDateString();
                  if (!acc[date]) acc[date] = [];
                  acc[date].push(task);
                  return acc;
                }, {})
              ).map(([date, tasks]) => (
                <div key={date} className={styles.dateGroup}>
                  <div 
                    className={styles.dateHeader}
                    onClick={() => toggleDate(date)}
                  >
                    <span className={styles.date}>{date}</span>
                    <span className={`${styles.caret} ${expandedDates[date] ? styles.caretExpanded : ''}`}>
                      {expandedDates[date] ? '▼' : '▶'}
                    </span>
                  </div>
                  {expandedDates[date] && (
                    <div className={styles.tasksList}>
                      {tasks.map((task, taskIndex) => (
                        <TaskCard
                          key={`${date}-${taskIndex}`}
                          task={task.task}
                          time={task.time}
                          focusLevel={task.focusLevel}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </section>
  );
} 