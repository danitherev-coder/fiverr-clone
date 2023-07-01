import { useQuery } from "@tanstack/react-query";
import React from "react";
import newRequest from "../../utils/newRequest";
import "./Review.scss";
import moment from "moment";
import "moment/locale/es"; // Importa el idioma español para Moment.js

const Review = ({ review }) => {
  // moment.locale("es");
  moment.updateLocale("es", {
    relativeTime: {
      past: "hace %s",
      s: "unos segundos",
      m: "un minuto",
      mm: "%d minutos",
      h: "una hora",
      hh: "%d horas",
      d: "un día",
      dd: "%d días",
      M: "un mes",
      MM: "%d meses",
      y: "un año",
      yy: "%d años",
    },
  });
  const { isLoading, error, data } = useQuery({
    queryKey: [review?.userId],
    queryFn: () =>
      newRequest.get(`/api/user/${review?.userId}`).then((res) => {
        return res.data;
      }),
  });
  // const { isLoading, error, data } = useQuery({
  //   queryKey: [review.userId],
  //   queryFn: () =>
  //     newRequest.get(`/user/${review.userId}`).then((res) => {
  //       return res.data;
  //     }),
  // });

  const isCommentEdited = review.createdAt !== review.updatedAt;

  console.log(data, "aca esta el que hizo un comentario");

  // si en el data viene google es true, entonces mostrar la foto de google, pero si viene google false, entonces mostrar la foto de cloudinary, pero si no hay ninguna foto, mostrar noavatar
  let img = "/img/noavatar.webp";
  // if (data?.google === false) {
  //   img = `https://res.cloudinary.com/dpyr2wyaf/image/upload/v1687117130/${data.img}`;
  // } else if (data?.google === true) {
  //   img = data?.img;
  // } else {
  //   img = "/img/noavatar.webp";
  // }
  if (data && data?.google) {
    if (data?.img.includes("googleusercontent")) {
      // Si la URL contiene "googleusercontent", se asume que es la imagen de Google
      img = data?.img;
    } else {
      img = `https://res.cloudinary.com/dpyr2wyaf/image/upload/v1687117130/${data?.img}`;
    }
  } else {
    // Usuario no autenticado con Google, se asume que la imagen está en Cloudinary
    img = `https://res.cloudinary.com/dpyr2wyaf/image/upload/v1687117130/${data?.img}`;
  }

  return (
    <div className="review">
      {isLoading ? (
        "loading"
      ) : error ? (
        "error"
      ) : (
        <div className="user">
          {/* <img className="pp" src={data?.img || "/img/noavatar.webp"} alt="" /> */}
          <img className="pp" src={img} alt="" />
          <div className="info">
            <span>{data?.username}</span>
            <div className="country">
              <span>{data?.country}</span>
            </div>
          </div>
        </div>
      )}
      <div className="stars">
        {Array(review?.star)
          .fill()
          .map((item, i) => (
            <img src="/img/star.webp" alt="" key={i} />
          ))}
        <span style={{ color: "bold", fontSize: "12pt" }}>{review?.star}</span>{" "}
        <span style={{ color: "gray" }}>|</span>
        <span style={{ color: "gray" }}>
          {moment(review?.updatedAt).fromNow()}
        </span>
        {isCommentEdited && (
          <div style={{ marginTop: "-0.9px" }}>
            <span style={{ color: "gray" }}>|</span>
            <span
              style={{
                color: "green",
                marginLeft: "5px",
              }}
            >
              Comentario editado
            </span>
          </div>
        )}
      </div>
      <p>{review?.desc}</p>

      <div className="helpful">
        <span>Helpful?</span>
        <img src="/img/like.webp" alt="" />
        <span>Yes</span>
        <img src="/img/dislike.webp" alt="" />
        <span>No</span>
      </div>
      <hr style={{ margin: "5px 0px" }} />
    </div>
  );
};

export default Review;
