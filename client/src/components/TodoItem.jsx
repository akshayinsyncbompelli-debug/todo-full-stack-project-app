import api from "../api";

function TodoItem({
  todo,
  onTodoUpdated,
  onTodoDeleted,
}) {


  const toggleComplete = async () => {

    try {

      const response =
        await api.put(
          `api/todos/${todo._id}`,
          {
            title: todo.title,
            description:
              todo.description,
            completed:
              !todo.completed,
          }
        );


      onTodoUpdated(
        response.data
      );

    } catch (error) {

      console.log(error);
    }
  };


  const deleteTodo = async () => {

    try {

      await api.delete(
        `/todos/${todo._id}`
      );

      onTodoDeleted(
        todo._id
      );

    } catch (error) {

      console.log(error);
    }
  };


  return (
    <article
      className={`todo-card ${
        todo.completed
          ? "completed"
          : ""
      }`}
    >

      <button
        className={`check-button ${
          todo.completed
            ? "checked"
            : ""
        }`}
        onClick={toggleComplete}
        aria-label="Complete task"
      >
        {todo.completed
          ? "✓"
          : ""}
      </button>


      <div className="todo-content">

        <h3>
          {todo.title}
        </h3>

        {todo.description && (

          <p>
            {todo.description}
          </p>

        )}

        <span className="todo-status">

          {todo.completed
            ? "Completed"
            : "In progress"}

        </span>

      </div>


      <button
        className="delete-button"
        onClick={deleteTodo}
      >
        Delete
      </button>

    </article>
  );
}

export default TodoItem;