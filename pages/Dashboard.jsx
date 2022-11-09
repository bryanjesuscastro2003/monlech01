import React, { useContext, useEffect } from "react";
import { Context } from "../context";
import Loading from "../components/Loading";
import FetchingAuth from "../fetching/authClass";
import { authEndpoint } from "../endpoints/index";
import { hasCookie, getCookies, deleteCookie } from "cookies-next";
const authWorker = new FetchingAuth(authEndpoint);
import { useRouter } from "next/router";
import CardSubject from "../components/CardSubject"

import MathPicture from "../public/mathSubject.webp"
import SpanishPicture from "../public/spanishSubject.jpg"
import HistoryPicture from "../public/historySubject.jpg"
import GeographyPicture from "../public/geograpySubject.jpg"

const Dashboard = ({ data }) => {
  const { state, dispatch } = useContext(Context);
   const router = useRouter()

  useEffect(() => {
       dispatch({
            type : "RELOADING",
            payload : data
       })
       if(!state.loggedIn) router.push("/")
  }, [data]);

  const GoSubject = (subject) => {
       router.push(`/Dashboard/${subject}`) 
  }

  return (
    <div className = "w-full  flex items-center flex-wrap justify-around p-5">
         <CardSubject picture = {MathPicture} title = "Math Subject" value = {() => GoSubject("Math")}/>
         <CardSubject picture = {SpanishPicture} title = "Spanish Subject" value = {() => GoSubject("Spanish")}/>
         <CardSubject picture = {HistoryPicture} title = "History Subject" value = {() => GoSubject("History")}/>
         <CardSubject picture = {GeographyPicture} title = "Geography Subject" value = {() => GoSubject("Geography")}/>
    </div>
  );
};

export const getServerSideProps = async ({ req, res }) => {
  try {
    const response = await authWorker.getInfoJWT(req.cookies.userMonlech);
    return { props: { data: response } };
  } catch (error) {
    return { props: { msg: null } };
  }
};

export default Dashboard;
