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
  const { Question, Subject } = router.query;

  useEffect(() => {
    if (authData.ok && payload.ok) setMyAuthData(authData);
    else router.back();
  }, []);

  useEffect(() => {
    dispatch({
      type: "RELOADING",
      payload: myAuthData,
    });
  }, [myAuthData]);

  const loadResponse = async () => {
    try {
      console.log("bA");
      dispatch({
        type: "SETISLOADING",
        payload: { isLoading: true },
      });
      const { ok, message } = await blogWorker.postSubjectData({
        action: "POSTNEWRESPONSE",
        payload: {
          subject: Subject,
          _id: Question,
          response: responseData,
          author: state.data._id,
        },
      });
      if (ok) {
        alert(message);
        router.reload();
      } else setErrorData(message);
    } catch (error) {
      setErrorData(error.message);
    } finally {
      dispatch({
        type: "SETISLOADING",
        payload: { isLoading: false },
      });
    }
  };

  const deleteQuestion = async (_id) => {
    try {
      if(!confirm("Are you sure you want to delete this question?")) return
      const data = {
        action: "DELETEQUESTION",
        payload: Subject,
        questionID: _id,
      };
      const response = await blogWorker.deleteSubjectQuestion(data);
      if (response.ok) {
        alert("Question removed successfully");
        router.back();
      }
    } catch (error) {}
  };

  const updateQuestion = async (_id) => {
    try {
      if(responseData==="") alert("Please enter a question value!");
      else if(!confirm("Are you sure you want to delete this question?")) return
      else{
        const data = {
          action: "UPDATEQUESTION",
          payload: {
              subject : Subject,
              questionID: _id,
              value : responseData
            },
        };
        const response = await blogWorker.updateSubjectQuestion(data);
        if (response.ok) {
          alert("Question updated successfully");
          router.reload();
        }
      }
    } catch (error) {}
  };

  const deleteResponse = (_id) => {
    console.log(_id, "response deleting");
  };

  const updateResponse = (_id) => {
    console.log(_id, "response updating");
  };

  return (
    <div className="w-full flex flex-col items-center justify-center pt-5">
      <h2 className="font-bold text-3xl text-center">
        Subject : {Subject}
      </h2>
      <h3 className="font-bold text-3xl mb-5">Question </h3>
      <QuestionCard
        author={payload.data.author}
        question={payload.data.question}
        key={payload.data._id}
        _id={payload.data._id}
        action={() => console.log("")}
        updateMethod={updateQuestion}
        deleteMethod={deleteQuestion}
      />
      <h3 className="font-bold text-3xl">Responses</h3>
      <div className="w-full flex justify-center items-center mb-5 ">
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
      {payload.data.responses.map((response) => (
        <ResponseCard
          key={response._id}
          _id={response._id}
          author={response.author}
          response={response.response}
          updateMethod={updateResponse}
          deleteMethod={deleteResponse}
        />
      ))}

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
