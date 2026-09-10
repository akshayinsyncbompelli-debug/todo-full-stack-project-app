import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import TodoForm from "../components/TodoForm";
import TodoList from "../components/TodoList";

import api from "../api";

function Dashboard({ user, setUser }) {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  // ========================================
  // FETCH TODOS
  // ========================================
  const fetchTodos = async () => {
    try {
      const response = await api.get("/api/todos");

      setTodos(response.data);
    } catch (error) {
      console.log(
        "Fetch todos error:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // ========================================
  // ADD TODO
  // ========================================
  const addTodo = (todo) => {
    setTodos((previous) => [
      todo,
      ...previous,
    ]);
  };

  // ========================================
  // UPDATE TODO
  // ========================================
  const updateTodo = (updatedTodo) => {
    setTodos((previous) =>
      previous.map((todo) =>
        todo._id === updatedTodo._id
          ? updatedTodo
          : todo
      )
    );
  };

  // ========================================
  // DELETE TODO
  // ========================================
  const deleteTodo = (id) => {
    setTodos((previous) =>
      previous.filter(
        (todo) => todo._id !== id
      )
    );
  };

  // ========================================
  // COMPLETED COUNT
  // ========================================
  const completedCount = todos.filter(
    (todo) => todo.completed
  ).length;

  return (
    <div className="app-shell">

      <Navbar
        user={user}
        setUser={setUser}
      />

      <main className="dashboard">

        {/* ========================================
            WELCOME SECTION
        ======================================== */}
        <section className="welcome-section">

          <div>

            <span className="eyebrow">
              YOUR WORKSPACE
            </span>

            <h1>
              Good morning,{" "}
              <span>
                {user?.name || "User"}
              </span>
            </h1>

            <p>
              Stay focused. Get things done.
            </p>

          </div>

          <div className="stats-card">

            <div className="stat-number">
              {completedCount}
            </div>

            <div>

              <strong>
                Completed
              </strong>

              <span>
                of {todos.length} tasks
              </span>

            </div>

          </div>

        </section>

        {/* ========================================
            ADD TODO FORM
        ======================================== */}
        <TodoForm
          onTodoAdded={addTodo}
        />

        {/* ========================================
            TODO SECTION
        ======================================== */}
        <section className="todo-section">

          <div className="section-heading">

            <div>

              <h2>
                Your tasks
              </h2>

              <p>
                {todos.length}{" "}
                {todos.length === 1
                  ? "task"
                  : "tasks"}{" "}
                in total
              </p>

            </div>

          </div>

          {/* ========================================
              LOADING / TODO LIST
          ======================================== */}
          {loading ? (

            <div className="empty-state">
              Loading your tasks...
            </div>

          ) : (

            <TodoList
              todos={todos}
              onTodoUpdated={updateTodo}
              onTodoDeleted={deleteTodo}
            />

          )}

        </section>

      </main>

    </div>
  );
}

export default Dashboard;