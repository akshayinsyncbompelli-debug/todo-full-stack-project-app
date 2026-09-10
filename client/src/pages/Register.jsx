import { useState } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import api from "../api";

function Register({ setUser }) {

  const navigate = useNavigate();

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  const handleSubmit = async (event) => {

    event.preventDefault();

    setError("");

    setLoading(true);

    try {

      const response =
        await api.post(
          "api/auth/register",
          {
            name,
            email,
            password,
          }
        );

      setUser(response.data.user);

      navigate("/");

    } catch (error) {

      setError(
        error.response?.data?.message ||
        "Registration failed"
      );

    } finally {

      setLoading(false);
    }
  };


  return (
    <div className="auth-page">

      <div className="auth-card">

        <div className="brand">
          <div className="brand-icon">
            ✓
          </div>

          <h1>TaskFlow</h1>
        </div>


        <div className="auth-heading">

          <h2>Create your account</h2>

          <p>
            Start organizing your work
            today.
          </p>

        </div>


        {error && (
          <div className="error-message">
            {error}
          </div>
        )}


        <form onSubmit={handleSubmit}>

          <div className="form-group">

            <label>
              Name
            </label>

            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              required
            />

          </div>


          <div className="form-group">

            <label>
              Email
            </label>

            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              required
            />

          </div>


          <div className="form-group">

            <label>
              Password
            </label>

            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              minLength="6"
              required
            />

          </div>


          <button
            className="primary-button"
            disabled={loading}
          >
            {loading
              ? "Creating account..."
              : "Create account"}
          </button>

        </form>


        <p className="auth-footer">

          Already have an account?

          <Link to="/login">
            Sign in
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Register;