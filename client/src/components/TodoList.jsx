import TodoItem from "./TodoItem";

function TodoList({
  todos,
  onTodoUpdated,
  onTodoDeleted,
}) {

  if (todos.length === 0) {

    return (
      <div className="empty-state">

        <div className="empty-icon">
          ✓
        </div>

        <h3>
          You're all caught up
        </h3>

        <p>
          Add your first task above
          to get started.
        </p>

      </div>
    );
  }


  return (
    <div className="todo-list">

      {todos.map((todo) => (

        <TodoItem
          key={todo._id}
          todo={todo}
          onTodoUpdated={
            onTodoUpdated
          }
          onTodoDeleted={
            onTodoDeleted
          }
        />

      ))}

    </div>
  );
}

export default TodoList;