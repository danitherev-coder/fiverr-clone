import React, { useEffect, useState } from "react";
import "./Login.scss";
import newRequest from "../../utils/newRequest";
import { Link, useNavigate } from "react-router-dom";
import GoogleSignIn from "../../components/GoogleSignIn/GoogleSignIn ";

const Login = () => {
  const [inputLogin, setInputLogin] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setInputLogin({ ...inputLogin, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await newRequest.post("/api/auth/login", inputLogin);
      // const { data } = await newRequest.post("auth/login", inputLogin);
      localStorage.setItem("currentUser", JSON.stringify(data));
      navigate("/");
    } catch (error) {
      console.log(error);
      setError(error.response.data.error);
    }
  };

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  useEffect(() => {
    // si existe un currentUser, entonces no mostrar esta pagina
    // const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser) {
      navigate("/");
    }
  }, [currentUser]);

  return (
    <div className="login">
      <form onSubmit={handleSubmit}>
        <h1>Sign in</h1>
        <label htmlFor="">Username</label>
        <input
          name="username"
          type="text"
          placeholder="johndoe"
          onChange={handleChange}
        />

        <label htmlFor="">Password</label>
        <input
          name="password"
          type="password"
          onChange={handleChange}
          placeholder="****"
        />
        <Link to="/register" className="link">
          <span
            style={{ color: "lightblue", fontWeight: "500", fontSize: "12pt" }}
          >
            Don &apos;t have an account?
          </span>
          <span
            style={{
              color: "lightgreen",
              fontWeight: "bold",
              fontSize: "12pt",
              textDecoration: "underline",
            }}
          >
            {" "}
            Sign Up
          </span>
        </Link>
        <Link to="/olvide-password" className="link">
          <p
            style={{
              color: "lightgreen",
              fontWeight: "bold",
              fontSize: "12pt",
            }}
          >
            Forgot password?
          </p>
        </Link>
        <button type="submit">Login</button>
        <GoogleSignIn />
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
};

export default Login;
