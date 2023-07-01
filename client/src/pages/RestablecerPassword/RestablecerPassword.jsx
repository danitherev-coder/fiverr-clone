import React, { useState } from "react";
import newRequest from "../../utils/newRequest";
import { Link, useParams } from "react-router-dom";
import "./RestablecerPassword.scss";

const RestablecerPassword = () => {
  const [inputPassword, setInputPassword] = useState({
    password: "",
  });

  const { token } = useParams();

  const [error, setError] = useState(null);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false); // Variable de estado para controlar la visualización del formulario

  const handleChange = (e) => {
    setInputPassword({ ...inputPassword, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await newRequest.post(
        `/api/auth/restablecer-password/${token}`,
        inputPassword
      );
      setIsFormSubmitted(true); // Establece como verdadero para ocultar el formulario y mostrar el mensaje de éxito
    } catch (error) {
      console.log(error);
      setError(error.response.data.message);
    }
  };

  return (
    <div className="restablecer">
      {!isFormSubmitted ? (
        <form onSubmit={handleSubmit}>
          <h2>Restablecer Contraseña</h2>
          <label htmlFor="">Tu nueva contraseña</label>
          <input name="password" type="password" onChange={handleChange} />
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button type="submit">Restablecer la contraseña</button>
        </form>
      ) : (
        <div
          style={{
            textAlign: "center",
            marginTop: "80px",
            marginBottom: "80px",
          }}
        >
          <h2>Contraseña cambiada correctamente</h2>
          <p>
            Puedes{" "}
            <Link style={{ color: "green", fontWeight: "bold" }} to="/login">
              iniciar sesión
            </Link>{" "}
            con tu nueva contraseña.
          </p>
        </div>
      )}
    </div>
  );
};

export default RestablecerPassword;
