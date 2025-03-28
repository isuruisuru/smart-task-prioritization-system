"use client";
import { useUserContext } from '@/context/userContext';
import Sidebar from '@/app/Components/Sidebar/Sidebar'
import React from 'react'


function SidebarProvider() {
  const userId = useUserContext().user._id;
  return (
    <>
    {userId && <Sidebar />}
    </>
  )
}

export default SidebarProvider