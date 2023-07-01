import React, { useState } from "react";
import "./ForgotPassword.scss";
import newRequest from "../../utils/newRequest";
import "react-toastify/dist/ReactToastify.css";

const ForgotPassword = () => {
  const [inputEmail, setInputEmail] = useState({
    email: "",
  });

  const [error, setError] = useState(null);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false); // Variable de estado para controlar la visualización del formulario

  const handleChange = (e) => {
    setInputEmail({ ...inputEmail, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await newRequest.post("/api/auth/olvide-password", inputEmail);
      // toast.success("Se envió un correo para restablecer la contraseña");
      setIsFormSubmitted(true); // Se establece como verdadero para ocultar el formulario
    } catch (error) {
      console.log(error);
      setError(error.response.data.message);
    }
  };

  return (
    <div className="forgotpassword">
      {!isFormSubmitted ? ( // Verifica si el formulario ha sido enviado
        <form onSubmit={handleSubmit}>
          <h2>Restablecer Contraseña</h2>
          <p style={{ color: "gray", fontWeight: "400" }}>
            Debes introducir tu dirección de correo electrónico para que te
            enviemos un enlace para restablecer tu contraseña.
          </p>
          <label htmlFor="">Correo electrónico</label>
          <input
            name="email"
            type="email"
            placeholder="ejemplo@mail.com"
            onChange={handleChange}
          />
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button type="submit">Restablecer la contraseña</button>
        </form>
      ) : (
        <div
          className="confirmation-message"
          style={{ marginTop: "100px", marginBottom: "100px" }}
        >
          <h2>Se envió un correo para restablecer la contraseña</h2>
          <p>
            Por favor, revisa tu bandeja de entrada y sigue las instrucciones
            para restablecer tu contraseña.
          </p>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
