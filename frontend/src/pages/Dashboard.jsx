import React, { useState, useEffect, useContext } from 'react';
import api from '../api';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const { logout, user } = useContext(AuthContext);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await api.get('/tasks/');
            setTasks(response.data);
        } catch (error) {
            console.error("Error fetching tasks", error);
        }
    };

    const handleAddTask = async (e) => {
        e.preventDefault();
        if (!newTaskTitle) return;
        try {
            await api.post('/tasks/', { title: newTaskTitle, status: 'todo' });
            setNewTaskTitle('');
            fetchTasks();
        } catch (error) {
            console.error("Error adding task", error);
        }
    };

    const handleDeleteTask = async (id) => {
        try {
            await api.delete(`/tasks/${id}`);
            fetchTasks(); // Refresh list
        } catch (error) {
            console.error("Error deleting task", error);
        }
    };

    // Optional: Update status
    const handleToggleStatus = async (task) => {
        const newStatus = task.status === 'done' ? 'todo' : 'done';
        try {
            await api.put(`/tasks/${task.id}`, { ...task, status: newStatus });
            fetchTasks();
        } catch (error) {
            console.error("Error updating task", error);
        }
    }

    return (
        <div className="container">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>My Tasks</h1>
                <div>
                    <span>{user?.email}</span>
                    <button onClick={logout} style={{ marginLeft: '10px' }}>Logout</button>
                </div>
            </header>

            <form onSubmit={handleAddTask} className="task-form">
                <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="New Task..."
                    required
                />
                <button type="submit">Add Task</button>
            </form>

            <ul className="task-list">
                {tasks.map(task => (
                    <li key={task.id} className={`task-item ${task.status}`}>
                        <span
                            onClick={() => handleToggleStatus(task)}
                            style={{ cursor: 'pointer', textDecoration: task.status === 'done' ? 'line-through' : 'none' }}
                        >
                            {task.title}
                        </span>
                        <button onClick={() => handleDeleteTask(task.id)} className="delete-btn">Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;
