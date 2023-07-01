import React from "react";
import "./Wishlist.scss";
import GigCard from "../../components/gigCard/GigCard";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";

const Wishlist = () => {
  // Consulta para obtener los mensajes
  const { isLoading, error, data } = useQuery({
    queryKey: ["wishlists"],
    queryFn: () => newRequest.get("/api/user/wishlist").then((res) => res.data),
  });

  return (
    <div className="wishlist">
      <div className="container">
        <h1>Favoritos</h1>
        <div className="cards">
          {isLoading
            ? "loading"
            : error
            ? "Something went wrong"
            : data && data.length > 0
            ? data.map((gig) => <GigCard key={gig?._id} item={gig} />)
            : "No has agregado nada a tu lista"}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
