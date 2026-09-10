import { useState } from "react";

import api from "../api";

function TodoForm({
  onTodoAdded,
}) {

  const [title, setTitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  const handleSubmit = async (event) => {

    event.preventDefault();

    if (!title.trim()) {
      return;
    }

    setLoading(true);

    try {

      const response =
        await api.post(
          "/api/todos",
          {
            title,
            description,
          }
        );


      onTodoAdded(
        response.data
      );


      setTitle("");

      setDescription("");

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  };


  return (
    <section className="create-card">

      <div className="create-icon">
        +
      </div>


      <form
        className="todo-form"
        onSubmit={handleSubmit}
      >

        <input
          className="todo-title-input"
          type="text"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) =>
            setTitle(event.target.value)
          }
        />


        <input
          className="todo-description-input"
          type="text"
          placeholder="Add a description..."
          value={description}
          onChange={(event) =>
            setDescription(
              event.target.value
            )
          }
        />


        <button
          className="add-button"
          disabled={loading}
        >
          {loading
            ? "Adding..."
            : "Add task"}
        </button>

      </form>

    </section>
  );
}

export default TodoForm;