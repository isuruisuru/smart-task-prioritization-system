"use client";
import { useUserContext } from "@/context/userContext";
import React from 'react'
import Link from 'next/link';
import { github, moon, profile } from "@/utils/icons";
import { useTasks } from "@/context/taskContext";

function Header() {
  const { user, logoutUser } = useUserContext();
  const { inProgressTasks, openModalforAdd } = useTasks();

  const { name } = user;
  const userId = user._id;

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <header className='px-6 my-4 w-full flex items-center justify-between bg-[#f9f9f9]'>
      <div>
        <h1 className="text-lg font-medium">
          <span role='img' aria-label='wave'>
            👋🏾
          </span>
          {userId ? ` Welcome, ${name}!` : " Welcome to Task Prioritizer!"}
        </h1>
        <p className="text-sm text-[#666]">
          {userId ? (
            <>You have{" "}
            <span className="font-bold text-[#3aafae]">{inProgressTasks.length}</span> active tasks
            </>
          ): (
            "Please login to view your tasks"
          )}
        </p>
      </div>
      <div className="h-[50px] flex items-center gap-[10.4rem]" >
            <button className="px-8 py-3 bg-[#3aafae] text-white rounded-[50px] hover:bg-[#00a1f1] hover:text-[#fff] transition-all duration-200 ease-in-out cursor-pointer"
            onClick={openModalforAdd}
            >
              Create a New Task
            </button>
      </div>

      <div className="flex gap-4 items-center">
            {userId && (
              <button 
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-[50px] hover:bg-red-600 transition-all duration-200 ease-in-out cursor-pointer"
              >
                Logout
              </button>
            )}
            <Link href="/login" passHref target="_blank" rel="noopener noreferrer" className="h-[40px] w-[40px] text-purple-500 rounded-full flex items-center justify-center text-lg border-2 border-[#E6E6E6]">
              {github}
            </Link>
            <Link href="/login" passHref target="_blank" rel="noopener noreferrer" className="h-[40px] w-[40px] text-purple-500 rounded-full flex items-center justify-center text-lg border-2 border-[#E6E6E6]">
              {moon}
            </Link>
            <Link href="/login" passHref target="_blank" rel="noopener noreferrer" className="h-[40px] w-[40px] text-purple-500 rounded-full flex items-center justify-center text-lg border-2 border-[#E6E6E6]">
              {profile}
            </Link>
      </div>
    </header>
  )
}

export default Header