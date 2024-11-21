import React, { useState } from "react";

const TaskItem = ({ task, onUpdateTask, onDeleteTask }) => {
  const [isEditing, setIsEditing] = useState(false); // Чи перебуває завдання в режимі редагування
  const [editedTitle, setEditedTitle] = useState(task.title); // Редагований текст завдання

  // Функція для початку редагування
  const handleEdit = () => {
    setIsEditing(true);
  };

  // Функція для збереження змін
  const handleSave = () => {
    if (editedTitle.trim() !== "") {
      onUpdateTask({ ...task, title: editedTitle }); // Оновлення тексту завдання
      setIsEditing(false); // Вихід з режиму редагування
    }
  };

  // Функція для скасування редагування
  const handleCancel = () => {
    setIsEditing(false);
    setEditedTitle(task.title); // Повернення до попереднього тексту
  };

  return (
    <div className="task-item">
      {isEditing ? (
  // Режим редагування
  <div className="edit-mode">
    <input
      type="text"
      value={editedTitle}
      onChange={(e) => setEditedTitle(e.target.value)}
      className="edit-input"
    />
    <div className="edit-buttons">
      <button className="save-btn" onClick={handleSave}>
        Save
      </button>
      <button className="cancel-btn" onClick={handleCancel}>
        Cancel
      </button>
    </div>
  </div>
) : (
  // Звичайний режим
  <>
    <div className="task-content">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() =>
          onUpdateTask({ ...task, completed: !task.completed })
        }
      />
      <span>{task.title}</span>
    </div>
    <div className="task-actions">
      <button className="edit-btn" onClick={handleEdit}>
        ✏️
      </button>
      <button
        className="delete-btn"
        onClick={() => onDeleteTask(task.id)}
      >
        🗑️
      </button>
    </div>
  </>
)}


    </div>
  );
};

export default TaskItem;
