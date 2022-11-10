import React, { useContext, useEffect } from "react";
import { Context } from "../context";
import Loading from "../components/Loading";
import FetchingAuth from "../fetching/authClass";
import { authEndpoint } from "../endpoints/index";
import { useRouter } from "next/router";
import CardSubject from "../components/CardSubject";

import MathPicture from "../public/mathSubject.webp";
import SpanishPicture from "../public/spanishSubject.jpg";
import HistoryPicture from "../public/historySubject.jpg";
import GeographyPicture from "../public/geograpySubject.jpg";

const Dashboard = ({ authData }) => {
  const { state, dispatch } = useContext(Context);
  const router = useRouter();

  useEffect(() => {
    if (authData.ok)
      dispatch({
        type: "RELOADING",
        payload: authData,
      });
    else router.push("/");
    if (!state.loggedIn) router.push("/");
  }, [authData]);

  const GoSubject = (subject) => {
    router.push(`/Dashboard/${subject}`);
  };

  return (
    <div className="w-full  flex items-center flex-wrap justify-around p-5">
      <CardSubject
        picture={MathPicture}
        title="Math Subject"
        value={() => GoSubject("Math")}
      />
      <CardSubject
        picture={SpanishPicture}
        title="Spanish Subject"
        value={() => GoSubject("Spanish")}
      />
      <CardSubject
        picture={HistoryPicture}
        title="History Subject"
        value={() => GoSubject("History")}
      />
      <CardSubject
        picture={GeographyPicture}
        title="Geography Subject"
        value={() => GoSubject("Geography")}
      />
    </div>
  );
};

export const getServerSideProps = async ({ req, res }) => {
  try {
    const authWorker = new FetchingAuth(authEndpoint);
    const responseAuth = await authWorker.getInfoJWT(req.cookies.userMonlech);

    return { props: { authData: responseAuth } };
  } catch (error) {
    return { props: { authData: { ok: false } } };
  }
};

export default Dashboard;
