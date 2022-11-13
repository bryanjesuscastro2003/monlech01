import React, { useContext } from "react";
import { BiTrash, BiEditAlt } from "react-icons/bi";
import { Context } from "../context";

const QuestionCard = ({ _id, author, question, action, updateMethod, deleteMethod }) => {
  const { state, dispatch } = useContext(Context);

  return (
    <div className="lg:w-2/5 md:w-3/5 sm:w-4/5 relative mb-5 transition-all duration-500 ease-in hover:scale-105">
      {state.data._id === author && (
          <div className="flex absolute -top-4">
            <button
              onClick={() => deleteMethod(_id)}
              className="w-20 bg-red-500 text-white flex justify-center py-2 mr-2 transition-all duration-500 hover:scale-105"
            >
              <BiTrash className="text-xl" />
            </button>
            <button  onClick={() => updateMethod(_id)} className="w-20 bg-green-500 text-white flex justify-center py-2 transition-all duration-500 hover:scale-105">
              <BiEditAlt className="text-xl" />
            </button>
          </div>
        )}
      <div
        onClick={action}
        className="  px-3 py-5 bg-slate-300 shadow-xl  hover:cursor-pointer"
      >
        <h2 className="font-bold text-xl">Author : {author}</h2>
        <h2 className="font-bold text-xl">Question :</h2>
        <h2 className="font-semiboldtext-xl">{question}</h2>
      </div>
    </div>
  );
};

export default QuestionCard;
