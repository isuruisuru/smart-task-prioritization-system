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
        console.log('Modal Mode:', modalMode);
        console.log('Active Task:', activeTask);
        
        if (modalMode === "edit" && activeTask) {
            handleInput("setTask")(activeTask);
            // Check if the task was created with AI by checking if it has a priority
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
            await updateTask({...task, useAI}, useAI);
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
                <label htmlFor="title" className="text-sm">Title</label>
                <input type="text"
                    className='bg-[#f9f9f9] p-2 rounded-md border text-sm'
                    placeholder='Task Title'
                    name='title'
                    id='title'
                    value={task.title || ""}
                    onChange={(e) => handleInput('title')(e)} />
            </div>
            <div className='flex flex-col gap-1'>
                <label htmlFor="description" className="text-sm">Description</label>
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
                    <label htmlFor="priority" className="text-sm">Select Priority</label>
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
                <label htmlFor="startDate" className="text-sm">Start Date</label>
                <input type="date"
                    className='bg-[#f9f9f9] p-2 rounded-md border text-sm'
                    name='startDate'
                    id='startDate'
                    value={task.startDate || ""}
                    onChange={(e) => handleInput('startDate')(e)} />
            </div>
            <div className='flex flex-col gap-1'>
                <label htmlFor="dueDate" className="text-sm">Due Date</label>
                <input type="date"
                    className='bg-[#f9f9f9] p-2 rounded-md border text-sm'
                    name='dueDate'
                    id='dueDate'
                    value={task.dueDate || ""}
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
                            value={typeof task.completed === "boolean" ? (task.completed ? "true" : "false") : "false"}
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