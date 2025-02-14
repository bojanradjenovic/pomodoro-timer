import React, { useState, useEffect, use } from "react";

const PomodoroTimer = () => {
    const [mode, setMode] = useState("pomodoro"); // "pomodoro" or "break"
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isRunning, setIsRunning] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState("");
    const [pomodorosNeeded, setPomodorosNeeded] = useState(1);
    const [activeTask, setActiveTask] = useState(null);
    
    useEffect(() => {
        if (!isRunning) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(timer);
    }, [isRunning]);
    
    useEffect(() => {
        if (timeLeft === 0) {
            new Audio("/alarm.mp3").play();
            setMode((prev) => (prev === "pomodoro" ? "break" : "pomodoro"));
            setTimeLeft(mode === "pomodoro" ? 5 * 60 : 25 * 60);
            setIsRunning(false);
            if (activeTask !== null) {
                setTasks((prevTasks) =>
                  prevTasks.map((task, index) =>
                    index === activeTask ? { ...task, pomodorosLeft: Math.max(task.pomodorosLeft - 1, 0) } : task
                  )
                );
              }
            }
    }, [timeLeft]);

    useEffect(() => {
        if(Notification.permission !== "granted") {
            Notification.requestPermission();
        }
    });

    useEffect(() => {
        if(timeLeft === 0 && Notification.permission === "granted") {
            new Notification(mode === "pomodoro" ? "Break time! :3" : "Focus time!");
        }
    }, [timeLeft]);

    useEffect(() => {
        const savedTasks = localStorage.getItem("tasks");
        if(savedTasks){
            setTasks(JSON.parse(savedTasks));
        }
    }, []);
    useEffect(() => {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }
    , [tasks]);
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
    };

    const addTask = () => {
        if(newTask.trim === "" || pomodorosNeeded < 1) return;
        setTasks([...tasks, {name: newTask, pomodorosLeft: pomodorosNeeded, completed: false}]);
        setNewTask("");
        setPomodorosNeeded(1);

    };

    const toggleTaskCompletion = (index) => {
        setTasks((prevTasks) =>
          prevTasks.map((task, i) => (i === index ? { ...task, completed: !task.completed } : task))
        );
      };
    const startTask = (index) => {
        setActiveTask(index);
    };

    useEffect(() => {
        document.title = `${formatTime(timeLeft)} - Pomodoro Timer`;
    }
    , [timeLeft]);
    return (
        <div>
        <h1>Pomodoro Timer</h1>
        <h2>{mode === "pomodoro" ? "Time to focus!" : "Take a break! :3"}</h2>
        <h2>{formatTime(timeLeft)}</h2>
        <button onClick={() => setIsRunning(!isRunning)}>
        {isRunning ? "Pause" : "Start"}
        </button>
        <button
        onClick={() => {
            setMode("pomodoro");
            setTimeLeft(25 * 60);
            setIsRunning(false);
        }}
        >
        Reset
        </button>
        <h2>Tasks</h2>
        <input
        type="text"
        placeholder="Task name"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)} 
        />
        <input
        type="number"
        min="1"
        value={pomodorosNeeded}
        onChange={(e) => setPomodorosNeeded(Number(e.target.value))}
        />
        <button onClick={addTask}>Add Task</button>

        <ul>
        {tasks.map((task, index) => (
          <li key={index} style={{ textDecoration: task.completed ? "line-through" : "none" }}>
            <input type="checkbox" checked={task.completed} onChange={() => toggleTaskCompletion(index)} />
            {task.name} - {task.pomodorosLeft} Pomodoros Left
            {!task.completed && (
              <button onClick={() => startTask(index)}>Focus</button>
            )}
          </li>
        ))}
        </ul>
        </div>
    );
};

export default PomodoroTimer;
