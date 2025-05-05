import React, { createContext, useEffect } from "react";
import axios from "axios";
import { useUserContext } from "./userContext";
import toast from "react-hot-toast";

const TasksContext = createContext();

const serverUrl = "http://localhost:8001/api/v1";

export const TasksProvider = ({ children }) => {
    const userId = useUserContext().user._id;

    const [tasks, setTasks] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [task, setTask] = React.useState({});

    const [priority, setPriority] = React.useState("all");
    const [isEditing, setIsEditing] = React.useState(false);
    const [activeTask, setActiveTask] = React.useState(null);
    const [modalMode, setModalMode] = React.useState("");
    const [profileModal, setProfileModal] = React.useState(false);

    const openModalforAdd = () => {
        setModalMode("add");
        setIsEditing(true);
        setTask({});
    }
    const openModalforEdit = (task) => {
        setModalMode("edit");
        setIsEditing(true);
        setActiveTask(task);
    }

    const openProfileModal = () => {
        setProfileModal(true);
    }   

    const closeModal = () => {
        setIsEditing(false);
        setTask({});
        setProfileModal(false);
        setModalMode("");
        setActiveTask(null);
    }

    // get tasks
    const getTasks = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${serverUrl}/tasks`);

            setTasks(response.data.tasks);
        } catch (error) {
            console.log("Error getting tasks", error);
        }
        setLoading(false);
    };

    // get task
    const getTask = async (taskId) => {
        setLoading(true);
        try {
            const response = await axios.get(`${serverUrl}/task/${taskId}`);

            setTask(response.data);
        } catch (error) {
            console.log("Error getting task", error);
        }
        setLoading(false);
    };

    /**
     * Creates a new task with optional AI prioritization
     * @param {Object} task - The task object
     * @param {boolean} useAI - Whether to use AI for prioritization
     */
    const createTask = async (task, useAI) => {
        try {
            let taskData = { ...task, useAI };
            
            if (useAI) {
                const aiResponse = await fetch(`${serverUrl}/prioritize-task`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        title: task.title,
                        description: task.description,
                        due_date: task.dueDate
                    })
                });

                if (aiResponse.ok) {
                    const aiResult = await aiResponse.json();
                    taskData.priority = aiResult.priority.toLowerCase();
                    taskData.labels = aiResult.labels;
                }
            }

            const response = await fetch(`${serverUrl}/task/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                credentials: 'include',
                body: JSON.stringify(taskData)
            });

            if (response.ok) {
                const newTask = await response.json();
                setTasks(prev => [...prev, newTask]);
            }
        } catch (error) {
            console.error('Error creating task:', error);
        }
    };

    // update task
    const updateTask = async (task, useAI) => {
        setLoading(true);
        try {
            let taskData = { ...task, useAI };

            if (useAI) {
                try {
                    const aiResponse = await fetch(`${serverUrl}/prioritize-task`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            title: task.title,
                            description: task.description,
                            due_date: task.dueDate
                        })
                    });

                    if (aiResponse.ok) {
                        const aiResult = await aiResponse.json();
                        taskData.priority = aiResult.priority.toLowerCase();
                        taskData.labels = aiResult.labels;
                    }
                } catch (error) {
                    console.error('Error getting AI priority:', error);
                    toast.error('Failed to get AI priority');
                }
            }

            const response = await axios.patch(`${serverUrl}/task/${task._id}`, taskData);

            const newTasks = tasks.map((tsk) => {
                return tsk._id === response.data._id ? response.data : tsk;
            });

            setTasks(newTasks);
            toast.success("Task updated successfully");

        } catch (error) {
            console.error("Error updating task", error);
            toast.error("Failed to update task");
        }
        setLoading(false);
    };

    // delete task
    const deleteTask = async (taskId) => {
        setLoading(true);
        try {
            await axios.delete(`${serverUrl}/task/${taskId}`);

            // remove the task from the tasks array
            const newTasks = tasks.filter((tsk) => tsk._id !== taskId);
            setTasks(newTasks);

            toast.success("Task deleted successfully");
        } catch (error) {
            console.log("Error deleting task", error);
        }
        setLoading(false);
    };

    const handleInput = (name) => (e) => {
        if(name === 'setTask'){
            setTask(e)
        } else {
            setTask({ ...task, [name]: e.target.value });
        }
    }

    // get completed tasks
    const completedTasks = tasks.filter((task) => task.completed);

    // get pending tasks
    const activeTasks = tasks.filter((task) => !task.completed);

    // --- New statistics logic ---
    const now = new Date();
    const allTasks = tasks;
    const inProgressTasks = tasks.filter(
      (task) =>
        !task.completed &&
        task.dueDate &&
        new Date(task.dueDate) > now
    );
    const dueTasks = tasks.filter(
      (task) =>
        !task.completed &&
        task.dueDate &&
        new Date(task.dueDate) <= now
    );

    useEffect(() => {
        getTasks();
    }, [userId]);

    return(
        <TasksContext.Provider value={{
            tasks,
            loading,
            task,
            getTasks,
            getTask,
            createTask,
            updateTask,
            deleteTask,
            priority,
            setPriority,
            handleInput,
            isEditing,
            setIsEditing,
            openModalforAdd,
            openModalforEdit,
            activeTask,
            closeModal,
            modalMode,
            openProfileModal,
            // --- new stats ---
            allTasks,
            inProgressTasks,
            dueTasks,
            completedTasks
        }}>
            {children}
        </TasksContext.Provider>
    )
};

export const useTasks = () => {
    return React.useContext(TasksContext);
};