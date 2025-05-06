import styles from "../styles/App.module.css";
import { TaskCard } from "./TaskCard";

export function Tasks({ tasks }) {
  return (
    <section className={styles.tasksSection}>
      <h2 className={styles.sectionTitle}>All Tasks</h2>
      
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

      <div className={styles.reportSection}>
        <div className={styles.reportHeader}>Task Statistics</div>
        <div className={styles.reportContent}>
          You have completed {tasks.length} tasks today. Your focus level distribution is:
          <ul style={{ marginTop: '10px', listStyle: 'none' }}>
            <li>High Focus: {tasks.filter(t => t.focusLevel === 'high').length} task(s)</li>
            <li>Medium Focus: {tasks.filter(t => t.focusLevel === 'medium').length} task(s)</li>
            <li>Low Focus: {tasks.filter(t => t.focusLevel === 'low').length} task(s)</li>
          </ul>
        </div>
      </div>
    </section>
  );
} 