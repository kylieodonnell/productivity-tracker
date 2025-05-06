import styles from "../styles/App.module.css";

const parseTime = (timeStr) => {
  const [value, unit] = timeStr.split(" ");
  const numValue = parseFloat(value);

  if (unit.startsWith("min")) {
    return numValue;
  } else if (unit.startsWith("hr")) {
    return numValue * 60;
  }
  return 0;
};

const calculateHeight = (minutes, totalMinutes) => {
  return totalMinutes > 0 ? (minutes / totalMinutes) * 100 : 0;
};

export function Visualization({ tasks }) {
  const days = ["Su", "M", "Tu", "W", "Th", "F", "S"];
  const today = new Date("2025-05-05"); 
  const currentDay = today.getDay();

  // Group tasks by focus level
  const tasksByFocus = tasks.reduce((acc, task) => {
    const minutes = parseTime(task.time);
    if (!acc[task.focusLevel]) {
      acc[task.focusLevel] = minutes;
    } else {
      acc[task.focusLevel] += minutes;
    }
    return acc;
  }, {});

  const totalMinutes = Object.values(tasksByFocus).reduce(
    (sum, mins) => sum + mins,
    0,
  );

  // Calculate heights for each focus level
  const heights = {
    high: calculateHeight(tasksByFocus.high || 0, totalMinutes),
    medium: calculateHeight(tasksByFocus.medium || 0, totalMinutes),
    low: calculateHeight(tasksByFocus.low || 0, totalMinutes),
  };

  return (
    <section className={styles.visualizationSection}>
      <h2 className={styles.sectionTitle}>Visualization</h2>
      <div className={styles.chartContainer}>
        <div className={styles.chartTitle}>Weekly Overview</div>
        <div className={styles.weeklyChart}>
          {days.map((day, index) => (
            <div key={day} className={styles.dayColumn}>
              <div className={styles.dayLabel}>{day}</div>
              <div className={styles.dayBar}>
                {index === currentDay && (
                  <>
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
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
