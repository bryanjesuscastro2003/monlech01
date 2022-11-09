import React, { useState, useEffect, useContext } from "react";
import { BiCool, BiFingerprint, BiUser, BiKey } from "react-icons/bi";
import Link from "next/link";
import { useRouter } from "next/router";
import { authEndpoint } from "../endpoints/index";
import { getCookies, setCookie, deleteCookie, hasCookie } from "cookies-next";
import FetchingAuth from "../fetching/authClass"
import { Context } from "../context";
import {domain} from "../config/config"

const SignUp = () => {
  const router = useRouter();
  const authWorker = new FetchingAuth(authEndpoint);
  const { state, dispatch } = useContext(Context);

  const [data, setData] = useState({
    name: "",
    lastname: "",
    username: "",
    password: "",
  });

  const [response, setResponse] = useState({
    ok: false,
    message: "",
    user: {},
    jwt: null,
  });

  useEffect(() => {
          const token = hasCookie("userMonlech", {path: "/", domain})
          if(token) router.push("/Dashboard")
  }, []);

  const signUp = async (e) => {
    try {
      e.preventDefault();
      const response = await authWorker.signUp(data)
      setResponse(response)
      if(response.ok) {
          setCookie("userMonlech",response.jwt )
          router.push("Dashboard")
        }
    } catch (error) {}
  };

  return (
    <div className="w-full ">
      <main className="w-full flex justify-center mt-5">
        <form
          className="flex flex-col w-3/4 md:w-2/4 lg:w-1/4  justify-center items-center shadow-lg py-20 gap-y-3 p-2"
          onSubmit={signUp}
        >
          <label className="font-bold">Create a new account</label>

          <div className="flex w-full items-center justify-center">
            <BiCool className="text-2xl" />
            <input
              type="text"
              placeholder="Your name "
              required
              onChange={(e) => setData({ ...data, name: e.target.value })}
              value={data.name}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="flex w-full items-center justify-center">
            <BiFingerprint className="text-2xl" />
            <input
              type="text"
              placeholder="Your lastname "
              required
              onChange={(e) => setData({ ...data, lastname: e.target.value })}
              value={data.lastname}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="flex w-full items-center justify-center">
            <BiUser className="text-2xl" />
            <input
              type="text"
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
              placeholder="Your password "
              onChange={(e) => setData({ ...data, password: e.target.value })}
              value={data.password}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <button className="bg-cyan-600 w-full text-white font-bold px-5 py-2 rounded-xl transition-all duration-500 hover:scale-105">
            Create account
          </button>
          <label className="font-bold text-red-600">{[!response.ok, response.message].every(Boolean) && `*${response.message}` }</label>
        </form>
      </main>
    </div>
  );
};

export default SignUp;
