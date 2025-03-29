"use client";
import { useUserContext } from "@/context/userContext";
import React from 'react'
import Link from 'next/link';
import { github, moon, profile } from "@/utils/icons";

function Header() {
  const { user } = useUserContext();

  const { name } = user;

  const userId = user._id;

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
            <span className="font-bold text-[#3aafae]">5</span> active tasks
            </>
          ): (
            "Please login to view your tasks"
          )}
        </p>
      </div>
      <div className="h-[50px] flex items-center ml-125 gap-[10.4rem]" >
            <button className="px-8 py-3 bg-[#3aafae] text-white rounded-[50px] hover:bg-[#00a1f1] hover:text-[#fff] transition-all duration-200 ease-in-out">
              Create a New Task
            </button>
      </div>

      <div className="flex gap-4 items-center">
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