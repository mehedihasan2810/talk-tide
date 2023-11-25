import React from 'react'

const BgGradients = () => {
  return (
    <div className="absolute -top-40 left-1/2 -z-10 flex -translate-x-1/2 gap-24 ">
    <div className="h-[900px] w-40 rotate-45 rounded-full bg-gradient-to-r from-cyan-300 to-blue-300 opacity-20  blur-[30px]"></div>
    <div className="h-[900px] w-40 rotate-45 rounded-full bg-gradient-to-r from-violet-300 to-fuchsia-300 opacity-20  blur-[30px]"></div>
    <div className="h-[900px] w-40 rotate-45 rounded-full bg-gradient-to-r from-sky-300 to-indigo-300 opacity-20  blur-[30px]"></div>
    <div className="h-[900px] w-40 rotate-45 rounded-full bg-gradient-to-r from-purple-300 to-pink-300 opacity-20  blur-[30px]"></div>
  </div>
  )
}

export default BgGradients