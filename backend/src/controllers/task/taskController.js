import asyncHandler from "express-async-handler";
import TaskModel from "../../models/tasks/TaskModel.js";

export const createTask = asyncHandler(async(req, res) => {
    // console.log(req.user._id);

    // res.status(200).json({ message: "create task" });
    
    try {
        const { title, description, dueDate, priority, status } = req.body;

        if(!title || title.trim() === ""){
            res.status(400).json({ message: "Title is required" });
        }

        if(!description || description.trim() === ""){
            res.status(400).json({ message: "Description is required" });
        }

        const task = new TaskModel({
            title,
            description,
            dueDate,
            priority,
            status,
            user: req.user._id
        });

        await task.save();

        res.status(201).json(task);
    } catch (error) {
        console.log("Error in create task: ", error.message);
        res.status(500).json({ message: error.message });
    }
});

export const getTasks = asyncHandler(async(req, res) => {
    try {
        const userId = req.user._id;

        if(!userId) {
            res.status(401).json({ message: "Unauthorized" });
        }

        const tasks = await TaskModel.find({ user: userId });

        res.status(200).json({
            length: tasks.length,
            tasks
        });
    } catch (error) {
        console.log("Error in getTasks: ", error.message);
        res.status(500).json({ message: error.message });
    }
})