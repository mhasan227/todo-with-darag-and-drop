import React, { useState } from 'react';
import TodoCard from './TodoCard';

function Column({ title, todos, onContextMenu, onAdd, onDropCard, onDragOverCard, onDragStartCard, onDragEndCard }) {
  const [showForm, setShowForm] = useState(false);
  const [titleInput, setTitleInput] = useState('');
  const [descInput, setDescInput] = useState('');

  const handleAdd = e => {
    e.preventDefault();
    if (!titleInput.trim()) return;
    onAdd(titleInput, descInput);
    setTitleInput('');
    setDescInput('');
    setShowForm(false);
  };

  return (
    <div
      className="kanban-column"
      onDrop={e => onDropCard && onDropCard(e, title)}
      onDragOver={e => onDragOverCard && onDragOverCard(e, title)}
    >
      <div className="kanban-column-header" style={{ borderBottom: `2px solid #e5e7eb` }}>
        <span className="kanban-column-title">{title}</span>
        <span className="kanban-column-menu">&#x22ee;</span>
      </div>
      <div className="kanban-tasks">
        {todos.map(todo => (
          <TodoCard
            key={todo.id}
            todo={todo}
            onContextMenu={onContextMenu}
            onDragStart={onDragStartCard}
            onDragEnd={onDragEndCard}
          />
        ))}
      </div>
      <div className="kanban-add-card">
        {showForm ? (
          <form className="new-task-form-inline" onSubmit={handleAdd}>
            <input
              type="text"
              placeholder="Title"
              value={titleInput}
              onChange={e => setTitleInput(e.target.value)}
              required
            />
            <textarea
              placeholder="Description"
              value={descInput}
              onChange={e => setDescInput(e.target.value)}
            />
            <div className="add-card-actions">
              <button type="submit">Add</button>
              <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        ) : (
          title !== 'Done' && (
          <button className="add-card-btn" onClick={() => setShowForm(true)}>
            + Add a card
          </button>)
        )}
      </div>
    </div>
  );
}

export default Column; 