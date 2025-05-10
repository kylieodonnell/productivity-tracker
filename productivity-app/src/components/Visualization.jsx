import styles from "../styles/App.module.css";
import { parseTime, getFocusLevel, getDateForDay, formatDate, calculateHeight } from "../utils/chartUtils";


export function Visualization({ tasks }) {
  const days = ["Su", "M", "Tu", "W", "Th", "F", "S"];
  
  //get the most recent date from the tasks
  const mostRecentDate = tasks.length > 0 
    ? new Date(Math.max(...tasks.map(task => new Date(task.date))))
    : new Date();

  //group tasks by date
  const tasksByDate = tasks.reduce((acc, task) => {
    const taskDate = task.date.split('T')[0]; //get YYYY-MM-DD format
    if (!acc[taskDate]) {
      acc[taskDate] = { high: 0, medium: 0, low: 0 };
    }
    const minutes = parseTime(task.time);
    const uiFocusLevel = getFocusLevel(task.focusLevel);
    acc[taskDate][uiFocusLevel] += minutes;
    return acc;
  }, {});

  //calculate total minutes for each day to get relative heights
  const maxTotalMinutes = Math.max(
    ...Object.values(tasksByDate).map(dayTasks =>
      Object.values(dayTasks).reduce((sum, mins) => sum + mins, 0)
    ),
    60 //minimum value to prevent division by zero and too small bars
  );

  return (
    <section className={styles.visualizationSection}>
      <h2 className={styles.sectionTitle}>Visualization</h2>
      <div className={styles.chartContainer}>
        <div className={styles.chartTitle}>Weekly Overview</div>
        <div className={styles.weeklyChart}>
          {days.map((day, index) => {
            const date = getDateForDay(mostRecentDate, index);
            const dateStr = formatDate(date);
            const dayTasks = tasksByDate[dateStr] || { high: 0, medium: 0, low: 0 };
            
            const heights = {
              high: calculateHeight(dayTasks.high, maxTotalMinutes),
              medium: calculateHeight(dayTasks.medium, maxTotalMinutes),
              low: calculateHeight(dayTasks.low, maxTotalMinutes),
            };

            return (
              <div key={day} className={styles.dayColumn}>
                <div className={styles.dayLabel}>{day}</div>
                <div className={styles.dayBar}>
                  {heights.high > 0 && (
                    <div
                      className={`${styles.stackedBar} ${styles.highFocus}`}
                      style={{ height: `${heights.high}%` }}
                    />
                  )}
                  {heights.medium > 0 && (
                    <div
                      className={`${styles.stackedBar} ${styles.mediumFocus}`}
                      style={{ height: `${heights.medium}%` }}
                    />
                  )}
                  {heights.low > 0 && (
                    <div
                      className={`${styles.stackedBar} ${styles.lowFocus}`}
                      style={{ height: `${heights.low}%` }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
