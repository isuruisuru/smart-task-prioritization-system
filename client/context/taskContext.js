import React, { createContext, useEffect } from "react";
import axios from "axios";
import { useUserContext } from "./userContext";
import toast from "react-hot-toast";

const TasksContext = createContext();

const serverUrl = "http://localhost:8000/api/v1";

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
        setActiveTask({task});
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

    // create task 
    const createTask = async (task) => {
        setLoading(true);
        try {
            const response = await axios.post(`${serverUrl}/task/create`, task);
            console.log(response.data);
            setTasks([...tasks, response.data]);
            toast.success("Task created successfully");
            setIsEditing(false);
        } catch (error) {
            console.log("Error creating task", error);
        }
        setLoading(false);
    };

    // update task
    const updateTask = async (task) => {
        setLoading(true);
        try {
            const response = await axios.patch(`${serverUrl}/task/${task._id}`, task);

            // update the task in the tasks array
            const newTasks = tasks.map((tsk) => {
                return tsk._id === response.data._id ? response.data : tsk;
            });

            setTasks(newTasks);

            toast.success("Task updated successfully");

        } catch (error) {
            console.log("Error updating task", error);
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
            completedTasks,
            activeTasks
        }}>
            {children}
        </TasksContext.Provider>
    )
};

export const useTasks = () => {
    return React.useContext(TasksContext);
};