import { useState } from "react";
import styles from "../styles/App.module.css";
import { TaskCard } from "./TaskCard";

export function DailyTasks({ tasks, onAddTask }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    task: "",
    time: "",
    focusLevel: "low",
  });

  const formatDate = () => {
    const today = new Date();
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    return today.toLocaleDateString('en-US', options);
  };

  const handleAddTask = () => {
    if (newTask.task && newTask.time) {
      onAddTask(newTask);
      setNewTask({ task: "", time: "", focusLevel: "low" });
      setIsModalOpen(false);
    }
  };

  return (
    <section className={styles.tasksSection}>
      <h2 className={styles.sectionTitle}>Daily Tasks</h2>

      <div className={styles.dateHeader}>
        <div className={styles.date}>{formatDate()}:</div>
        <button
          className={styles.addButton}
          onClick={() => setIsModalOpen(true)}
        >
          +
        </button>
      </div>

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

      {isModalOpen && (
        <>
          <div
            className={styles.modalOverlay}
            onClick={() => setIsModalOpen(false)}
          />
          <div className={styles.addTaskModal}>
            <form
              className={styles.modalForm}
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="text"
                className={styles.modalInput}
                placeholder="Task name"
                value={newTask.task}
                onChange={(e) =>
                  setNewTask({ ...newTask, task: e.target.value })
                }
              />
              <input
                type="text"
                className={styles.modalInput}
                placeholder="Time (e.g., 30 mins, 2 hrs)"
                value={newTask.time}
                onChange={(e) =>
                  setNewTask({ ...newTask, time: e.target.value })
                }
              />
              <select
                className={styles.modalSelect}
                value={newTask.focusLevel}
                onChange={(e) =>
                  setNewTask({ ...newTask, focusLevel: e.target.value })
                }
              >
                <option value="low">Low Focus</option>
                <option value="medium">Medium Focus</option>
                <option value="high">High Focus</option>
              </select>
              <div className={styles.modalButtons}>
                <button
                  className={styles.modalButton}
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button className={styles.modalButton} onClick={handleAddTask}>
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      <div className={styles.reportSection}>
        <div className={styles.reportHeader}>Your Generated Report</div>
        <div className={styles.reportContent}>
          Happy Monday! Last week you were busy. You participated in 15 total
          hours of meetings, and coded for about 17 hours. On Wednesday, it
          looked like your focus was low. Try focus on scheduling deep focus
          tasks earlier this week!
        </div>
      </div>
    </section>
  );
}
