import React, { useEffect } from "react";
import "./Success.scss";
import { useLocation, useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest";

const Success = () => {
  const { search } = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(search);
  const payment_intent = params.get("payment_intent");

  useEffect(() => {
    const makeRequest = async () => {
      try {
        await newRequest.put("/api/order", { payment_intent });
        setTimeout(() => {
          navigate("/orders");
        }, 3000);
      } catch (error) {
        console.log(error);
      }
    };

    makeRequest();
  }, []);

  return (
    <div>
      Payment Successful. You are beign redirected to the orders page. Please do
      not close the page
    </div>
  );
};

export default Success;
