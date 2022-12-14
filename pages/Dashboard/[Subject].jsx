import React, { useEffect, useContext, useState } from "react";
import { Context } from "../../context";
import { useRouter } from "next/router";
import { blogEndpoint, authEndpoint } from "../../endpoints/index";
import FetchingBlog from "../../fetching/blogClass";
import FetchingAuth from "../../fetching/authClass";
import QuestionCard from "../../components/QuestionCard";
import Loading from "../../components/Loading";

const Subject = ({ authData, payload }) => {
  const { state, dispatch } = useContext(Context);
  const [myAuthData, setMyAuthData] = useState({});
  const [questionData, setQuestionData] = useState("");
  const [errorData, setErrorData] = useState("");
  const blogWorker = new FetchingBlog(blogEndpoint);
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
      dispatch({
        type: "SETISLOADING",
        payload: { isLoading: true },
      });
      const { ok, message } = await blogWorker.postSubjectData({
        action: "POSTNEWQUESTION",
        payload: {
          subject: payload.data.subject,
          question: questionData,
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
        payload: { IsLoading: false },
      });
    }
  };

  const deleteQuestion = async (_id) => {
    try {
      if(!confirm("Are you sure you want to delete this question?")) return
      const data = {
        action: "DELETEQUESTION",
        payload: payload.data.subject,
        questionID: _id,
      };
      const response = await blogWorker.deleteSubjectQuestion(data);
      if (response.ok) {
        alert("Question removed successfully");
        router.reload();
      }
    } catch (error) {}
  };

  const updateQuestion = async (_id) => {
    try {
      if(questionData==="") alert("Please enter a question value!");
      else if(!confirm("Are you sure you want to modify this question?")) return
      else{
        const data = {
          action: "UPDATEQUESTION",
          payload: {
              subject : payload.data.subject,
              questionID: _id,
              value : questionData
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

  return (
    <div className="w-full">
      <h2 className="font-bold text-3xl text-center">
        Subject : {payload.data.subject}
      </h2>
      <div className="w-full flex justify-center items-center mb-2 ">
        <input
          type="text"
          placeholder="Write any question"
          value={questionData}
          onChange={(e) => setQuestionData(e.target.value)}
          className="shadow appearance-none border rounded w-2/5 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        <button
          onClick={loadQuestion}
          className="bg-teal-500 text-white font-bold px-7 py-3  ml-2 shadow-xl rounded-xl"
        >
          Add
        </button>
      </div>
      <siv className="w-full flex flex-wrap items-center justify-evenly pt-5">
        {payload.data.information.questions.map((question) => (
          <QuestionCard
            key={question._id}
            _id={question._id}
            author={question.author}
            question={question.question}
            action={() =>
              router.push(`/Dashboard/${payload.data.subject}/${question._id}`)
            }
            updateMethod={updateQuestion}
            deleteMethod={deleteQuestion}
          />
        ))}
      </siv>

      {state.isLoading && <Loading />}
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
    return { props: { data: {} } };
  }
};

export default Subject;
