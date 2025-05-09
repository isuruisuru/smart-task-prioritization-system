"use client"
import React, { use } from 'react'
import { useTasks } from "@/context/taskContext";
import { useEffect } from 'react';
import useDetectOutside from '@/hooks/useDetectOutside';
import { useUsers } from '@/hooks/useUsers';

function formatDate(date: any) {
  if (!date) return "";
  const d = new Date(typeof date === 'string' || typeof date === 'number' ? date : '');
  if (isNaN(d.getTime())) return "";
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function Modal() {
    const { task, handleInput, createTask, isEditing, closeModal, modalMode, activeTask, updateTask, allTasks, inProgressTasks, dueTasks, completedTasks } = useTasks();
    const { users, loading, error } = useUsers();
    const ref = React.useRef<HTMLFormElement | null>(null);
    const [useAI, setUseAI] = React.useState(true);

    // use the hook to detect clicks outside of the modal
    useDetectOutside({ ref, callback: () => {
        if(isEditing){
            closeModal(); // close modal
        }
    } })

    // Update useAI state when task changes
    useEffect(() => {
        console.log('Modal Mode:', modalMode);
        console.log('Active Task:', activeTask);
        
        if (modalMode === "edit" && activeTask) {
            // Don't use handleInput("setTask") as it overwrites our formatted data
            // Instead, let the taskContext handle the formatting
            const wasCreatedWithAI = activeTask.useAI !== false;
            console.log('Was created with AI:', wasCreatedWithAI);
            setUseAI(wasCreatedWithAI);
        } else if (modalMode === "add") {
            setUseAI(true);
        }
    }, [modalMode, activeTask]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        if(modalMode === "edit"){
            const updatedTask = {
                ...task,
                useAI,
                completed: Boolean(task.completed) // ensure it's a boolean
            };
            await updateTask(updatedTask, useAI);
        }else if(modalMode === "add"){
            await createTask({...task, useAI}, useAI);
        }
    
        closeModal();
    }

  return (
    <div className='fixed left-0 top-0 w-full h-full bg-[#333]/30 overflow-hidden z-1 flex items-center justify-center'>
        <form action="" className="py-4 px-3 sm:py-5 sm:px-6 w-[98vw] max-w-[520px] flex flex-col gap-3 bg-white rounded-lg shadow-md relative max-h-[90vh] overflow-y-auto"
            onSubmit={handleSubmit}
            ref={ref}>
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold text-gray-800">
                    {modalMode === 'edit' ? 'Edit Task' : 'Create Task'}
                </h2>
                <button 
                    type="button"
                    onClick={closeModal}
                    className="text-gray-500 hover:text-gray-700 text-xl font-bold"
                >
                    ×
                </button>
            </div>
            <div className="flex flex-col gap-1">
                <label htmlFor="useAI">Auto-Prioritize Task</label>
                <div className="flex items-center justify-between bg-[#F9F9F9] p-2 rounded-md border">
                    <label htmlFor="useAI" className="text-sm">
                        {modalMode === 'edit' ? 'Re-analyze task priority' : 'Use AI to set priority'}
                    </label>
                    <div className="relative inline-block w-12 h-6">
                        <input
                            type="checkbox"
                            id="useAI"
                            className="hidden"
                            checked={useAI}
                            onChange={(e) => setUseAI(e.target.checked)}
                        />
                        <label
                            htmlFor="useAI"
                            className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-all duration-300 ${
                                useAI ? 'bg-green-400' : 'bg-gray-300'
                            }`}
                        >
                            <span className={`absolute w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                                useAI ? 'translate-x-6' : 'translate-x-1'
                            }`} />
                        </label>
                    </div>
                </div>
            </div>
            <div className='flex flex-col gap-1'>
                <label htmlFor="assignee" className="text-sm">Assignee</label>
                <select 
                    className='bg-[#f9f9f9] p-2 rounded-md border cursor-pointer text-sm'
                    name='assignee'
                    id='assignee'
                    value={task.assignee?._id || task.assignee || ""}
                    onChange={(e) => {
                        console.log('Assignee changed:', e.target.value); // Debug log
                        handleInput('assignee')(e);
                    }}>
                    <option value="">Select Assignee</option>
                    {users && users.map((user) => (
                        <option key={user._id} value={user._id}>
                            {user.name} ({user.email})
                        </option>
                    ))}
                </select>
            </div>
            <div className='flex flex-col gap-1'>
                <label htmlFor="title" className="text-sm">Title <span className="text-red-500">*</span></label>
                <input type="text"
                    className='bg-[#f9f9f9] p-2 rounded-md border text-sm'
                    placeholder='Task Title'
                    name='title'
                    id='title'
                    value={task.title || ""}
                    onChange={(e) => handleInput('title')(e)} />
            </div>
            <div className='flex flex-col gap-1'>
                <label htmlFor="description" className="text-sm">Description <span className="text-red-500">*</span></label>
                <textarea className='bg-[#f9f9f9] p-2 rounded-md border text-sm'
                    placeholder='Task Description'
                    name='description'
                    id='description'
                    rows={4}
                    value={task.description || ""}
                    onChange={(e) => handleInput('description')(e)} />
            </div>
            {!useAI && (
                <div className='flex flex-col gap-1'>
                    <label htmlFor="priority" className="text-sm">Select Priority <span className="text-red-500">*</span></label>
                    <select className='bg-[#f9f9f9] p-2 rounded-md border cursor-pointer text-sm'
                        name='priority'
                        id='priority'
                        value={task.priority || "low"}
                        onChange={(e) => handleInput('priority')(e)}>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
            )}
            <div className='flex flex-col gap-1'>
                <label htmlFor="startDate" className="text-sm">Start Date <span className="text-red-500">*</span></label>
                <input type="date"
                    className='bg-[#f9f9f9] p-2 rounded-md border text-sm'
                    name='startDate'
                    id='startDate'
                    value={formatDate(task.startDate)}
                    onChange={(e) => handleInput('startDate')(e)} />
            </div>
            <div className='flex flex-col gap-1'>
                <label htmlFor="dueDate" className="text-sm">Due Date <span className="text-red-500">*</span></label>
                <input type="date"
                    className='bg-[#f9f9f9] p-2 rounded-md border text-sm'
                    name='dueDate'
                    id='dueDate'
                    value={formatDate(task.dueDate)}
                    onChange={(e) => handleInput('dueDate')(e)} />
            </div>
            <div className="flex flex-col gap-1">
                <label htmlFor="completed" className="text-sm">Task Completed</label>
                <div className="flex items-center justify-between bg-[#F9F9F9] p-2 rounded-md border">
                    <label htmlFor="completed" className="text-sm">Completed</label>
                    <div>
                    <select
                        className="bg-[#F9F9F9] p-2 rounded-md border cursor-pointer text-sm"
                        name="completed"
                        value={String(Boolean(task.completed))}
                        onChange={(e) => {
                            const isCompleted = e.target.value === "true";
                            handleInput("completed")({
                                target: {
                                    name: "completed",
                                    value: isCompleted
                                }
                            });
                        }}>
                        <option value="false">No</option>
                        <option value="true">Yes</option>
                    </select>
                    </div>
                </div>
            </div>

            <div className='mt-8'>
                <button 
                    type='submit'
                    className={`text-white py-2 w-full rounded-md cursor-pointer hover:bg-blue-500 transition duration-200 ease-in-out text-sm ${
                        modalMode === 'edit' ? 'bg-blue-400' : 'bg-green-400'
                    }`}
                >
                    {modalMode === 'edit' ? 'Update Task' : 'Create Task'}
                </button>
            </div>
        </form>
    </div>
  )
}

export default Modal