import React, { useState } from 'react';

const STATUS = ['New', 'Ongoing', 'Done'];

function ContextMenu({ x, y, todo, onMove, onClose }) {
  const [showDueInput, setShowDueInput] = useState(false);
  const [dueDate, setDueDate] = useState('');

  const handleMove = status => {
    if (status === 'Ongoing') {
      setShowDueInput(true);
    } else {
      onMove(todo.id, status);
      onClose();
    }
  };

  const handleDueSubmit = e => {
    e.preventDefault();
    if (dueDate) {
      onMove(todo.id, 'Ongoing', dueDate);
      onClose();
    }
  };

  return (
    <div className="context-menu" style={{ top: y, left: x, position: 'fixed', zIndex: 1000 }}>
      {!showDueInput ? (
        <ul>
          {STATUS.filter(s => s !== todo.status).map(status => (
            <li key={status} onClick={() => handleMove(status)}>
              Move to {status}
            </li>
          ))}
          <li onClick={onClose} style={{ color: 'red' }}>Cancel</li>
        </ul>
      ) : (
        <form onSubmit={handleDueSubmit} className="due-date-form">
          <label>
            Set Due Date/Time:
            <input
              type="datetime-local"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              required
            />
          </label>
          <button type="submit">Set</button>
        </form>
      )}
    </div>
  );
}

export default ContextMenu; 