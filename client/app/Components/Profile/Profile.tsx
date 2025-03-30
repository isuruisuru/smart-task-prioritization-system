"use client";
import { useUserContext } from "@/context/userContext";
import Image from "next/image";
import React from 'react';
import { useTasks } from "@/context/taskContext";

function Profile() {
    const { user } = useUserContext();
    const { tasks, completedTasks, activeTasks } = useTasks();

  return (
    <div className="ml-3 mr-3">
        <div className="px-2 py-1 flex items-center gap-3 bg-[#E6E6E6]/20 rounded-[0.8rem]
        hover:bg-[#E6E6E6]/50 transition duration-300 ease-in-out cursor-pointer border-2 border-transparent hover:border-2 hover:border-white">
            <div>
                <Image
                src={user?.photo}
                alt="avatar"
                width={70}
                height={70}
                className="rounded-full"
                />
            </div>
            <div>
                <h1 className="flex flex-col text-xl">
                    <span className="font-medium">Hello,</span>
                    <span className="font-bold">{user?.name}</span>
                </h1>
            </div>
        </div>

        <div className="mt-2 flex flex-col gap-8">
            <div className="grid grid-cols-2 gap-2">
                <div className="text-gray-400">
                    <p className="text-sm">Total Tasks:</p>
                    <p className="pl-4 relative flex gap-2">
                    <span className="absolute h-[60%] w-[0.2rem] left-[1px] top-1/2 translate-y-[-50%] bg-purple-500 rounded-[5px]"></span>
                    <span className="font-medium text-3xl text-[#333]">{tasks.length}</span>
                    </p>
                </div>
                <div className="text-gray-400">
                    <p className="text-sm">In Progress:</p>
                    <p className="pl-4 relative flex gap-2">
                    <span className="absolute h-[60%] w-[0.2rem] left-[1px] top-1/2 translate-y-[-50%] bg-[#3AAFAE] rounded-[5px]"></span>
                    <span className="font-medium text-3xl text-[#333]">{activeTasks.length}</span>
                    </p>
                </div>
                <div className="text-gray-400">
                    <p className="text-sm">Open Tasks:</p>
                    <p className="pl-4 relative flex gap-2">
                    <span className="absolute h-[60%] w-[0.2rem] left-[1px] top-1/2 translate-y-[-50%] bg-orange-400 rounded-[5px]"></span>
                    <span className="font-medium text-3xl text-[#333]">{activeTasks.length}</span>
                    </p>
                </div>
                <div className="text-gray-400">
                    <p className="text-sm">Completed:</p>
                    <p className="pl-4 relative flex gap-2">
                    <span className="absolute h-[60%] w-[0.2rem] left-[1px] top-1/2 translate-y-[-50%] bg-green-400 rounded-[5px]"></span>
                    <span className="font-medium text-3xl text-[#333]">{completedTasks.length}</span>
                    </p>
                </div>
            </div>
        </div>
        <h3 className="mt-4 font-medium">Activity</h3>
    </div>
  )
}

export default Profile