import React, { useState, useRef } from 'react';
import Column from './Column';
import './App.css';

const STATUS = {
  NEW: 'New',
  ONGOING: 'Ongoing',
  DONE: 'Done',
};

const STATUS_COLORS = {
  New: 'blue',
  Ongoing: 'orange',
  Done: 'green',
};

function KanbanBoard() {
  const [todos, setTodos] = useState([]);
  const [contextMenu, setContextMenu] = useState(null);
  const [overdueAlert, setOverdueAlert] = useState(null);
  const nextId = useRef(1);
  const draggedId = useRef(null);

  // Check for overdue tasks
  React.useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      todos.forEach(todo => {
        if (
          todo.status === STATUS.ONGOING &&
          todo.dueDate &&
          new Date(todo.dueDate) < now &&
          !todo.overdueAlerted
        ) {
          setOverdueAlert(todo.title);
          setTodos(prev => prev.map(t => t.id === todo.id ? { ...t, overdueAlerted: true } : t));
        }
      });
    }, 1000 * 30); // check every 30 seconds
    return () => clearInterval(interval);
  }, [todos]);

  const addTodo = (title, description) => {
    setTodos(prev => [
      {
        id: nextId.current++,
        title,
        description,
        status: STATUS.NEW,
        createdAt: new Date(),
      },
      ...prev,
    ]);
  };

  const addOngoing = (title, description) => {
    setTodos(prev => [
      {
        id: nextId.current++,
        title,
        description,
        status: STATUS.ONGOING,
        createdAt: new Date(),
      },
      ...prev,
    ]);
  };

  // const addDone = (title, description) => {
  //   setTodos(prev => [
  //     {
  //       id: nextId.current++,
  //       title,
  //       description,
  //       status: STATUS.DONE,
  //       createdAt: new Date(),
  //     },
  //     ...prev,
  //   ]);
  // };

  const moveTodo = (id, newStatus, dueDate) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id
          ? {
              ...todo,
              status: newStatus,
              dueDate: newStatus === STATUS.ONGOING ? dueDate || todo.dueDate : undefined,
              completedAt: newStatus === STATUS.DONE ? new Date() : undefined,
              overdueAlerted: false,
            }
          : todo
      )
    );
  };

  const handleContextMenu = (e, todo) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      todo,
    });
  };

  const closeContextMenu = () => setContextMenu(null);

  React.useEffect(() => {
    if (overdueAlert) {
      alert(`Task overdue: ${overdueAlert}`);
      setOverdueAlert(null);
    }
  }, [overdueAlert]);

  // Drag and drop handlers
  const handleDragStart = (e, todo) => {
    draggedId.current = todo.id;
    e.dataTransfer.effectAllowed = 'move';
  };
  const handleDragEnd = () => {
    draggedId.current = null;
  };
  const handleDragOver = (e, columnTitle) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };
  const handleDrop = (e, columnTitle) => {
    e.preventDefault();
    const id = draggedId.current;
    if (!id) return;
    let newStatus = STATUS.NEW;
    if (columnTitle === 'Ongoing') newStatus = STATUS.ONGOING;
    if (columnTitle === 'Done') newStatus = STATUS.DONE;
    moveTodo(id, newStatus);
    draggedId.current = null;
  };

  // Filter todos by status
  const newTodos = todos.filter(t => t.status === STATUS.NEW);
  const ongoingTodos = todos.filter(t => t.status === STATUS.ONGOING);
  const doneTodos = todos.filter(t => t.status === STATUS.DONE);

  return (
    <div className="kanban-board" onClick={closeContextMenu}>
      <h1>Kanban Todo List</h1>
      <div className="kanban-columns">
        <Column
          title="New"
          color={STATUS_COLORS.New}
          todos={newTodos}
          onContextMenu={handleContextMenu}
          onAdd={addTodo}
          onDropCard={handleDrop}
          onDragOverCard={handleDragOver}
          onDragStartCard={handleDragStart}
          onDragEndCard={handleDragEnd}
        />
        <Column
          title="Ongoing"
          color={STATUS_COLORS.Ongoing}
          todos={ongoingTodos}
          onContextMenu={handleContextMenu}
          onAdd={addOngoing}
          onDropCard={handleDrop}
          onDragOverCard={handleDragOver}
          onDragStartCard={handleDragStart}
          onDragEndCard={handleDragEnd}
        />
        <Column
          title="Done"
          color={STATUS_COLORS.Done}
          todos={doneTodos}
          onContextMenu={handleContextMenu}
          onDropCard={handleDrop}
          onDragOverCard={handleDragOver}
          onDragStartCard={handleDragStart}
          onDragEndCard={handleDragEnd}
        />
      </div>
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          todo={contextMenu.todo}
          onMove={moveTodo}
          onClose={closeContextMenu}
        />
      )}
    </div>
  );
}

export default KanbanBoard; 