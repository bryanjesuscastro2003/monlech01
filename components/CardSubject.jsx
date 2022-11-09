import React from 'react'
import Image from 'next/image'

const CardSubject = ({picture, title, value}) => {
  return (
    <div onClick={value} className="w-72 shadow-2xl  rounded-xl p-1  hover:cursor-pointer transition-all duration-500 hover:scale-105">
         <Image
              src = {picture}
              alt = {title}
              className="w-full h-60"
          />          
          <h2 className = "font-bold text-2xl text-center text-cyan-600">{title}</h2> 
    </div>
  )
}

export default CardSubject