import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth"; // Імпортуємо функцію для реєстрації
import { auth } from "../services/api"; // Імпортуємо auth з Firebase

const Registration = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(""); // Для відображення помилок
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Скидаємо попередні помилки
    if (formData.password === formData.confirmPassword) {
      try {
        // Реєструємо користувача через Firebase
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        console.log("User registered:", userCredential.user);

        // Можна зберігати додаткові дані користувача, якщо потрібно (username)
        // Наприклад, у Firestore

        // Перенаправляємо на сторінку входу
        navigate("/login");
      } catch (error) {
        console.error("Registration error:", error.message);
        setError(error.message); // Встановлюємо текст помилки
      }
    } else {
      setError("Passwords do not match!"); // Встановлюємо помилку
    }
  };

  return (
    <div className="auth-container">
      <h2>Registration</h2>
      {error && <p className="error-message">{error}</p>} {/* Відображення помилок */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="User Name"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Repeat the password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        <button type="submit">Sign up</button>
      </form>
      <p>
        Already have an account? <a href="/login">Sign in</a>
      </p>
    </div>
  );
};

export default Registration;
