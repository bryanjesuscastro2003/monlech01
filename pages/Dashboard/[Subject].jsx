import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { blogEndpoint } from "../../endpoints/index";
import FetchingBlog from "../../fetching/blogClass";

const Subject = ({ payload }) => {
  const router = useRouter();

  useEffect(() => {
      if(!payload.ok)
            router.push("/Dashboard")
  }, []);

  
  return (
      <div className="w-full">
           <h2 className="font-bold text-3xl text-center">  Subject : {payload.data.subject} </h2>
      </div>
  )
};

export const getServerSideProps = async (context) => {
  try {
    const blogWorker = new FetchingBlog(blogEndpoint);
    const response = await blogWorker.getSubjectData({
      action: "GETALLSUBJECT",
      payload: context.params.Subject,
    });
    return { props: { payload: response } };
  } catch (error) {
    return { props: { data: {} } };
  }
};

export default Subject;
