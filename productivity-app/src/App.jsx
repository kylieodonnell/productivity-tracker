import { useState, useEffect } from "react";
import styles from "./styles/App.module.css";
import { Header } from "./components/Header";
import { DailyTasks } from "./components/DailyTasks";
import { Tasks } from "./components/Tasks";
import { Search } from "./components/Search";
import { Visualization } from "./components/Visualization";
import { getTasks, getAllTasks, insertTask } from "./utils/db";

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [dailyTasks, setDailyTasks] = useState([]);
  const [allTasks, setAllTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const [fetchedDailyTasks, fetchedAllTasks] = await Promise.all([
        getTasks(),
        getAllTasks()
      ]);
      setDailyTasks(fetchedDailyTasks);
      setAllTasks(fetchedAllTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleAddTask = async (newTask) => {
    try {
      const insertedTask = await insertTask(newTask);
      setDailyTasks([...dailyTasks, insertedTask]);
      setAllTasks([insertedTask, ...allTasks]);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case "tasks":
        return (
          <div className={styles.singleColumn}>
            <Tasks tasks={allTasks} />
          </div>
        );
      case "search":
        return (
          <div className={styles.singleColumn}>
            <Search tasks={allTasks} />
          </div>
        );
      default:
        return (
          <>
            <DailyTasks tasks={dailyTasks} onAddTask={handleAddTask} />
            <Visualization tasks={allTasks} />
          </>
        );
    }
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400&display=swap"
        rel="stylesheet"
      />
      <div className={styles.container}>
        <Header onNavigate={setCurrentPage} />
        <main className={styles.mainContent}>
          {renderPage()}
        </main>
      </div>
    </>
  );
}

export default App;
