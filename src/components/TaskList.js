import React, { useEffect, useState } from "react";
import TaskItem from "./TaskItem";
import { collection, query, where, onSnapshot, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db, auth } from "../services/api"; // Імпортуємо Firestore та auth

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTasks = () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setError("User not logged in");
          return;
        }

        const q = query(collection(db, "tasks"), where("userId", "==", user.uid));

        // Відслідковуємо зміни у Firestore
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const tasksData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setTasks(tasksData);
        });

        return unsubscribe; // Відписка від оновлень при розмонтуванні компонента
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setError("Failed to load tasks");
      }
    };

    const unsubscribe = fetchTasks();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleUpdateTask = async (updatedTask) => {
    try {
      const taskDocRef = doc(db, "tasks", updatedTask.id);
      await updateDoc(taskDocRef, { ...updatedTask });
    } catch (error) {
      console.error("Error updating task:", error);
      setError("Failed to update task");
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const taskDocRef = doc(db, "tasks", taskId);
      await deleteDoc(taskDocRef);
    } catch (error) {
      console.error("Error deleting task:", error);
      setError("Failed to delete task");
    }
  };

  return (
    <div className="task-list">
      {error && <p className="error-message">{error}</p>}
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
        />
      ))}
    </div>
  );
};

export default TaskList;
