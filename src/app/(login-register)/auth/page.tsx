"use client";
import React, { useState } from "react";
import Register from "../register/page";
import Login from "../login/page";

const Auth = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true);

  return (
    <>
      {isLogin ? (
        <Login updateIsLogin={() => setIsLogin(false)} />
      ) : (
        <Register updateIsLogin={() => setIsLogin(true)} />
      )}
    </>
  );
};

export default Auth;
