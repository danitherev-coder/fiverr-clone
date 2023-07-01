import React, { useRef, useEffect } from "react";
import "./Message.scss";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";

const Message = () => {
  const { id } = useParams();
  const messagesContainerRef = useRef(null); // Referencia al contenedor de mensajes

  const queryClient = useQueryClient();
  // Consulta para obtener los mensajes
  const {
    isLoading,
    error,
    data: messagesData,
  } = useQuery({
    queryKey: ["messages"],
    queryFn: () => newRequest.get(`/api/message/${id}`).then((res) => res.data),
    // queryFn: () => newRequest.get(`message/${id}`).then((res) => res.data),
  });

  // Obtener el usuario actual del local storage
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  // Obtener el ID del otro usuario en la conversación, para ello lo buscamos en los mensajes, data: messagesData, ahi es donde tenemos el userId
  const otherUserId = messagesData?.find(
    (m) => m.userId !== currentUser?.user?._id
  )?.userId;

  // Consulta para obtener los datos del otro usuario
  const { data: otherUserData } = useQuery(
    ["user", otherUserId],
    () => newRequest.get(`/api/user/${otherUserId}`).then((res) => res.data),
    // () => newRequest.get(`user/${otherUserId}`).then((res) => res.data),
    { enabled: !!otherUserId }
  );

  console.log(otherUserData, "esta es la data del otro usuario");

  const mutation = useMutation({
    mutationFn: (message) => {
      return newRequest.post(`/api/message`, message);
      // return newRequest.post(`message`, message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["messages"]);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({
      conversationId: id,
      desc: e.target[0].value,
    });
    e.target[0].value = "";
  };

  useEffect(() => {
    // Desplazarse hacia abajo cuando se actualiza la lista de mensajes
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messagesData]);

  console.log(otherUserData, "esta es la data del otro usuario");
  console.log(currentUser, "este es el usuario actual");

  return (
    <div className="message">
      <div className="container">
        <span className="breadcrumbs">
          <Link to="/messages">MESSAGES</Link> &gt; {otherUserData?.username}{" "}
          &gt;
        </span>
        {isLoading ? (
          "Loading"
        ) : error ? (
          "Error"
        ) : (
          <div className="messages" ref={messagesContainerRef}>
            {messagesData.map((m) => (
              <div
                className={
                  m.userId === currentUser?.user?._id ? "owner item" : "item"
                }
                key={m._id}
              >
                <img
                  src={
                    m.userId === currentUser?.user?._id
                      ? currentUser?.user?.img &&
                        (currentUser.user.img.includes("googleusercontent")
                          ? currentUser.user.img
                          : `https://res.cloudinary.com/dpyr2wyaf/image/upload/v1687117130/${currentUser.user.img}`)
                      : otherUserData?.img &&
                        (otherUserData.img.includes("googleusercontent")
                          ? otherUserData.img
                          : `https://res.cloudinary.com/dpyr2wyaf/image/upload/v1687117130/${otherUserData.img}`)
                  }
                  alt=""
                />

                <p>{m.desc}</p>
              </div>
            ))}
          </div>
        )}
        <hr />
        <form className="write" onSubmit={handleSubmit}>
          <textarea
            name=""
            placeholder="Write a message"
            id=""
            cols="30"
            rows="10"
          ></textarea>
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default Message;
