import React, { useEffect, useContext, useState } from "react";
import { Context } from "../../../context";
import { useRouter } from "next/router";
import { blogEndpoint, authEndpoint } from "../../../endpoints/index";
import FetchingBlog from "../../../fetching/blogClass";
import FetchingAuth from "../../../fetching/authClass";
import QuestionCard from "../../../components/QuestionCard";
import ResponseCard from "../../../components/ResponseCard";

const Question = ({ authData, payload }) => {
  const { state, dispatch } = useContext(Context);
  const [myAuthData, setMyAuthData] = useState({});
  const [errorData, setErrorData] = useState("");
  const blogWorker = new FetchingBlog(blogEndpoint);
  const [responseData, setResponseData] = useState("");
  const router = useRouter();
  const {Question, Subject} = router.query

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


  const loadResponse = async () => {
       try {
        console.log("bA")
        dispatch({
          type: "SETISLOADING",
          payload: { isLoading: true },
        });
        const {ok, message}= await blogWorker.postSubjectData({
          action: "POSTNEWRESPONSE",
          payload: {
            subject: Subject,
            _id: Question,
            response : responseData,
            author: state.data._id,
          },
        });
        if (ok) {
          alert(message);
          router.reload();
        } else setErrorData(message);
       } catch (error) {
        setErrorData(error.message);
       }finally{
        dispatch({
          type: "SETISLOADING",
          payload: { isLoading: false },
        });
       }
  }

  return (
    <div className="w-full flex flex-col items-center justify-center pt-5">
      <h3 className="font-bold text-3xl">Question </h3>
      <QuestionCard
        author={payload.data.author}
        question={payload.data.question}
        action={() => console.log("")}
      />
      <h3 className="font-bold text-3xl">Responses</h3>
      {payload.data.responses.map((response) => (
        <ResponseCard author={response.author} response={response.response} />
      ))}
      <div className="w-full flex justify-center items-center mb-2 ">
        <input
          type="text"
          placeholder="Write your response"
          value={responseData}
          onChange={(e) => setResponseData(e.target.value)}
          className="shadow appearance-none border rounded w-2/5 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        <button
          onClick={loadResponse}
          className="bg-teal-500 text-white font-bold px-7 py-3  ml-2 shadow-xl rounded-xl"
        >
          Add
        </button>
      </div>
      <button
        className="bg-sky-600 text-white font-bold px-7 py-3 mt-4 ml-2 shadow-xl rounded-xl"
        onClick={() => router.back()}
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
      action: "GETSUBJECTQUESTION",
      payload: context.params.Subject,
      questionID: context.params.Question,
    });
    return { props: { authData: responseAuth, payload: response } };
  } catch (error) {
    return { props: { data: {} } };
  }
};

export default Question;
