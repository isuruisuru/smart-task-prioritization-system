import React, { createContext, useEffect } from "react";
import axios from "axios";
import { useUserContext } from "./userContext";
import toast from "react-hot-toast";

const TasksContext = createContext();

const serverUrl = "http://localhost:8001/api/v1";
const aiServiceUrl = "http://localhost:8000"; // FastAPI server URL

// Configure axios defaults
axios.defaults.withCredentials = true;
axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const TasksProvider = ({ children }) => {
    const { user } = useUserContext();

    const [tasks, setTasks] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [task, setTask] = React.useState({
        title: "",
        description: "",
        priority: "low",
        startDate: "",
        dueDate: "",
        completed: false,
        assignee: "",
        useAI: true
    });

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
        console.log("Opening modal for edit with task:", task); // Debug log
        setModalMode("edit");
        setIsEditing(true);
        setActiveTask(task);
        
        // Format the task data properly
        const formattedTask = {
            ...task,
            // Handle assignee - it could be an object with _id or just the _id
            assignee: task.assignee?._id || task.assignee || "",
            // Format dates
            startDate: task.startDate ? new Date(task.startDate).toISOString().split('T')[0] : "",
            dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : "",
            // Handle boolean values
            completed: task.completed || false,
            useAI: task.useAI !== false,
            // Ensure other fields are present
            title: task.title || "",
            description: task.description || "",
            priority: task.priority || "low"
        };
        
        console.log("Formatted task data:", formattedTask); // Debug log
        setTask(formattedTask);
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
            console.log("Fetched tasks:", response.data.tasks); // Debug log
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
            let taskData = { 
                ...task, 
                useAI,
                assignee: task.assignee || null
            };
            
            if (useAI) {
                try {
                    const aiResponse = await axios.post(`${aiServiceUrl}/prioritize-task`, {
                        title: task.title,
                        description: task.description,
                        due_date: task.dueDate
                    });

                    if (aiResponse.data) {
                        taskData.priority = aiResponse.data.priority.toLowerCase();
                        taskData.labels = aiResponse.data.labels || [];
                    }
                } catch (error) {
                    console.error('Error getting AI priority:', error);
                    // Continue with default priority if AI fails
                    taskData.priority = task.priority || 'medium';
                    taskData.labels = [];
                }
            }

            const response = await axios.post(`${serverUrl}/task/create`, taskData);

            if (response.data) {
                setTasks(prev => [...prev, response.data]);
                toast.success("Task created successfully");
            }
        } catch (error) {
            console.error('Error creating task:', error);
            if (error.response?.status === 401) {
                toast.error("Please login to create tasks");
            } else {
                toast.error(error.response?.data?.message || "Failed to create task");
            }
        }
    };

    // update task
    const updateTask = async (task, useAI) => {
        setLoading(true);
        try {
            let taskData = { ...task, useAI };

            if (useAI) {
                try {
                    const aiResponse = await axios.post(`${aiServiceUrl}/prioritize-task`, {
                        title: task.title,
                        description: task.description,
                        due_date: task.dueDate
                    });

                    if (aiResponse.data) {
                        taskData.priority = aiResponse.data.priority.toLowerCase();
                        taskData.labels = aiResponse.data.labels;
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
            // When setting the entire task, ensure assignee is properly handled
            const taskData = {
                ...e,
                assignee: e.assignee?._id || e.assignee || ""
            };
            setTask(taskData);
        } else {
            // Special handling for assignee to ensure it's not reset
            if (name === 'assignee') {
                setTask(prev => ({
                    ...prev,
                    assignee: e.target.value
                }));
            } else {
                setTask(prev => ({
                    ...prev,
                    [name]: e.target.value
                }));
            }
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
    }, [user._id]);

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