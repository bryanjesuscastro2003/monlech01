import React, { useEffect, useContext, useState } from "react";
import { Context } from "../../context";
import { useRouter } from "next/router";
import { blogEndpoint, authEndpoint } from "../../endpoints/index";
import FetchingBlog from "../../fetching/blogClass";
import FetchingAuth from "../../fetching/authClass";
import QuestionCard from "../../components/QuestionCard";
import Loading from "../../components/Loading"

const Subject = ({ authData, payload }) => {
  const { state, dispatch } = useContext(Context);
  const [myAuthData, setMyAuthData] = useState({});
  const [questionData, setQuestionData] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (authData.ok && payload.ok) setMyAuthData(authData);
    else router.push("/");
  }, []);

  useEffect(() => {
    dispatch({
      type: "RELOADING",
      payload: myAuthData,
    });
  }, [myAuthData]);

  const loadQuestion = async () => {
    try {
       console.log(questionData)     
       setQuestionData("")
    } catch (error) {
      
    }
  }

  return (
    <div className="w-full">
      <h2 className="font-bold text-3xl text-center">
        Subject : {payload.data.subject}
      </h2>
      <siv className="w-full flex flex-wrap items-center justify-evenly pt-5">
        {payload.data.information.questions.map((question) => (
          <QuestionCard author={question.author} question={question.question} />
        ))}
      </siv>
      <div className="w-full flex justify-center items-center mb-2 ">
        <input
          type="text"
          placeholder="Write any question"
          value = {questionData}
          onChange={e => setQuestionData(e.target.value)}
          className="shadow appearance-none border rounded w-2/5 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        <button onClick={loadQuestion} className="bg-teal-500 text-white font-bold px-7 py-3  ml-2 shadow-xl rounded-xl">
          Add
        </button>
      </div>
      <Loading/>
      <button
        className="bg-sky-600 text-white font-bold px-7 py-3 mt-4 ml-2 shadow-xl rounded-xl"
        onClick={() => router.push("/Dashboard")}
      >
        Back
      </button>
    </div>
  );
};

export const getServerSideProps = async (context) => {
  try {
    const authWorker = new FetchingAuth(authEndpoint);
    const blogWorker = new FetchingBlog(blogEndpoint);
    const responseAuth = await authWorker.getInfoJWT(
      context.req.cookies.userMonlech
    );
    const response = await blogWorker.getSubjectData({
      action: "GETALLSUBJECT",
      payload: context.params.Subject,
    });
    return { props: { authData: responseAuth, payload: response } };
  } catch (error) {
    console.log(error);
    return { props: { data: {} } };
  }
};

export default Subject;
