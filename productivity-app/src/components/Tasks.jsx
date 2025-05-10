import { useState } from "react";
import styles from "../styles/App.module.css";
import { TaskCard } from "./TaskCard";
import { WeeklyOverview } from "./WeeklyOverview";

export function Tasks({ tasks }) {
  const [expandedDates, setExpandedDates] = useState({});
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const navigateMonth = (direction) => {
    const newDate = new Date(selectedMonth);
    newDate.setMonth(newDate.getMonth() + direction);
    setSelectedMonth(newDate);
  };

  //get start and end dates for the selected month
  const getMonthDates = () => {
    const start = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1);
    const end = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0);
    return { start, end };
  };

  //filter tasks for the selected month
  const { start, end } = getMonthDates();
  const monthTasks = tasks.filter(task => {
    const taskDate = new Date(task.date);
    return taskDate >= start && taskDate <= end;
  });

  //group tasks by date for the list view
  const tasksByDate = monthTasks.reduce((acc, task) => {
    const date = new Date(task.date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(task);
    return acc;
  }, {});

  const toggleDate = (date) => {
    setExpandedDates(prev => ({
      ...prev,
      [date]: !prev[date]
    }));
  };

  const formatMonthYear = () => {
    return selectedMonth.toLocaleDateString('en-US', { 
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <section className={styles.tasksSection}>
      <h2 className={styles.sectionTitle}>All Tasks</h2>
      
      <WeeklyOverview tasks={monthTasks} />

      <div className={styles.weekNavigation}>
        <button 
          className={styles.weekNavButton}
          onClick={() => navigateMonth(-1)}
        >
          ← Previous Month
        </button>
        <div className={styles.weekRange}>
          {formatMonthYear()}
        </div>
        <button 
          className={styles.weekNavButton}
          onClick={() => navigateMonth(1)}
        >
          Next Month →
        </button>
      </div>

      <div className={styles.tasksScrollContainer}>
        {Object.entries(tasksByDate).map(([date, dateTasks]) => (
          <div key={date} className={styles.dateGroup}>
            <div 
              className={styles.dateHeader}
              onClick={() => toggleDate(date)}
              style={{ cursor: 'pointer' }}
            >
              <div className={styles.date}>
                {date}
                <span className={styles.expandIcon}>
                  {expandedDates[date] ? '▼' : '▶'}
                </span>
              </div>
            </div>
            {expandedDates[date] && (
              <div className={styles.tasksList}>
                {dateTasks.map((task) => (
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

      <div className={styles.reportSection}>
        <div className={styles.reportHeader}>Monthly Statistics</div>
        <div className={styles.reportContent}>
          You have completed {monthTasks.length} tasks this month. Your focus level distribution is:
          <ul style={{ marginTop: '10px', listStyle: 'none' }}>
            <li>High Focus: {monthTasks.filter(t => t.focusLevel === 'high' || t.focusLevel === 'highFocus').length} task(s)</li>
            <li>Medium Focus: {monthTasks.filter(t => t.focusLevel === 'medium' || t.focusLevel === 'mediumFocus').length} task(s)</li>
            <li>Low Focus: {monthTasks.filter(t => t.focusLevel === 'low' || t.focusLevel === 'lowFocus').length} task(s)</li>
          </ul>
        </div>
      </div>
    </section>
  );
} 