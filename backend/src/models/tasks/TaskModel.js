import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "please provide a title"],
            unique: false
        },

        description: {
            type: String,
            default: "no description"
        },

        startDate: {
            type: Date,
            default: Date.now()
        },

        dueDate: {
            type: Date,
            default: Date.now()
        },

        status: {
            type: String,
            enum: ['active','inactive'],
            default: 'active'
        },

        completed: {
            type: Boolean,
            default: false
        },

        priority: {
            type: String,
            enum: ['low','medium','high'],
            default: 'low'
        },

        user: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: true
        },

        labels: {
            type: [String],
            default: []
        },
        useAI: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }    
);


const TaskModel = mongoose.model("Task", TaskSchema);

export default TaskModel;