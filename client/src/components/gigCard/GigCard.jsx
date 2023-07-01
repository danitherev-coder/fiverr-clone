import React, { useState, useEffect, Suspense, lazy } from "react";
import "./GigCard.scss";
import { useMutation, useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation, useNavigate } from "react-router-dom";
import ReactModal from "react-modal";
const GoogleSignIn = lazy(() => import("../GoogleSignIn/GoogleSignIn "));
// import GoogleSignIn from "../GoogleSignIn/GoogleSignIn ";
// const ReactModal = lazy(() => import("react-modal"));
// ReactModal.setAppElement("#root");
const GigCard = ({ item }) => {
  const location = useLocation();

  console.log(location, "estoy aca ahora mismo");

  const { isLoading, error, data } = useQuery({
    queryKey: [item?.userId],
    queryFn: () =>
      newRequest.get(`/api/user/${item?.userId}`).then((res) => {
        return res.data;
      }),
  });

  const [isInWishlist, setIsInWishlist] = useState(false);

  const mutation = useMutation((data) =>
    newRequest.put("/api/gigs/wishlist", data)
  );

  console.log(item._id, "este id que es xd");

  useEffect(() => {
    const checkIsInWishlist = async () => {
      try {
        const response = await newRequest.get("/api/user/wishlist");
        const wishlist = response.data;
        console.log(wishlist, "que es esto xd");

        const isInWishlist = wishlist.some(
          (wishList) => wishList?._id === item?._id
        );
        // const isInWishlist = wishlist.some((wishList) =>
        //   console.log(wishList, "estoy haciendo some")
        // );
        setIsInWishlist(isInWishlist);
      } catch (error) {
        console.log("Error checking wishlist:", error);
      }
    };

    checkIsInWishlist();
  }, [item?._id, setIsInWishlist]);

  const addToWishlist = async (prodId) => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      // Mostrar el modal de inicio de sesión
      setShowModal(true);
    } else {
      try {
        await mutation.mutateAsync({ prodId });

        console.log("Wishlist updated:", mutation.data);
        setIsInWishlist(!isInWishlist); // Invierte el estado del botón de "heart"

        // Cancelar el mensaje anterior si se da clic varias veces y se muestra el último mensaje
        toast.dismiss();

        if (isInWishlist) {
          toast.error("Gig eliminado de la lista de deseos", {
            style: { color: "red" },
          });
        } else {
          toast.success("Producto agregado a la lista de deseos");
        }
      } catch (error) {
        console.log(prodId, "este es el prodId");
        console.log("Error updating wishlist:", error);
      }
    }
  };

  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const [inputLogin, setInputLogin] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setInputLogin({ ...inputLogin, [e.target.name]: e.target.value });
  };
  const handleGoogleSignIn = () => {
    setShowModal(false); // Cierra el modal después de iniciar sesión con Google
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await newRequest.post("/api/auth/login", inputLogin);
      localStorage.setItem("currentUser", JSON.stringify(data));
      setShowModal(false);
      // if (localStorage.getItem("currentUser")) {
      //   setShowModal(false); // Cerrar el modal si existe un currentUser
      // }
      setTimeout(() => {
        // navigate(location.pathname);
        navigate(`/gigs?cat=${location.search.split("=")[1]}`);
      }, -1);
    } catch (error) {
      console.log(error);
    }
  };

  console.log(item, "que es item?");
  console.log(data, "aca estare el usuario creador del gig?");
  let imageSource = "/img/noavatar.webp"; // Imagen por defecto

  if (data && data?.google) {
    if (data?.img.includes("googleusercontent")) {
      // Si la URL contiene "googleusercontent", se asume que es la imagen de Google
      imageSource = data?.img;
    } else {
      imageSource = `https://res.cloudinary.com/dpyr2wyaf/image/upload/v1687117130/${data?.img}`;
    }
  } else {
    // Usuario no autenticado con Google, se asume que la imagen está en Cloudinary
    imageSource = `https://res.cloudinary.com/dpyr2wyaf/image/upload/v1687117130/${data?.img}`;
  }
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="gigCard">
        <a
          href={`/gig/${item?._id}`}
          className="link"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={`https://res.cloudinary.com/dpyr2wyaf/image/upload/v1687117130/${item?.cover}`}
            alt="imagen del gig"
            // loading="lazy"
          />
          <div className="info">
            {isLoading ? (
              "loading"
            ) : error ? (
              "Something went wrong"
            ) : (
              <div className="user">
                <img
                  // src={
                  //   `https://res.cloudinary.com/dpyr2wyaf/image/upload/v1687117130/${data?.img}` ||
                  //   "/img/noavatar.webp"
                  // }
                  src={imageSource}
                  alt="user profil"
                  // loading="lazy"
                />
                <span>{data?.username}</span>
              </div>
            )}
            <p>{item?.shortDesc}</p>
            <div className="star">
              <img src="./img/star.webp" alt="calificacion" loading="lazy" />
              <span>
                {!isNaN(item?.totalStars / item?.starNumber) &&
                  (
                    Math.round((item?.totalStars / item?.starNumber) * 100) /
                    100
                  ).toFixed(1)}
              </span>
              <span style={{ color: "gray" }}>({item?.starNumber})</span>
            </div>
          </div>
        </a>
        <hr />
        <div className="details">
          <button
            onClick={() => addToWishlist(item?._id)}
            style={{
              backgroundColor: "transparent",
              border: "none",
              width: "40px",
              height: "40px",
            }}
            title="Guardar en la lista"
          >
            <img
              src={isInWishlist ? "./img/redheart.webp" : "./img/heart.webp"}
              title={
                isInWishlist ? "Eliminar de la lista" : "Guardar en la lista"
              }
              style={{ width: "70%", height: "70%", marginTop: "5px" }}
              loading="lazy"
              alt="heart"
            />
          </button>
          <div className="price">
            <span>STARTING AT</span>
            <h2>${item?.price}</h2>
          </div>
        </div>
      </div>

      {/* Modal de inicio de sesión */}

      <ReactModal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        // appElement="#root"
        style={{
          content: {
            width: "50%",
            height: "65%",
            margin: "auto",
            backgroundColor: "white",
            position: "absolute",
            // zIndex: "999",
          },
          overlay: {
            zIndex: "999",
            overflow: "hidden",
          },
        }}
      >
        <div
          className="login"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <form
            onSubmit={handleSubmit}
            style={{
              width: "360px",
              padding: "100px 0px",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            <h1 style={{ color: "gray", marginBottom: "20px" }}>Sign in</h1>
            <label htmlFor="" style={{ color: "gray", marginBottom: "18px" }}>
              Username
            </label>
            <input
              name="username"
              type="text"
              placeholder="johndoe"
              onChange={handleChange}
              style={{
                padding: "20px",
                border: "1px solid rgb(216, 214, 214)",
              }}
            />

            <label htmlFor="">Password</label>
            <input
              name="password"
              type="password"
              onChange={handleChange}
              style={{
                padding: "20px",
                border: "1px solid rgb(216, 214, 214)",
              }}
            />
            <button
              type="submit"
              style={{
                border: "none",
                padding: "20px",
                color: "white",
                fontWeight: 500,
                fontSize: "18px",
                backgroundColor: "#1dbf73",
                cursor: "pointer",
              }}
            >
              Login
            </button>
            <GoogleSignIn onGoogleSignIn={handleGoogleSignIn} />
            {error && <p style={{ color: "red" }}>{error}</p>}
          </form>
        </div>
      </ReactModal>
    </Suspense>
  );
};

export default GigCard;
