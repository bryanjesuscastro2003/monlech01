import { BiUser, BiKey } from "react-icons/bi";
import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { authEndpoint } from "../endpoints/index";
import FetchingAuth from "../fetching/authClass";
import { hasCookie, getCookies, deleteCookie } from "cookies-next";
import { Context } from "../context";
import Loading from "../components/Loading";
import {domain} from "../config/config"

export default function Home() {
  const router = useRouter();
  const authWorker = new FetchingAuth(authEndpoint);
  const { state, dispatch } = useContext(Context);

  const [data, setData] = useState({
    username: "bryan",
    password: "bryan",
  });

  const [response, setResponse] = useState({
    loggedIn: false,
    ok: false,
    message: "",
    data: {},
    jwt: null,
  });

  useEffect(() => {
    const methodAsync = async (token) => {
      try {
        const response = await authWorker.getInfoJWT(token);
        dispatch({
          type: "SETISLOADING",
          payload: { isLoading: false },
        });
        if (response.ok) {
          dispatch({
            type: "LOGGEDIN",
            payload: response,
          });
          router.push("Dashboard");
        } else {
          deleteCookie("userMonlech", {
            path: "/",
            domain,
          });
        }
      } catch (error) {
        dispatch({
          type: "SETISLOADING",
          payload: { isLoading: false },
        });
      }
    };

    try {
      dispatch({
        type: "SETISLOADING",
        payload: { isLoading: true },
      });
      const isCookie = hasCookie("userMonlech", {
        path: "/",
        domain,
      });
      if (isCookie) {
        const myToken = getCookies("userMonlech", {
          path: "/",
          domain,
        });
        methodAsync(myToken.userMonlech);
      }
      dispatch({
        type: "SETISLOADING",
        payload: { isLoading: false },
      });
    } catch (error) {
      dispatch({
        type: "SETISLOADING",
        payload: { isLoading: false },
      });
    }
  }, []);

  const signIn = async (e) => {
    try {
      e.preventDefault();
      dispatch({
        type: "SETISLOADING",
        payload: { isLoading: true },
      });
      const response = await authWorker.signIn(data);
      setResponse(response);
      dispatch({
        type: "SETISLOADING",
        payload: { isLoading: false },
      });
      if (response.ok) {
        dispatch({
          type: "LOGGEDIN",
          payload: response,
        });
        router.push("Dashboard");
      }
    } catch (error) {}
  };
  return (
    <div className="w-full  min-h-screen  flex-col justify-center items-center">
      <main className="w-full flex justify-center mt-5">
        <form
          className="flex flex-col w-3/4 md:w-2/4 lg:w-1/4  justify-center items-center shadow-lg py-20 gap-y-3 p-2"
          onSubmit={signIn}
        >
          <label className="font-bold">Welcome student</label>
          <div className="flex w-full items-center justify-center">
            <BiUser className="text-2xl" />
            <input
              type="text"
              required
              placeholder="Your username "
              onChange={(e) => setData({ ...data, username: e.target.value })}
              value={data.username}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="flex w-full items-center justify-center">
            <BiKey className="text-2xl" />
            <input
              type="password"
              required
              placeholder="Your password "
              onChange={(e) => setData({ ...data, password: e.target.value })}
              value={data.password}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <button className="bg-emerald-500 w-full text-white font-bold px-5 py-2 rounded-xl transition-all duration-500 hover:scale-105">
            Get into
          </button>
          <label className="font-bold text-red-600">
            {[!response.ok, response.message].every(Boolean) &&
              `*${response.message}`}
          </label>
          {state.isLoading && <Loading />}
        </form>
      </main>
    </div>
  );
}
