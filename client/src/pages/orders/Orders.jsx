import React from "react";
import "./Orders.scss";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { Link, useNavigate } from "react-router-dom";

const Orders = () => {
  //===================================================================
  //             PRUEBA CON DATOS DE USUARIO PARA LAS ORDENES DE COMPRA
  //===================================================================
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const { isLoading, error, data } = useQuery({
    queryKey: ["orders"],
    queryFn: () =>
      newRequest.get(`/api/order`).then((res) => {
        return res.data;
      }),
    // queryFn: () =>
    //   newRequest.get(`order`).then((res) => {
    //     return res.data;
    //   }),
  });

  console.log(data, " este es el data de las ordenes de compra");

  const navigate = useNavigate();

  const handleContact = async (order) => {
    const sellerId = order.sellerId;
    const buyerId = order.buyerId;
    const id = sellerId + buyerId;

    try {
      const res = await newRequest.get(`/api/conversation/single/${id}`);
      // const res = await newRequest.get(`conversation/single/${id}`);
      navigate(`/message/${res.data.id}`);
    } catch (error) {
      if (error.response.status === 404) {
        const res = await newRequest.post(`/api/conversation`, {
          to: currentUser.user.isSeller ? buyerId : sellerId,
        });
        // const res = await newRequest.post(`conversation`, {
        //   to: currentUser.user.isSeller ? buyerId : sellerId,
        // });

        navigate(`/message/${res.data.id}`);
      }
    }
  };

  return (
    <div className="orders">
      {isLoading ? (
        "Loading"
      ) : error ? (
        "error"
      ) : (
        <div className="container">
          <div className="title">
            <h1>Orders</h1>
          </div>
          <table>
            <tbody>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Price</th>
                <th>Contact</th>
              </tr>
              {data.map((order) => (
                <tr key={order._id}>
                  <td>
                    <Link to={`/gig/${order.gigId}`}>
                      <img
                        className="image"
                        // src={order.img}
                        src={`https://res.cloudinary.com/dpyr2wyaf/image/upload/v1687117130/${order.img}`}
                        alt="imagen order"
                        loading="lazy"
                      />
                    </Link>
                  </td>
                  <td>{order.title}</td>
                  <td>{order.price}</td>
                  <td>
                    <img
                      className="delete"
                      src="/img/message.webp"
                      alt="messages"
                      loading="lazy"
                      onClick={() => handleContact(order)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;
