import React from 'react'

interface MainContentLayoutProps{
    children: React.ReactNode;
}

function MainLayout({ children }: MainContentLayoutProps) {
  return ( 
    <div className="main-layout flex-1 bg-[#EDEDED] border-2 border-white rounded-[1.5rem] overflow-auto">{children}</div>
  )
}

export default MainLayout 