import React, { useEffect, useContext, useState } from "react";
import { Context } from "../../context";
import { useRouter } from "next/router";
import { blogEndpoint, authEndpoint } from "../../endpoints/index";
import FetchingBlog from "../../fetching/blogClass";
import FetchingAuth from "../../fetching/authClass";

const Subject = ({ authData }) => {
  const { state, dispatch } = useContext(Context);
  const [myAuthData, setMyAuthData] = useState({});
  const router = useRouter();

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
    <div className="w-full">
      <h2 className="font-bold text-3xl text-center">
        {" "}
        {/*Subject : {payload.data.subject}{" "}*/}
      </h2>
    </div>
  );
};

export const getServerSideProps = async ({ req, res }) => {
  try {
    const authWorker = new FetchingAuth(authEndpoint);
    //const blogWorker = new FetchingBlog(blogEndpoint);

    const responseAuth = await authWorker.getInfoJWT(req.cookies.userMonlech);
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

export default Subject;
