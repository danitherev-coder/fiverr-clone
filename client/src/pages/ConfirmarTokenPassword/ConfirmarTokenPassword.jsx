import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import newRequest from "../../utils/newRequest";

const ConfirmarTokenPassword = () => {
  const [validaUrl, setValidaUrl] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const param = useParams();
  const { token } = param;

  useEffect(() => {
    const verifyEmailUrl = async () => {
      try {
        const url = `http://localhost:8800/api/auth/olvide-password/${token}`;
        const { data } = await newRequest.get(url);
        console.log(data);
        setValidaUrl(true);
        setSuccess(true);
        setRedirect(true);
      } catch (error) {
        console.log(error);
        setError(error.response.data.message);
        setValidaUrl(false);
      }
    };
    verifyEmailUrl();
  }, [token]);

  console.log(validaUrl);
  return (
    <div>
      {success ? (
        <div
          style={{
            textAlign: "center",
            marginTop: "80px",
            marginBlock: "80px",
            color: "green",
          }}
        >
          <h2>Token verificado correctamente</h2>
          <p>Puede proceder a restablecer su contraseña.</p>
          {redirect &&
            setTimeout(() => {
              window.location.href = `/restablecer-password/${token}`;
            }, 2000)}
        </div>
      ) : (
        <div
          style={{
            textAlign: "center",
            marginTop: "80px",
            marginBlock: "80px",
            color: "red",
          }}
        >
          <h2>Token no verificado</h2>
          <p>El token no es valido o ha expirado.</p>
        </div>
      )}
    </div>
  );
};

export default ConfirmarTokenPassword;
