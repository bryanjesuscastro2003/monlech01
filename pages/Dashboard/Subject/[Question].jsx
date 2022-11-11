import React, { useEffect, useContext, useState } from "react";
import { Context } from "../../../context";
import { useRouter } from "next/router";
import { blogEndpoint, authEndpoint } from "../../../endpoints/index";
import FetchingBlog from "../../../fetching/blogClass";
import FetchingAuth from "../../../fetching/authClass";


const Question = ({authData, payload}) => {
  const { state, dispatch } = useContext(Context);
  const [myAuthData, setMyAuthData] = useState({});
  const router = useRouter()
  

  useEffect(() => {
    if (authData.ok) setMyAuthData(authData);
    else router.push("/");
  }, []);

  useEffect(() => {
    dispatch({
      type: "RELOADING",
      payload: myAuthData,
    });
  }, [myAuthData]);

  return (
    <div>Question</div>
  )
}

export const getServerSideProps = async (context) => {
  try {
    const authWorker = new FetchingAuth(authEndpoint);
    const blogWorker = new FetchingBlog(blogEndpoint);
    const responseAuth = await authWorker.getInfoJWT(
      context.req.cookies.userMonlech
    );
    console.log(context.params.Question)
    /*const response = await blogWorker.getSubjectData({
      action: "GETALLSUBJECT",
      payload: context.params.Subject,
    });*/
    return { props: { authData: responseAuth, payload: {} } };
  } catch (error) {
    console.log(error);
    return { props: { data: {} } };
  }
};

export default Question