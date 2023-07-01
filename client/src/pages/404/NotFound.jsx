import React from "react";
import "./NotFound.scss";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoToHomepage = () => {
    if (window.history.length > 1) {
      navigate(-1); // Regresar a la página anterior
    } else {
      navigate("/"); // Redirigir al inicio
    }
  };

  return (
    <>
      <div className="container_error">
        <title>Page Not Found</title>
        <img className="img" src="https://i.ibb.co/W6tgcKQ/softcodeon.gif" />
        <h1 className="error-text">
          Whoops, We cant seem to find the resource youre looking for.
        </h1>
        <p className="text">
          Please check that the Web site address is spelled correctly.Or,
        </p>
        <div className="btn1">
          <button
            style={{ cursor: "pointer" }}
            className="error"
            onClick={handleGoToHomepage}
          >
            Go to Homepage
          </button>
        </div>
      </div>
    </>
  );
};

export default NotFound;
