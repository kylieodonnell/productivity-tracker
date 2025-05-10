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
      //reset expanded dates when new search is performed
      setExpandedDates({});
    } catch (error) {
      console.error('search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDateRange = (weekStart) => {
    const start = new Date(weekStart);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    
    return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
  };

  const groupTasksByDate = (tasks, matchDate) => {

    const groups = {};
    
    // create single group w the match date
    const date = new Date(matchDate).toLocaleDateString();
    groups[date] = tasks;
    return groups;
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
          {searchResults.matches.map((match, index) => {
            const taskGroups = groupTasksByDate(match.tasks, match.date);
            return (
              <div key={index} className={styles.searchResultGroup}>
                <div className={styles.searchResultHeader}>
                  <h4>Week of {formatDateRange(match.date)}</h4>
                  <div className={styles.similarity}>
                    Similarity: {Math.round(match.similarity * 100)}%
                  </div>
                </div>
                {Object.entries(taskGroups).map(([date, tasks]) => (
                  <div key={date} className={styles.dateGroup}>
                    <div 
                      className={styles.dateHeader}
                      onClick={() => toggleDate(date)}
                    >
                      <span className={styles.date}>{date}</span>
                      <span className={`${styles.caret} ${expandedDates[date] ? styles.caretExpanded : ''}`}>
                        ▶
                      </span>
                    </div>
                    {expandedDates[date] && (
                      <div className={styles.tasksList}>
                        {tasks.map((task) => (
                          <TaskCard
                            key={task.id}
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
            );
          })}
        </div>
      )}
    </section>
  );
} 