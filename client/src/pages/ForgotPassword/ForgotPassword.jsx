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
          <h2>Reset Password</h2>
          <p style={{ color: "gray", fontWeight: "400" }}>
            You must enter your email address for us to send you a link to reset
            your password.
          </p>
          <label htmlFor="">E-mail address</label>
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
          <h2>An email was sent to reset the password</h2>
          <p>
            Please check your inbox and follow the instructions to reset your
            password. to reset your password.
          </p>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
