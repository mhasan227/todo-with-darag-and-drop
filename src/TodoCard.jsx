import React from 'react';

const STATUS_COLORS = {
  New: 'blue',
  Ongoing: 'orange',
  Done: 'green',
};

function TodoCard({ todo, onContextMenu, onDragStart, onDragEnd }) {
  return (
    <div
      className="todo-card styled-card"
      onContextMenu={e => onContextMenu(e, todo)}
      tabIndex={0}
      draggable
      onDragStart={e => onDragStart && onDragStart(e, todo)}
      onDragEnd={e => onDragEnd && onDragEnd(e, todo)}
    >
      <div className="todo-card-header">
        <span
          className="todo-status-label"
          style={{ background: STATUS_COLORS[todo.status] }}
        >
          {todo.status}
        </span>
        <h3>{todo.title}</h3>
      </div>
      {/* <div className="todo-card-meta">
        <span className="meta-icon">📄</span>
        <span className="meta-number">1</span>
        <span className="meta-icon">#</span>
        <span className="meta-number">{todo.id}</span>
      </div> */}
      <div className="todo-card-desc">{todo.description}</div>
      {todo.status === 'Ongoing' && todo.dueDate && (
        <div className="todo-card-due">Due: {new Date(todo.dueDate).toLocaleString()}</div>
      )}
    </div>
  );
}

export default TodoCard; 