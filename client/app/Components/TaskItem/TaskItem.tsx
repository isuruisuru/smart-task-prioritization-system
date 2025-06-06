import { useTasks } from '@/context/taskContext';
import { edit, star, trash } from '@/utils/icons';
import { Task } from '@/utils/types';
import { formatTime } from '@/utils/utilities';
import React from 'react'

interface TaskItemProps{
    task: Task;
}

function TaskItem({ task }: TaskItemProps) {

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "low":
                return "text-green-500";
            case "medium":
                return "text-yellow-500";
            case "high":
                return "text-red-500";
            default:
                return "text-red-500";
        }
    }

    const { getTask, openModalforEdit, deleteTask, modalMode, updateTask } = useTasks()

    const toggleCompleted = () => {
        updateTask({ ...task, completed: !task.completed }, task.useAI);
    };
  return (
    <div className="h-[16rem] px-4 py-3 flex flex-col gap-4 shadow-sm bg-[#f9f9f9] rounded-lg border-2 border-white">
        <div>
            <h4 className='font-bold text-2xl'>{task.title}</h4>
            <p>{task.description}</p>
        </div>
        <div className='mt-auto flex justify-between items-center'>
            <p className='text-sm text-gray-400'>{formatTime(task.createdAt)}</p> 
            <p className={`text-sm font-bold ${getPriorityColor(task.priority)}`}>
                {task.priority}
            </p>
            <div>
                <div className='flex items-center gap-3 text-gray-400 text-[1.2rem]'>
                    <button className={`cursor-pointer ${
                        task.completed ? "text-yellow-400" : "text-gray-400" }`} 
                        title={task.completed ? "Completed" : "Not Completed"}
                        onClick={toggleCompleted}
                    >
                        {star}
                    </button>
                    <button 
                        className='text-[#00a1f1] cursor-pointer'
                        onClick={() => {
                         getTask(task._id);
                         openModalforEdit(task);   
                        }}
                        title="Edit Task"
                        >{edit}</button>
                    <button 
                        className='text-[#f65314] cursor-pointer'
                        onClick={() => deleteTask(task._id)}
                        title="Delete Task"
                        >{trash}</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default TaskItem