import moment from "moment";
import { Task } from "./types";

export const formatTime = (createdAt: string) => {
    const now = moment();
    const created = moment(createdAt);

    // if the task was created today
    if (created.isSame(now, "day")) {
        return "Today";
    } 

    // if the task was created yesterday
    if (created.isSame(now.subtract(1, "day"), "day")) {
        return "Yesterday";
    }

    // if the task was created within the last 7 days
    if(created.isAfter(moment().subtract(6, "days"))){
        return created.fromNow();
    }

    // if the task was created within the last 4 weeks
    if(created.isAfter(moment().subtract(3, "weeks"), "week")){
        return created.fromNow();
    }

    return created.format("DD/MM/YYYY");
}

export const filteredTasks = (tasks: Task[], priority: string) => {
    const filteredTasks = () => {
        switch (priority) {
            case "low":
                return tasks.filter((task) => task.priority === "low");
            case "medium":
                return tasks.filter((task) => task.priority === "medium");
            case "high":
                return tasks.filter((task) => task.priority === "high");
            default:
                return tasks;
        }
    }

    return filteredTasks();
}

export const overdueTasks = (tasks: Task[]) => {
    const todayDate = moment();

    // filter tasks that are overdue
    return tasks.filter((task) => {
        return !task.completed && moment(task.dueDate).isBefore(todayDate);
    })
}