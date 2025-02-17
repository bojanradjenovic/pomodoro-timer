import React, { useState, useEffect, use } from "react";
import './PomodoroTimer.css'
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
    
    const deleteTask = (index) => {
        setTasks((prevTasks) => prevTasks.filter((_, i) => i !== index));
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
        <div className="bg-gray-900 flex flex-col items-center justify-center min-h-screen">
        <div className="text-white bg-gray-800 shadow-x1 rounded-lg p-6 w-full max-w-md">
            <h1 className="text-3xl font-bold text-center">Pomodoro Timer</h1>
            <h2 className="text-xl text-center mt-2">{mode === "pomodoro" ? "Time to focus!" : "Take a break! :3"}</h2>
            <h2 className="text-4xl font-mono text-center my-4">{formatTime(timeLeft)}</h2>
            <div className="flex justify-center gap-4">
            <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-md cursor-pointer" 
            onClick={() => setIsRunning(!isRunning)}>
            {isRunning ? "Pause" : "Start"}
            </button>
            <button className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-md cursor-pointer"
            onClick={() => {
            setMode("pomodoro");
            setTimeLeft(25 * 60);
            setIsRunning(false);
            }}
            >
            Reset
            </button>
            </div>
        <h2 className="mt-6 text-xl font-semibold">Tasks</h2>
        <input
        className="mt-1 p-2 bg-gray-700 rounded-md w-full focus:outline-none"
        type="text"
        placeholder="Task name"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)} 
        />
        <input
        type="number"
        className="mt-2 p-2 bg-gray-700 rounded-md w-full focus:outline-none"
        min="1"
        value={pomodorosNeeded}
        onChange={(e) => setPomodorosNeeded(Number(e.target.value))}
        />
        <button className="mt-2 px-4 py-2 bg-green-500 hover:bg-green-600 rounded-md cursor-pointer" onClick={addTask}>Add Task</button>

        <ul className="mt-4 space-y-2">
        {tasks.map((task, index) => (
          <li key={index} className="flex justify-between items-center bg-gray-700 p-2 rounded-md">
            <div className="flex items-center gap-2">
            <input type="checkbox" checked={task.completed} onChange={() => toggleTaskCompletion(index)} />
            {task.name} - {task.pomodorosLeft} Pomodoros Left
            </div>
            <div className="flex gap-2">
            {!task.completed && (
              <button className="px-2 py-1 bg-yellow-500 hover:bg-yellow-600 rounded-md cursor-pointer"
              onClick={() => startTask(index)}>Focus</button>
            )}
            <button className="px-2 py-1 bg-red-500 hover:bg-red-600 rounded-md cursor-pointer"
            onClick={() => deleteTask(index)}>Delete</button>
            </div>
          </li>

        ))}
        </ul>
        </div>
        </div>
    );
};

export default PomodoroTimer;
