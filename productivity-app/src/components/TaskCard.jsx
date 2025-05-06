import { useState } from "react";
import styles from "../styles/App.module.css";

export function TaskCard({ task, time, focusLevel }) {
  const focusColors = {
    low: styles.lowFocus,
    medium: styles.mediumFocus,
    high: styles.highFocus,
  };

  return (
    <div className={`${styles.taskItem} ${focusColors[focusLevel]}`}>
      <div className={styles.taskGroup}>
        <span className={styles.taskLabel}>Task:</span>
        <span className={styles.taskValue}>{task}</span>
      </div>
      <div className={styles.taskGroup}>
        <span className={styles.taskLabel}>Time:</span>
        <span className={styles.taskValue}>{time}</span>
      </div>
    </div>
  );
}
