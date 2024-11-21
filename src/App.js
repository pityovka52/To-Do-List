import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth"; // Firebase auth функції
import { collection, query, where, onSnapshot } from "firebase/firestore"; // Firestore функції
import { auth, db } from "./services/api"; // Firebase сервіси
import Registration from "./components/Registration";
import Login from "./components/Login";
import TaskList from "./components/TaskList";
import TaskForm from "./components/TaskForm";
import "./App.css";

const App = () => {
  const [user, setUser] = useState(null); // Стан авторизації
  const [tasks, setTasks] = useState([]); // Завдання
  const [error, setError] = useState(""); // Для повідомлень про помилки

  // Відстеження стану авторизації користувача
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchTasks(currentUser.uid); // Завантажуємо завдання користувача
      } else {
        setUser(null);
        setTasks([]); // Очищаємо завдання при виході
      }
    });
    return () => unsubscribe(); // Відписуємося при розмонтуванні
  }, []);

  // Завантаження завдань з Firestore
  const fetchTasks = (userId) => {
    try {
      const q = query(collection(db, "tasks"), where("userId", "==", userId));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const tasksData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTasks(tasksData);
      });
      return unsubscribe;
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setError("Failed to load tasks");
    }
  };

  // Вихід із системи
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
      setError("Failed to log out");
    }
  };

  return (
    <Router>
      <div className="app">
        <header className="header">
          <h1>ToDo List</h1>
          {user && (
            <div className="user">
              <span>{user.email}</span>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </header>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/login" element={<Login onLogin={(user) => setUser(user)} />} />
          <Route
            path="/tasks"
            element={
              user ? (
                <div className="todo-container">
                  <TaskForm />
                  <TaskList />
                </div>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
        {error && <p className="error-message">{error}</p>} {/* Відображення помилок */}
      </div>
    </Router>
  );
};

export default App;
