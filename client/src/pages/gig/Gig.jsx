import React, { lazy, useState, Suspense } from "react";
import "./Gig.scss";
import Slider from "infinite-react-carousel";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useNavigate, useParams } from "react-router-dom";
// import Reviews from "../../components/reviews/Reviews";
import moment from "moment";
import "moment/locale/es";
import ReactModal from "react-modal";

// import DOMPurify from "dompurify";
// import NotFound from "../404/NotFound";

const Reviews = lazy(() => import("../../components/reviews/Reviews"));
// const ReactModal = lazy(() => import("react-modal"));
const NotFound = lazy(() => import("../404/NotFound"));

function Gig() {
  moment.updateLocale("es", {
    months: [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ],
  }); // Establecer el idioma en español
  const { id } = useParams();
  // Obtener el usuario actual
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const { isLoading, error, data } = useQuery({
    queryKey: ["gig"],
    queryFn: () =>
      newRequest.get(`/api/gigs/single/${id}`).then((res) => {
        return res.data;
      }),
    // newRequest.get(`gigs/single/${id}`).then((res) => {
    //   return res.data;
    // }),
    enabled: !!id,
    retry: false,
  });

  const userId = data?.userId;

  // esto es para el usuario, para mostrar su imagen y nombre, ademas de su descripcion, de donde es, mejor dicho del vendedor
  const {
    isLoading: isLoadingUser,
    error: errorUser,
    data: dataUser,
  } = useQuery({
    queryKey: ["user"],
    queryFn: () =>
      newRequest.get(`/api/user/${userId}`).then((res) => {
        return res.data;
      }),
    // newRequest.get(`user/${userId}`).then((res) => {
    //   return res.data;
    // }),
    enabled: !!userId,
  });

  // obtener todos los usuarios
  const {
    isLoading: isLoadingUsers,
    error: errorUsers,
    data: users,
  } = useQuery({
    queryKey: ["users"],
    queryFn: () =>
      newRequest.get(`/api/user`).then((res) => {
        return res.data;
      }),
  });

  let count = 0;
  if (users) {
    const usersWithWishlist = users?.filter((user) =>
      user?.wishList?.includes(id)
    );
    count = usersWithWishlist?.length;
  }

  console.log(isLoadingUsers, "este es el loading de users");
  console.log(errorUsers, "este es el error de users");

  // Traer el order del usuario que compro el gig para mostrar un mensaje de cuando lo compro
  let dataOrder = null; // Inicializamos dataOrder como null fuera de useQuery
  let isLoadingOrder = false; // Inicializamos isLoadingOrder como false fuera de useQuery

  if (currentUser) {
    // Verificamos si currentUser existe
    const {
      isLoading,
      error,
      data: queriedDataOrder,
    } = useQuery({
      queryKey: ["orderss"],
      queryFn: () =>
        newRequest.get(`/api/order`).then((res) => {
          const filteredData = res.data.filter(
            (order) =>
              order?.gigId === id && order?.buyerId === currentUser?.user?._id
          );
          return filteredData;
        }),
    });

    if (error) {
      console.log(error, "este es el error de orders");
    }

    isLoadingOrder = isLoading; // Asignamos isLoading a isLoadingOrder solo si currentUser existe
    dataOrder = queriedDataOrder; // Asignamos queriedDataOrder a dataOrder solo si currentUser existe
  }

  const navigate = useNavigate();
  // ventana modal que se abre cuando se hace click en el boton de comprar si no esta logueado
  const [showModal, setShowModal] = useState(false);
  const handleContinue = () => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      setShowModal(true);
      // <Link to={`/pay/${id}`}></Link>;
    } else if (currentUser) {
      // <Link to={`/pay/${id}`}></Link>;
      navigate(`/pay/${id}`);
    }
  };

  const [inputLogin, setInputLogin] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setInputLogin({ ...inputLogin, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await newRequest.post("/api/auth/login", inputLogin);
      // const { data } = await newRequest.post("auth/login", inputLogin);
      localStorage.setItem("currentUser", JSON.stringify(data));
      setShowModal(false);
      setTimeout(() => {
        navigate(`/gig/${id}`);
        // navigate(`${location.pathname}`);
      }, -1);
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading) {
    return "Loading"; // o puedes mostrar un spinner o una animación de carga
  }

  if (isLoadingUser) {
    return "Loading User"; // o puedes mostrar un spinner o una animación de carga
  }
  if (errorUser) {
    return "Something went wrong - USER"; // o mostrar un mensaje de error adecuado
  }
  if (error) {
    return "Something went wrong - GIG"; // o mostrar un mensaje de error adecuado
  }
  // const currentUserExists = currentUser !== null && currentUser !== undefined;
  const rating = Math.round((data?.totalStars / data?.starNumber) * 10) / 10; // Redondear a un decimal

  const stars = [];
  for (let i = 0; i < Math.floor(rating); i++) {
    stars.push(
      <img
        src="/img/star.webp"
        alt="calificacion dio like"
        key={i}
        loading="lazy"
      />
    );
  }

  if (rating % 1 !== 0) {
    stars.push(
      <img
        src="/img/half-star.webp"
        alt="calificacion quito like"
        key={stars?.length}
        loading="lazy"
      />
    );
  }

  // transformar la categoria par que no me salga con -, por ejemplo hola-mundo para que se formatee a HOLA MUNDO
  const categoria = data?.cat;
  const formattedCategoria = categoria?.toUpperCase().replace(/-/g, " ");

  console.log(data, "este es el gig si existe");

  return (
    <div className="gig">
      {isLoading ? (
        "loading gig"
      ) : error ? (
        <NotFound />
      ) : (
        <div className="container">
          <div className="left">
            <span
              className="breadcrumbs"
              style={{ width: "95%", display: "flex" }}
            >
              Liverr &gt; {formattedCategoria} &gt;
              <span
                className="breadcrumbs"
                style={{ fontSize: "12pt", width: "0px" }}
              >
                <img
                  src="/img/heart.webp"
                  style={{ height: "20px", marginLeft: "609px" }}
                  title="Guardaron en su Favoritos"
                  loading="lazy"
                  alt="guardar faorito"
                />
              </span>
              <span
                style={{
                  fontSize: "12pt",
                  marginLeft: "auto",
                }}
              >
                {count}
              </span>
            </span>
            <h1>{data && data?.title}</h1>
            <div className="user">
              <img
                className="pp"
                src={
                  `https://res.cloudinary.com/dpyr2wyaf/image/upload/v1687117130/${dataUser?.img}` ||
                  "/img/noavatar.webp"
                }
                alt="imagen del user"
                loading="lazy"
              />
              <span>{dataUser?.username}</span>
              <span>|</span>
              {!isNaN(data?.totalStars / data?.starNumber) && (
                <div className="stars">
                  {Array(
                    Math.round(
                      ((data?.totalStars / data?.starNumber) * 100) / 100
                    ).toFixed(1)
                  )
                    .fill()
                    .map((item, i) => (
                      <img src="/img/star.png" alt="" key={i} />
                    ))}
                  {stars && stars}
                  <span>
                    {(
                      Math.round((data?.totalStars / data?.starNumber) * 100) /
                      100
                    ).toFixed(1)}
                  </span>
                  <span style={{ color: "gray" }}>
                    ({data && data?.starNumber})
                  </span>
                </div>
              )}
            </div>
            <Slider slidesToShow={1} arrowsScroll={1} className="slider">
              {data && data?.images && data?.images?.[0] ? (
                data?.images.map((img) => (
                  <img
                    key={img}
                    src={`https://res.cloudinary.com/dpyr2wyaf/image/upload/v1687117130/${img}`}
                    alt="imagen"
                  />
                ))
              ) : (
                <img src="/img/noimage.webp" alt="No Image" />
              )}
            </Slider>

            <h2>About This Gig</h2>
            <p
              className="react-quil-editor"
              style={{
                textJustify: "inter-word",
                textAlign: "justify",
              }}
              dangerouslySetInnerHTML={{ __html: data?.desc }}
            ></p>
            <Suspense fallback={<div>Loading...</div>}>
              {isLoadingUser ? (
                "Loading User"
              ) : errorUser ? (
                "Something went wrong"
              ) : (
                <div className="seller">
                  <h2>About The Seller</h2>
                  {isLoadingUser ? (
                    "Loading User?"
                  ) : errorUser ? (
                    "Something went wrong"
                  ) : (
                    <div className="user">
                      <img
                        src={
                          `https://res.cloudinary.com/dpyr2wyaf/image/upload/v1687117130/${dataUser?.img}` ||
                          "/img/noavatar.webp"
                        }
                        alt="no imagen"
                        loading="lazy"
                      />
                      <div className="info">
                        <span>{dataUser.username}</span>
                        {!isNaN(data?.totalStars / data?.starNumber) && (
                          <div className="stars">
                            {Array(
                              Math.round(data?.totalStars / data?.starNumber)
                            )
                              .fill()
                              .map((item, i) => (
                                <img
                                  src="/img/star.webp"
                                  loading="lazy"
                                  key={i}
                                  alt="estrellas"
                                />
                              ))}
                            <span>
                              {Math.round(data?.totalStars / data?.starNumber)}
                            </span>
                          </div>
                        )}
                        <button style={{ color: "black" }}>Contact Me</button>
                      </div>
                    </div>
                  )}
                  <div className="box">
                    <div className="items">
                      <div className="item">
                        <span className="title">From</span>
                        <span className="desc">{dataUser?.country}</span>
                      </div>
                      <div className="item">
                        <span className="title">Member since</span>
                        <span className="desc">Aug 2022</span>
                      </div>
                      <div className="item">
                        <span className="title">Avg. response time</span>
                        <span className="desc">4 hours</span>
                      </div>
                      <div className="item">
                        <span className="title">Last delivery</span>
                        <span className="desc">1 day</span>
                      </div>
                      <div className="item">
                        <span className="title">Languages</span>
                        <span className="desc">English</span>
                      </div>
                    </div>
                    <hr />
                    <p>{dataUser?.desc}</p>
                  </div>
                </div>
              )}

              <Reviews gigId={id} />
            </Suspense>
            {/* {currentUserExists && <Reviews gigId={id} />} */}
          </div>
          <div className="right">
            <div className="price">
              <h3>{data?.shortTitle}</h3>
              <h2>$ {data?.price}</h2>
            </div>
            <p>{data?.shortDesc}</p>
            <div className="details">
              <div className="item">
                <img src="/img/clock.webp" alt="reloja" loading="lazy" />
                <span>{data?.deliveryTime} Days Delivery</span>
              </div>
              <div className="item">
                <img src="/img/recycle.webp" alt="recicla" loading="lazy" />
                <span>{data?.revision} Revisions</span>
              </div>
            </div>

            <div className="features">
              {data &&
                data?.features?.map((feature) => (
                  <div className="item" key={feature}>
                    <img
                      src="/img/greencheck.webp"
                      alt="check verde"
                      loading="lazy"
                    />
                    <span>{feature}</span>
                  </div>
                ))}
            </div>
            {isLoadingOrder ? (
              "Loading..."
            ) : error ? (
              "error carga Order"
            ) : dataOrder && dataOrder?.length > 0 ? (
              <>
                <div style={{ display: "flex" }}>
                  <span>
                    <img
                      src="/img/comprado.webp"
                      alt="si ya compe el gig"
                      loading="lazy"
                    />
                  </span>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      fontSize: "18pt",
                      marginLeft: "20px",
                    }}
                  >
                    Has comprado este Gig el{" "}
                    {moment(dataOrder[0].createdAt).format(
                      "DD [de] MMMM [del] YYYY"
                    )}
                  </span>
                </div>
                <p style={{ display: "inline-block" }}>
                  <button onClick={handleContinue}>Comprar Nuevamente</button>
                </p>
              </>
            ) : (
              // <Link to={`/pay/${id}`}>
              // </Link>
              <button onClick={handleContinue}>Continuar</button>
            )}
            <Suspense fallback={<div>Loading...</div>}>
              <ReactModal
                isOpen={showModal}
                onRequestClose={() => setShowModal(false)}
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
                    <h1 style={{ color: "gray", marginBottom: "20px" }}>
                      Sign in
                    </h1>
                    <label
                      htmlFor=""
                      style={{ color: "gray", marginBottom: "18px" }}
                    >
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
                    {error && <p style={{ color: "red" }}>{error}</p>}
                  </form>
                </div>
              </ReactModal>
            </Suspense>
          </div>
        </div>
      )}
    </div>
  );
}

export default Gig;
