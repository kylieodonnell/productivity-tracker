import { useState } from "react";
import styles from "./styles/App.module.css";
import { Header } from "./components/Header";
import { DailyTasks } from "./components/DailyTasks";
import { Tasks } from "./components/Tasks";
import { Visualization } from "./components/Visualization";

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [tasks, setTasks] = useState([
    { id: 1, task: "Break", time: "10 mins", focusLevel: "low" },
    { id: 2, task: "Team Meeting", time: "3 hrs", focusLevel: "medium" },
    { id: 3, task: "Wrote Code", time: "2 hrs", focusLevel: "high" },
  ]);

  const handleAddTask = (newTask) => {
    setTasks([...tasks, { ...newTask, id: Date.now() }]);
  };

  const renderPage = () => {
    switch (currentPage) {
      case "tasks":
        return <Tasks tasks={tasks} />;
      case "search":
        return <div>Search Page Coming Soon</div>;
      default:
        return (
          <>
            <DailyTasks tasks={tasks} onAddTask={handleAddTask} />
            <Visualization tasks={tasks} />
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
