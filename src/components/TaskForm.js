import React, { useState } from "react";
import { addDoc, collection } from "firebase/firestore"; // Імпортуємо функції для роботи з Firestore
import { db, auth } from "../services/api"; // Імпортуємо Firebase db та auth

const TaskForm = ({ onAddTask }) => {
  const [title, setTitle] = useState("");
  const [error, setError] = useState(""); // Для відображення помилок

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Очищуємо помилки
    if (title.trim() !== "") {
      try {
        const user = auth.currentUser; // Отримуємо поточного користувача
        if (!user) {
          throw new Error("User is not logged in"); // Користувач повинен бути авторизованим
        }

        const newTask = {
          title,
          completed: false,
          userId: user.uid, // Додаємо ідентифікатор користувача
          createdAt: new Date(),
        };

        // Зберігаємо завдання у Firestore
        const docRef = await addDoc(collection(db, "tasks"), newTask);
        console.log("Task added with ID:", docRef.id);

        if (onAddTask) onAddTask({ id: docRef.id, ...newTask }); // Опціонально додаємо завдання у локальний список
        setTitle(""); // Очищуємо поле вводу
      } catch (error) {
        console.error("Error adding task:", error);
        setError(error.message); // Встановлюємо повідомлення про помилку
      }
    } else {
      setError("Task title cannot be empty"); // Перевірка на порожнє значення
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      {error && <p className="error-message">{error}</p>} {/* Відображення помилок */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What is today's task?"
      />
      <button type="submit">Add</button>
    </form>
  );
};

export default TaskForm;
