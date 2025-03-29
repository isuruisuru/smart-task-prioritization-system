"use client";
import useRedirect from "@/hooks/useUserRedirect";
import { useTasks } from "@/context/taskContext";
import Filters from "./Components/Filters/Filters";

export default function Home() {
  useRedirect("/login");

  const { tasks } = useTasks();

  return (
    <main className="m-6 h-full">
      <div className="flex justify-between">
        <h1 className="text-xl font-bold">All Tasks</h1>
        <Filters />
      </div>
    </main>
  );
}
