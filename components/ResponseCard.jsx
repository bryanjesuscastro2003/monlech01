import React from 'react'


const ResponseCard = ({author, response}) => {
  return (
    <div className = "lg:w-2/5 md:w-3/5 sm:w-4/5  px-3 py-2 bg-emerald-400 shadow-xl mb-3 transition-all duration-500 ease-in hover:scale-105 hover:cursor-pointer">
           <h2 className="font-bold text-xl">Author  : {author}</h2>
           <h2 className="font-bold text-xl">Respone :</h2>
           <h2 className="font-semiboldtext-xl">{response}</h2>
    </div>
  )
}

export default ResponseCard