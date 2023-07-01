import React, { useEffect, useState } from "react";
import newRequest from "../../utils/newRequest";
import { Link, useParams } from "react-router-dom";
import "./ConfirmarEmail.scss";

const ConfirmarEmail = () => {
  const [validaUrl, setValidaUrl] = useState(false);
  const [success, setSuccess] = useState(false);
  const param = useParams();
  const { token } = param;

  useEffect(() => {
    const verifyEmailUrl = async () => {
      try {
        const url = `http://localhost:8800/api/auth/confirmar-email/${token}`;
        const { data } = await newRequest.get(url);
        console.log(data);
        setValidaUrl(true);
        setSuccess(true);
      } catch (error) {
        console.log(error);

        setValidaUrl(false);
      }
    };
    verifyEmailUrl();
  }, [token]);

  return (
    <div className="message-container">
      {validaUrl ? (
        <div className="confirmado">
          <h2 className="confirmado-text">{success}</h2>
          <p>
            Ahora puede iniciar sesión <Link to="/login">aquí</Link>
          </p>
        </div>
      ) : (
        <div className="no-confirmado">
          <h2 className="no-confirmado-text">Error al confirmar el token</h2>
        </div>
      )}
    </div>
  );
};

export default ConfirmarEmail;
