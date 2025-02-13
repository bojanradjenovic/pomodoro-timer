import React, { useState, useEffect, use } from "react";

const PomodoroTimer = () => {
    const [mode, setMode] = useState("pomodoro"); // "pomodoro" or "break"
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isRunning, setIsRunning] = useState(false);

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
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
    };

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
        </div>
    );
};

export default PomodoroTimer;
