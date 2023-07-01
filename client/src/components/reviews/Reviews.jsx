import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import newRequest from "../../utils/newRequest";
import Review from "../review/Review";
import "./Reviews.scss";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Reviews = ({ gigId }) => {
  const [desc, setDesc] = useState("");
  const [star, setStar] = useState("");
  const queryClient = useQueryClient();
  // Obtener el usuario actual
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  // Llamar a la API para obtener las reviews
  const {
    isLoading: isLoadingReviews,
    error: errorReviews,
    data: reviewsData,
    refetch: refetchReviews,
  } = useQuery({
    queryKey: ["reviews"],
    queryFn: () =>
      newRequest.get(`/api/review/${gigId}`).then((res) => {
        return res.data;
      }),
  });

  // Llamar a la API para obtener las orders y poder comprobar si el usuario ha comprado el gig para poder escribir una review
  const {
    isLoading: isLoadingOrders,
    error: errorOrders,
    data: ordersData,
    refetch: refetchOrders,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: () => {
      // Verificar si el usuario ha iniciado sesión
      if (!currentUser) {
        return Promise.resolve([]); // No hay datos de órdenes si no ha iniciado sesión
      }

      return newRequest.get(`/api/order`).then((res) => {
        return res.data;
      });
    },
  });

  console.log(ordersData, "ORDER DATA QUE HAY");

  // Esto es lo que se ejecuta cuando se pulsa el boton de enviar la review, se crea la review en la base de datos
  const createMutation = useMutation({
    mutationFn: (review) => {
      return newRequest.post("/api/review", review);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["reviews"]);
      setDesc("");
      setStar("");
    },
  });

  // Esto es lo que se ejecuta cuando se pulsa el boton de enviar la review, se actualiza la review en la base de datos
  const updateMutation = useMutation({
    mutationFn: (review) => {
      const { id, desc, star } = review;
      return newRequest.put(`/api/review/${id}`, { desc, star });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["reviews"]);
      setDesc("");
      setStar("");
    },
  });

  // esto se ejecuta cuando se actualiza el currentUser
  useEffect(() => {
    if (currentUser) {
      // Activar las consultas cuando currentUser tenga un valor
      refetchReviews();
      refetchOrders();
    }
  }, [currentUser, refetchReviews, refetchOrders]);

  // Esto sirve para que cuando se actualice la review, se ponga el texto y las estrellas que ya tenia
  const handleSubmit = async (e) => {
    e.preventDefault();
    const desc = e.target[0].value;
    const star = e.target[1].value;

    const existingReview = reviewsData.find(
      (review) =>
        review?.userId === currentUser?.user?._id && review?.gigId === gigId
    );

    if (existingReview) {
      await updateMutation.mutateAsync({ id: existingReview._id, desc, star });
      toast.success("¡Tu revisión ha sido actualizada!");
    } else {
      await createMutation.mutateAsync({ gigId, desc, star });
      toast.success("¡Tu revisión ha sido creada!");
    }
  };

  if (isLoadingReviews) {
    return <div>Loading...</div>;
  }

  if (isLoadingOrders) {
    return <div>Loading...</div>;
  }

  if (errorReviews) {
    return <div>Ocurrio un error al traer los comentarios!</div>;
  }
  if (errorOrders) {
    return <div>Ocurrio un error en las ordenes!</div>;
  }

  // Comprobar si el usuario ha comprado el gig para poder escribir una review
  if (ordersData === undefined) {
    return <div>No hay nada que mostrar</div>;
  }

  const completedOrder = ordersData.find(
    (order) =>
      order?.gigId === gigId &&
      order?.buyerId === currentUser?.user?._id &&
      order?.isCompleted
  );

  const canWriteReview = completedOrder !== undefined;

  // Si completedOrder es undefined, es que el usuario no ha comprado el gig, por lo que no puede escribir una review

  return (
    <div className="reviews">
      <h2>Reviews</h2>
      {reviewsData.length > 0 ? (
        reviewsData.map((review) => <Review key={review._id} review={review} />)
      ) : (
        <p>No se encontraron comentarios</p>
      )}

      <div className="add">
        {isLoadingOrders ? (
          "Loading..."
        ) : errorOrders ? (
          "error"
        ) : (
          <>
            {canWriteReview && (
              <>
                <h3>Add a review</h3>
                <form action="" className="addForm" onSubmit={handleSubmit}>
                  <input
                    type="text"
                    placeholder="write your opinion"
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                  />
                  <p
                    style={{
                      marginLeft: "700px",
                      color: "black",
                      fontWeight: "bold",
                    }}
                  >
                    Seleccionar Estrellas
                  </p>
                  <select
                    name=""
                    id=""
                    value={star}
                    onChange={(e) => setStar(e.target.value)}
                  >
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={5}>5</option>
                  </select>
                  <button>Send</button>
                </form>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Reviews;
