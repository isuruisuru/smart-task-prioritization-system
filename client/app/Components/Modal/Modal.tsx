"use client"
import React, { use } from 'react'
import { useTasks } from "@/context/taskContext";
import { useEffect } from 'react';
import useDetectOutside from '@/hooks/useDetectOutside';

function Modal() {
    const { task, handleInput, createTask, isEditing, closeModal, modalMode, activeTask, updateTask } = useTasks();
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
        if (modalMode === "edit" && activeTask) {
            handleInput("setTask")(activeTask);
            // Set useAI based on the task's preference
            setUseAI(activeTask.useAI ?? true);
        } else if (modalMode === "add") {
            // For new tasks, default to true
            setUseAI(true);
        }
    }, [modalMode, activeTask]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(modalMode === "edit"){
            await updateTask(task, useAI);
        }else if(modalMode === "add"){
            await createTask(task, useAI);
        }

        closeModal();
    }

  return (
    <div className='fixed left-0 top-0 w-full h-full bg-[#333]/30 overflow-hidden z-1'>
        <form action="" className="py-5 px-6 max-w-[520px] w-full flex flex-col gap-3 bg-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-md"
            onSubmit={handleSubmit}
            ref={ref}>
            <div className="flex flex-col gap-1">
                <label htmlFor="useAI">Auto-Prioritize Task</label>
                <div className="flex items-center justify-between bg-[#F9F9F9] p-2 rounded-md border">
                    <label htmlFor="useAI">Use AI to set priority</label>
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
                <label htmlFor="title">Title</label>
                <input type="text"
                    className='bg-[#f9f9f9] p-2 rounded-md border'
                    placeholder='Task Title'
                    name='title'
                    id='title'
                    value={task.title}
                    onChange={(e) => handleInput('title')(e)} />
            </div>
            <div className='flex flex-col gap-1'>
                <label htmlFor="description">Description</label>
                <textarea className='bg-[#f9f9f9] p-2 rounded-md border'
                    placeholder='Task Description'
                    name='description'
                    id='description'
                    rows={4}
                    value={task.description}
                    onChange={(e) => handleInput('description')(e)} />
            </div>
            {!useAI && (
                <div className='flex flex-col gap-1'>
                    <label htmlFor="priority">Select Priority</label>
                    <select className='bg-[#f9f9f9] p-2 rounded-md border cursor-pointer'
                        name='priority'
                        id='priority'
                        value={task.priority}
                        onChange={(e) => handleInput('priority')(e)}>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
            )}
            <div className='flex flex-col gap-1'>
                <label htmlFor="dueDate">Start Date</label>
                <input type="date"
                    className='bg-[#f9f9f9] p-2 rounded-md border'
                    name='dueDate'
                    id='dueDate'
                    value={task.dueDate}
                    onChange={(e) => handleInput('dueDate')(e)} />
            </div>
            <div className='flex flex-col gap-1'>
                <label htmlFor="dueDate">Due Date</label>
                <input type="date"
                    className='bg-[#f9f9f9] p-2 rounded-md border'
                    name='dueDate'
                    id='dueDate'
                    value={task.dueDate}
                    onChange={(e) => handleInput('dueDate')(e)} />
            </div>
            <div className="flex flex-col gap-1">
                <label htmlFor="completed">Task Completed</label>
                <div className="flex items-center justify-between bg-[#F9F9F9] p-2 rounded-md border">
                    <label htmlFor="completed">Completed</label>
                    <div>
                        <select
                            className="bg-[#F9F9F9] p-2 rounded-md border cursor-pointer"
                            name="completed"
                            value={task.completed ? "true" : "false"}
                            onChange={(e) => handleInput("completed")(e)}>
                        <option value="false">No</option>
                        <option value="true">Yes</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className='mt-8'>
                <button 
                    type='submit'
                    className={`text-white py-2 w-full rounded-md cursor-pointer hover:bg-blue-500 transition duration-200 ease-in-out ${
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