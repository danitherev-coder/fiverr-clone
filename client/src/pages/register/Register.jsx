import React, { useEffect, useState } from "react";
import "./Register.scss";
import upload from "../../utils/upload";
import newRequest from "../../utils/newRequest";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);

  const [file, setFile] = useState(null);
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    img: "",
    country: "",
    isSeller: false,
    desc: "",
  });

  const handleChange = (e) => {
    setUser((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };
  const handleSeller = (e) => {
    setUser((prev) => {
      return { ...prev, isSeller: e.target.checked };
    });
  };

  // const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = await upload(file || null);
    try {
      await newRequest.post("/api/auth/register", {
        ...user,
        img: url !== null ? url : "",
      });

      setFormSubmitted(true); // Establece el estado formSubmitted a true

      // toast.success("Se envió un correo para confirmar su cuenta", {
      //   autoClose: false,
      // });
    } catch (error) {
      console.log(error);
    }
  };

  //=============================================================
  //            SUBIR IMAGEN A CLOUDINARY
  //=============================================================

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const navigate = useNavigate();

  useEffect(() => {
    // si existe un currentUser, entonces no mostrar esta pagina
    // const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser) {
      navigate("/");
    }
  }, [currentUser]);

  return (
    <div className="register">
      {formSubmitted ? (
        <div className="success-message">
          <h2>¡Registro exitoso!</h2>
          <p>Se envió un correo para confirmar su cuenta.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="left">
            <h1>Create a new account</h1>
            <label htmlFor="">Username</label>
            <input
              name="username"
              type="text"
              placeholder="johndoe"
              onChange={handleChange}
            />
            <label htmlFor="">Email</label>
            <input
              name="email"
              type="email"
              placeholder="email"
              onChange={handleChange}
            />
            <label htmlFor="">Password</label>
            <input name="password" type="password" onChange={handleChange} />
            <label htmlFor="">Profile Picture</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              name="img"
            />
            <label htmlFor="">Country</label>
            <input
              name="country"
              type="text"
              placeholder="Usa"
              onChange={handleChange}
            />
            <button type="submit">Register</button>
            <Link
              to="/login"
              className="link"
              style={{
                color: "lightgreen",
                fontSize: "14pt",
                fontWeight: "bold",
              }}
            >
              <span>Do you have account? Sign In</span>
            </Link>
          </div>
          <div className="right">
            <h1>I want to become a seller</h1>
            <div className="toggle">
              <label htmlFor="">Activate the seller account</label>
              <label className="switch">
                <input type="checkbox" onChange={handleSeller} />
                <span className="slider round"></span>
              </label>
            </div>
            <label htmlFor="">Phone Number</label>
            <input
              name="phone"
              type="text"
              placeholder="+1 234 567 89"
              onChange={handleChange}
            />
            <label htmlFor="">Description</label>
            <textarea
              placeholder="A short description of yourself"
              name="desc"
              id=""
              cols="30"
              rows="10"
              onChange={handleChange}
            ></textarea>
          </div>
        </form>
      )}
    </div>
  );
};

export default Register;
