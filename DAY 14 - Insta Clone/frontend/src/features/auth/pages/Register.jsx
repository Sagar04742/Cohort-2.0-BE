import { Link, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";

const Register = () => {
  const { user, loading, handleRegister } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault();

    await handleRegister(username,email,password)
    console.log("User registered")
    navigate('/login')
  }

  if(loading){
    return(
      <main>
        <h1>Loading..</h1>
      </main>
    )
  }

  return (
    <main>
      <div className="form-container">
        <h1>Register</h1>
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
              setEmail(e.target.value);
            }}
            type="email"
            name="email"
            placeholder="Enter email"
          />
          <input
            onInput={(e) => {
              setPassword(e.target.value);
            }}
            type="password"
            name="password"
            placeholder="Enter password"
          />
          <button className="button primary-button">Register</button>
        </form>
        <p>
          Already have an account? <Link to={"/login"}>Login.</Link>
        </p>
      </div>
    </main>
  );
};

export default Register;
