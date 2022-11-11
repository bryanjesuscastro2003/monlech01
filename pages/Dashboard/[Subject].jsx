import React, { useEffect, useContext, useState } from "react";
import { Context } from "../../context";
import { useRouter } from "next/router";
import { blogEndpoint, authEndpoint } from "../../endpoints/index";
import FetchingBlog from "../../fetching/blogClass";
import FetchingAuth from "../../fetching/authClass";

const Subject = ({ authData, payload }) => {
  const { state, dispatch } = useContext(Context);
  const [myAuthData, setMyAuthData] = useState({});
  const router = useRouter();

  useEffect(() => {
    if (authData.ok && payload.ok) setMyAuthData(authData);
    else router.push("/");
    console.log(payload)
  }, []);

  useEffect(() => {
    dispatch({
      type: "RELOADING",
      payload: myAuthData,
    });
  }, [myAuthData]);

  return (
    <div className="w-full">
      <h2 className="font-bold text-3xl text-center">
        Subject : {payload.data.subject}{" "}
      </h2>
    </div>
  );
};

export const getServerSideProps = async (context) => {
  try {
    const authWorker = new FetchingAuth(authEndpoint);
    const blogWorker = new FetchingBlog(blogEndpoint);
    const responseAuth = await authWorker.getInfoJWT(context.req.cookies.userMonlech);
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
