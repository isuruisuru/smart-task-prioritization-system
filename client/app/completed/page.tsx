"use client";
import useRedirect from "@/hooks/useUserRedirect";
import { useTasks } from "@/context/taskContext";
import { Task } from "@/utils/types";
import { filteredTasks } from "@/utils/utilities";
import Filters from "../Components/Filters/Filters";
import TaskItem from "../Components/TaskItem/TaskItem";
import { use, useEffect } from "react";

export default function Home() {
  useRedirect("/login");

  const { tasks, openModalforAdd, priority, completedTasks, setPriority } = useTasks();

  const filtered = filteredTasks(completedTasks, priority);

  useEffect(() => {
    setPriority("all");
  }, [])

  return (
    <main className="m-6 h-full">
      <div className="flex justify-between">
        <h1 className="text-xl font-bold">Completed Tasks</h1>
        <Filters />
      </div>

      <div className="pb-[2rem] mt-6 grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-[1.5rem]">
        {
          filtered.map((task: Task, i: number) => (
            <TaskItem key={i} task={task} />
          ))
        }
        <button className="h-[16rem] w-full py-2 rounded-md text-4xl font-medium text-gray-500 border-dashed border-2 border-gray-400 hover:bg-gray-300 hover:border-none transition duration-200 ease-in-out"
          onClick={openModalforAdd}>
          +
        </button>
      </div>
    </main>
  );
}
