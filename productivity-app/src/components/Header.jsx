import { useState } from "react";
import styles from "../styles/App.module.css";

export function Header({ onNavigate }) {
  const [activePage, setActivePage] = useState("home");

  const handleNavigation = (page) => {
    setActivePage(page);
    if (onNavigate) {
      onNavigate(page);
    }
  };

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>PRODUCTIVITY TRACKER</h1>
      <nav className={styles.navigation}>
        <div 
          className={`${styles.navLink} ${activePage === "home" ? styles.active : ""}`}
          onClick={() => handleNavigation("home")}
        >
          HOME
        </div>
        <div 
          className={`${styles.navLink} ${activePage === "tasks" ? styles.active : ""}`}
          onClick={() => handleNavigation("tasks")}
        >
          TASKS
        </div>
        <div 
          className={`${styles.navLink} ${activePage === "search" ? styles.active : ""}`}
          onClick={() => handleNavigation("search")}
        >
          SEARCH
        </div>
      </nav>
    </header>
  );
}
