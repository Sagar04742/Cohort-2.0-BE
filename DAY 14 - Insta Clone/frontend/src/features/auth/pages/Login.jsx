import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import "../style/form.scss";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const {handleLogin ,loading} = useAuth()
  const Navigate = useNavigate()
 
  if(loading){
    return <h1>Loading</h1>
  }


  async function handleSubmit(e) {
    e.preventDefault()

    handleLogin(username,password).then((res)=>{
      console.log(res)
      Navigate('/')
    })
  }

  return (
    <main>
      <div className="form-container">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <input
            onInput={(e) => {
              setUsername(e.target.value);
            }}
            type="text"
            name="username"
            placeholder="Enter username"
          />
          <input
            onInput={(e) => {
              setPassword(e.target.value);
            }}
            type="password"
            name="password"
            placeholder="Enter password"
          />

          <button>Login</button>
        </form>

        <p>
          Don't have an account?{" "}
          <Link className="toggleAuthForm" to="/register">
            register
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Login;
