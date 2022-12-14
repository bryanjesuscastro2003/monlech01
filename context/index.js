import { useState, useEffect, useReducer, createContext } from "react";
import {UserReducer} from "./reducers"
// initial state
export const initialState = {
        isLoading : false,
        loggedIn : false, 
        ok : false, 
        message : "",
        data : {},
        jwt : null
}

const Context = createContext({}) 
const combineReducers = (...reducers) => (state, action) => {
    for (let i = 0; i < reducers.length; i++) state = reducers[i](state, action);
    return state;
  };
const Provider = ({children}) => {
    const [state, dispatch] = useReducer(combineReducers(UserReducer), initialState); // pass more reducers combineReducers(user, blogs, products)
    const value = { state, dispatch };
  
    return <Context.Provider value={value}>{children}</Context.Provider>;
}

export { Context, Provider };