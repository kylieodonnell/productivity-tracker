import { useState } from "react";
import styles from "../styles/App.module.css";
import { parseTime, formatWeekRange, getFocusLevel, getDateForDay, formatDate, calculateHeight } from "../utils/chartUtils";


export function WeeklyOverview({ tasks }) {
  const days = ["Su", "M", "Tu", "W", "Th", "F", "S"];
  const [selectedWeek, setSelectedWeek] = useState(new Date());

  const navigateWeek = (direction) => {
    const newDate = new Date(selectedWeek);
    newDate.setDate(newDate.getDate() + (direction * 7));
    setSelectedWeek(newDate);
  };

  //group tasks by date
  const tasksByDate = tasks.reduce((acc, task) => {
    const taskDate = task.date.split('T')[0];
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
    60
  );

  return (
    <div className={styles.weeklyOverview}>
      <div className={styles.weekNavigation}>
        <button 
          className={styles.weekNavButton}
          onClick={() => navigateWeek(-1)}
        >
          ← Previous Week
        </button>
        <div className={styles.weekRange}>
          {formatWeekRange(selectedWeek)}
        </div>
        <button 
          className={styles.weekNavButton}
          onClick={() => navigateWeek(1)}
        >
          Next Week →
        </button>
      </div>

      <div className={styles.weeklyChart}>
        {days.map((day, index) => {
          const date = getDateForDay(selectedWeek, index);
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
  );
} 