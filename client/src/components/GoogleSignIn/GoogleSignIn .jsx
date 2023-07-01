import React, { useEffect } from "react";
import newRequest from "../../utils/newRequest";
import { useLocation, useNavigate } from "react-router-dom";
// import newRequest from "../../utils/newRequest";

const GoogleSignIn = ({ onGoogleSignIn }) => {
  const navigate = useNavigate();
  const location = useLocation();

  console.log(location, "estoy aca ahora mismo");
  async function handleCallbackResponse(response) {
    console.log("Encoded JWT ID TOKEN", response.credential);
    const body = { id_token: response.credential };
    console.log(body, "esto estoy enviando");
    // aca vamos a hacer la funcion para iniciar sesion
    const { data } = await newRequest.post("/api/auth/google", body);

    console.log(data);
    localStorage.setItem("currentUser", JSON.stringify(data));
    // navigate("/");
    setTimeout(() => {
      navigate(location.pathname);
      // navigate(`/gigs?cat=${location.search.split("=")[1]}`);
    }, 1);
    onGoogleSignIn();
  }

  // funciona para cerrar sesion de google
  //   google.accounts.id.disableAutoSelect();

  useEffect(() => {
    // NO HACER CASO AL GOOGLE QUE SALE COMO NO DEFINIDO YA QUE EN EL INDEX HTML DE LA APP PUSIMOS EL SCRIPT DE GOOGLE <script src="https://accounts.google.com/gsi/client" async defer></script> EN LA CABECERA QUE HACE QUE CARGUE TODO LO DE GOOGLE ANTES DE QUE CARGUE LA APP
    google.accounts.id.initialize({
      client_id:
        "827260632768-1e43gsvqs9hmgstv2drpi3d0pllripmi.apps.googleusercontent.com",
      callback: handleCallbackResponse,
    });

    google.accounts.id.renderButton(document.getElementById("signInDiv"), {
      theme: "outline",
      size: "large",
    });
  }, []);

  return <div id="signInDiv"></div>;
};

export default GoogleSignIn;
