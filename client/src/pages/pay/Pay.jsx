import React, { useEffect, useState } from "react";
import "./Pay.scss";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import newRequest from "../../utils/newRequest";
import { useParams } from "react-router-dom";
import CheckoutForm from "../../components/CheckoutForm/CheckoutForm";

// Asegúrate de llamar a loadStripe fuera del render de un componente para evitar
// recrear el objeto Stripe en cada renderización.
// Esta es tu clave API publicable de prueba.
const stripePromise = loadStripe(
  "pk_test_51MRdaGD6C283tNbsPYdfJBbW0ewMI46owUhb5P2luA9pp4LggWOQv1xxDMZH5sDcRybfTtbTDbnuZY6YAeCbwTQW002psPbY0f"
);

const Pay = () => {
  const [clientSecret, setClientSecret] = useState("");

  // obtener el ID del GIG
  const { id } = useParams();

  console.log(id, "esto es el ID del payment");

  // hacemos un llamado a la api para obtener el clientSecret
  useEffect(() => {
    const makeRequest = async () => {
      try {
        const res = await newRequest.post(
          `/api/order/create-payment-intent/${id}`
        );
        console.log(res, "esto es el rest del pago");
        setClientSecret(res.data.clientSecret);
      } catch (error) {
        console.log(error);
      }
    };

    makeRequest();
  }, []);

  const appearance = {
    theme: "stripe",
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="pay">
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )}
    </div>
  );
};

export default Pay;
