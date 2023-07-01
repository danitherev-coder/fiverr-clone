import React from "react";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import Review from "../review/Review";

const ReviewList = ({ gigId }) => {
  const {
    isLoading: isLoadingReviews,
    error: errorReviews,
    data: reviewsData,
  } = useQuery({
    queryKey: ["reviews"],
    queryFn: () =>
      newRequest.get(`/api/review/${gigId}`).then((res) => {
        return res.data;
      }),
  });

  if (isLoadingReviews) {
    return <div>Loading...</div>;
  }

  if (errorReviews) {
    return <div>Ocurrió un error al traer los comentarios!</div>;
  }

  return (
    <div className="reviews">
      <h2>Reviews</h2>
      {reviewsData.length > 0 ? (
        reviewsData.map((review) => <Review key={review._id} review={review} />)
      ) : (
        <p>No se encontraron comentarios</p>
      )}
    </div>
  );
};

export default ReviewList;
