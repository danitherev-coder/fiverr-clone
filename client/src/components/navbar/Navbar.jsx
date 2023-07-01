import React, { useEffect, useState } from "react";
import "./Navbar.scss";
import { Link, useLocation, useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import { useJwt } from "react-jwt";

const Navbar = () => {
  // ==============================================
  /// Scroll hacia Abajo, cambia de color el navbar
  // ==============================================
  const [active, setActive] = useState(false);

  const isActive = () => {
    window.scrollY > 0 ? setActive(true) : setActive(false);
  };
  useEffect(() => {
    window.addEventListener("scroll", isActive);

    return () => {
      window.removeEventListener("scroll", isActive);
    };
  });
  // ==================================
  //           FIN DEL NAVBAR
  // ==================================

  //================================================
  //           Vista cuando inicio sesion
  //================================================
  const currentUsers = JSON.parse(localStorage.getItem("currentUser"));

  const [currentUser, setCurrentUser] = useState(null);

  const token = currentUsers?.token;
  const userId = currentUsers?.user?._id; // Obtener el ID del usuario

  const { isExpired } = useJwt(token);
  useEffect(() => {
    if (isExpired) {
      localStorage.removeItem("currentUser");
      setCurrentUser(null);
    } else {
      const storedCurrentUser = JSON.parse(localStorage.getItem("currentUser"));
      setCurrentUser(storedCurrentUser);
    }
  }, [isExpired]);

  //================================================
  //         TERMINA LA VISTA DE INICIAR SESION
  //================================================

  // ==============================================
  //          ABRIR Y CERRAR MODAL DE PERFIL
  // ==============================================
  const [open, setOpen] = useState(false);
  // ==============================================
  //         FIN  ABRIR Y CERRAR MODAL DE PERFIL
  // ==============================================

  // ================================================
  //          VER LA LOCATION ACTUAL, para categorias
  // ================================================
  // esto servira para que el navbar no se active si esta fuera de la ruta principa('/')
  const { pathname } = useLocation();

  // ================================================
  //        CERRAR SESION
  // ================================================
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await newRequest.post("/api/auth/logout");
      // await newRequest.post("auth/logout");
      document.cookie =
        "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      localStorage.removeItem("currentUser", null);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };
  // ================================================
  //         CERRAR SESION
  // ================================================

  // cuando en el currentUser google es tru, entonces mostrare su img, pero si google es false mostrare la img de cloudinary, pero si no hay ninguna imagen, mostrare noavatar

  let img;

  if (currentUser && currentUser.user) {
    if (currentUser.user.img) {
      if (currentUser.user.img.includes("googleusercontent")) {
        // Si la URL contiene "googleusercontent", se asume que es la imagen de Google
        img = currentUser.user.img;
      } else {
        // Si el usuario ha subido una imagen a Cloudinary
        img = `https://res.cloudinary.com/dpyr2wyaf/image/upload/v1687117130/${currentUser.user.img}`;
      }
    } else {
      // Si el usuario ha iniciado sesión con Google pero no ha subido una imagen a Cloudinary
      // Aquí puedes usar la imagen de perfil de Google
      img = `https://res.cloudinary.com/dpyr2wyaf/image/upload/v1687117130/${currentUser?.user?.img}`;
    }
  } else {
    // Si no hay un usuario autenticado
    img = "/img/noavatar.webp";
  }

  console.log(img, "que hay en imagen");

  // Obtener los datos del usuario
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await newRequest.get(`/api/user/${userId}`);
        setCurrentUser((prevUser) => {
          return { ...prevUser, user: res.data };
        });
      } catch (error) {
        console.log(error);
      }
    };
    if (userId) {
      getUser();
    }
  }, [userId]);

  return (
    <div className={active || pathname !== "/" ? "navbar active" : "navbar"}>
      <div className="container">
        <div className="logo">
          <Link to="/" className="link">
            <span className="text">fiverr</span>
          </Link>
          <span className="dot">.</span>
        </div>
        <div className="links">
          {/* <span>Fiverr Business</span> */}
          <a
            href="http://localhost:5173"
            target="_blank"
            rel="noreferrer"
            className="link"
          >
            Blog
          </a>
          <span>Explore</span>
          <span>English</span>
          {!currentUser?.user?.isSeller && (
            <span>
              <Link className="link" to={`/editar-perfil/${userId}`}>
                Become a Seller
              </Link>
            </span>
          )}
          {currentUser ? (
            <>
              <span>
                <Link to="/wishlist">
                  <img
                    src="/img/redheart.webp"
                    title="Favoritos"
                    style={{ width: "20px", cursor: "pointer" }}
                  />
                </Link>
              </span>
              <div className="user" onClick={() => setOpen(!open)}>
                <img
                  // src={currentUser?.user?.img || "/img/noavatar.webp"}
                  // src={
                  //   `https://res.cloudinary.com/dpyr2wyaf/image/upload/v1687117130/${currentUser?.user?.img}` ||
                  //   "/img/noavatar.webp"
                  // }
                  src={img}
                  alt="imagen user"
                  loading="lazy"
                />
                <span>{currentUser?.user?.username}</span>
                {open && (
                  <div className="options">
                    {currentUser && currentUser?.user?.isSeller && (
                      <>
                        <Link className="link" to="/mygigs">
                          Gigs
                        </Link>
                        <Link className="link" to="/add">
                          Add New Gig
                        </Link>
                      </>
                    )}
                    <Link className="link" to="/orders">
                      Orders
                    </Link>
                    <Link className="link" to="/messages">
                      Messages
                    </Link>
                    <Link
                      className="link"
                      to={`/editar-perfil/${currentUser.user._id}`}
                    >
                      Configurar Cuenta
                    </Link>
                    <Link className="link" onClick={handleLogout}>
                      Logout
                    </Link>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="link">
                Sign in
              </Link>
              <Link className="link" to="/register">
                <button>Join</button>
              </Link>
            </>
          )}
        </div>
      </div>
      {(active || pathname !== "/") && (
        <>
          <hr />
          <div className="menu">
            <a
              className="link menuLink"
              href="/gigs?cat=artes-gráficas-y-diseño"
            >
              Graphics & Design
            </a>
            <a className="link" href="/gigs?cat=video-y-animacion">
              Video & Animation
            </a>
            <a className="link" href="/gigs?cat=redaccion-y-traduccion">
              Writing & Translation
            </a>
            <a className="link" href="/gigs?cat=ai-artists">
              AI Services
            </a>
            <a className="link" href="/gigs?cat=marketing">
              Digital Marketing
            </a>
            <a className="link" href="/gigs?cat=musica-y-video">
              Music & Audio
            </a>
            <a className="link" href="/gigs?cat=programacion-y-tecnologia">
              Programming & Tech
            </a>
            <a className="link" href="/gigs?cat=negocio">
              Business
            </a>
            <a className="link" href="/">
              LifeStyle
            </a>
          </div>
          <hr />
        </>
      )}
    </div>
  );
};

export default Navbar;
