import asyncHandler from "express-async-handler";
import TaskModel from "../../models/tasks/TaskModel.js";
import UserModel from "../../models/auth/UserModel.js";
import sendEmail from "../../helpers/sendEmail.js";

export const createTask = asyncHandler(async(req, res) => {
    try {
        const { title, description, startDate, dueDate, priority, status, useAI, assignee } = req.body;

        if(!title || title.trim() === ""){
            return res.status(400).json({ message: "Title is required" });
        }

        if(!description || description.trim() === ""){
            return res.status(400).json({ message: "Description is required" });
        }

        const task = new TaskModel({
            title,
            description,
            startDate,
            dueDate,
            priority,
            status,
            useAI: useAI === true,
            assignee: assignee || null,
            user: req.user._id
        });

        await task.save();

        // If task is assigned to someone, send them an email
        if (assignee) {
            const assignedUser = await UserModel.findById(assignee);
            if (assignedUser) {
                const subject = "New Task Assigned to You";
                const send_to = assignedUser.email;
                const send_from = process.env.USER_EMAIL;
                const reply_to = "noreply@noreply.com";
                const template = "taskAssignment";
                const name = assignedUser.name;
                const url = `${process.env.CLIENT_URL}/tasks`;

                try {
                    await sendEmail(subject, send_to, send_from, reply_to, template, name, url);
                } catch (emailError) {
                    console.log("Error sending email:", emailError.message);
                    // Don't return error response as task was created successfully
                }
            }
        }

        return res.status(201).json(task);
    } catch (error) {
        console.log("Error in create task: ", error.message);
        return res.status(500).json({ message: error.message });
    }
});

export const getTasks = asyncHandler(async(req, res) => {
    try {
        const userId = req.user._id;

        if(!userId) {
            res.status(401).json({ message: "Unauthorized" });
        }

        const tasks = await TaskModel.find({ user: userId })
            .populate('assignee', 'name email')
            .populate('user', 'name email');

        res.status(200).json({
            length: tasks.length,
            tasks
        });
    } catch (error) {
        console.log("Error in getTasks: ", error.message);
        res.status(500).json({ message: error.message });
    }
});

export const getTask = asyncHandler(async(req, res) => {
    try {
        const userId = req.user._id;

        const { id } = req.params;

        if(!id){
            res.status(400).json({ message: "Task id is required" });
        }

        const task = await TaskModel.findById(id);

        if(!task){
            res.status(404).json({ message: "Task not found" });
        }

        if(!task.user.equals(userId)){
            res.status(401).json({ message: "Not authorized" });
        }

        res.status(200).json(task);
    } catch (error) {
        console.log("Error in getTask: ", error.message);
        res.status(500).json({ message: error.message });
    }
});

export const updateTask = asyncHandler(async(req, res) => {
    try {
        const userId = req.user._id;

        const { id } = req.params;

        const { title, description, startDate, dueDate, priority, status, completed, useAI, assignee } = req.body;

        if(!id){
            res.status(400).json({ message: "Task id is required" });
        }

        const task = await TaskModel.findById(id);

        if(!task){
            res.status(404).json({ message: "Task not found" });
        }

        // check if the user is the owner of the task
        if(!task.user.equals(userId)){
            res.status(401).json({ message: "Not authorized" });
        }

        // Check if assignee is being changed
        const isAssigneeChanged = assignee && (!task.assignee || !task.assignee.equals(assignee));

        // update task
        task.title = title || task.title;
        task.description = description || task.description;
        task.startDate = startDate || task.startDate;
        task.dueDate = dueDate || task.dueDate;
        task.priority = priority || task.priority;
        task.status = status || task.status;
        task.completed = completed || task.completed;
        task.useAI = useAI || task.useAI;
        task.assignee = assignee || task.assignee;

        await task.save();

        // If assignee was changed, send them an email
        if (isAssigneeChanged && assignee) {
            const assignedUser = await UserModel.findById(assignee);
            if (assignedUser) {
                const subject = "Task Assigned to You";
                const send_to = assignedUser.email;
                const send_from = process.env.USER_EMAIL;
                const reply_to = "noreply@noreply.com";
                const template = "taskAssignment";
                const name = assignedUser.name;
                const url = `${process.env.CLIENT_URL}/tasks`;

                try {
                    await sendEmail(subject, send_to, send_from, reply_to, template, name, url);
                } catch (emailError) {
                    console.log("Error sending email:", emailError.message);
                    // Don't return error response as task was updated successfully
                }
            }
        }

        return res.status(200).json(task);
    } catch (error) {
        console.log("Error in updateTask: ", error.message);
        res.status(500).json({ message: error.message });
    }
});

export const deleteTask = asyncHandler(async(req, res) => {
    try {
        const userId = req.user._id;

        const { id } = req.params;

        if(!id){
            res.status(400).json({ message: "Task id is required" });
        }

        const task = await TaskModel.findById(id);

        if(!task){
            res.status(404).json({ message: "Task not found" });
        }

        // check if the user is the owner of the task
        if(!task.user.equals(userId)){
            res.status(401).json({ message: "Not authorized" });
        }

        // delete task
        await TaskModel.findByIdAndDelete(id);

        return res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        console.log("Error in deleteTask: ", error.message);
        res.status(500).json({ message: error.message });
    }
})

export const getTaskById = asyncHandler(async(req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        if(!userId) {
            res.status(401).json({ message: "Unauthorized" });
        }

        const task = await TaskModel.findOne({ _id: id, user: userId })
            .populate('assignee', 'name email')
            .populate('user', 'name email');

        if(!task) {
            res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json(task);
    } catch (error) {
        console.log("Error in getTaskById: ", error.message);
        res.status(500).json({ message: error.message });
    }
});