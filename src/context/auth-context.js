import { createContext } from "react"
import React from 'react';
export default React.createContext({
    token: null,
    userId: null,
    login: (token, usrId, tokenExpiration) => {},
    logout: ()=>{}
});