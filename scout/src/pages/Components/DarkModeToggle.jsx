import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark",
  );

  useEffect(() => {
    const root = document.documentElement;

    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <button
      className="px-2 py-2 rounded-md bg-lightblue 
   dark:bg-lightblue"
      onClick={() => setDarkMode((prev) => !prev)}
    >
      {darkMode ? <Sun /> : <Moon />}
    </button>
  );
};

export default DarkModeToggle;
