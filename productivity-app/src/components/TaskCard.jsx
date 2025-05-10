import styles from "../styles/App.module.css";

export function TaskCard({ task, time, focusLevel }) {
  //format the time string
  const formatTime = (time) => {
    if (typeof time === 'string') {
      return time;
    }
    if (!time) {
      return 'N/A';
    }
    
    //handle postgresql time interval format (HH:MM:SS)
    if (time.hours || time.minutes) {
      const hours = time.hours || 0;
      const minutes = time.minutes || 0;
      if (hours > 0) {
        return `${hours} hr${hours > 1 ? 's' : ''}`;
      }
      return `${minutes} min${minutes > 1 ? 's' : ''}`;
    }
    
    return time;
  };

  //convert database focus level format to CSS class
  const getFocusClass = (level) => {
    switch (level?.toLowerCase()) {
      case 'lowfocus':
        return styles.lowFocus;
      case 'mediumfocus':
        return styles.mediumFocus;
      case 'highfocus':
        return styles.highFocus;
      default:
        return '';
    }
  };
  
  return (
    <div className={`${styles.taskItem} ${getFocusClass(focusLevel)}`}>
      <div className={styles.taskGroup}>
        <span className={styles.taskLabel}>Task:</span>
        <span className={styles.taskValue}>{task}</span>
      </div>
      <div className={styles.taskGroup}>
        <span className={styles.taskLabel}>Time:</span>
        <span className={styles.taskValue}>{formatTime(time)}</span>
      </div>
    </div>
  );
}
