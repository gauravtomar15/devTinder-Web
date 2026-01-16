import axios from "axios";
import React from "react";
import { BASE_URL } from "../utils/constants";

const Razorpay = () => {
  
  const handleClickPayment = async (type) => {
    const order = await axios.post(
      BASE_URL + "/payment/create",
      { membershipType: type },
      { withCredentials: true }
    );
   
    const { amount, keyId, currency, notes, orderId } = order.data;

    const options = {
      key: keyId,
      amount,
      currency,
      name: "Dev Tinder",
      description: "Connect to other developers",
      order_id: orderId,
      prefill: {
        name: notes.firstName + " " + notes.lastName,
        contact: "9999999999",
      },
      theme: {
        color: "#F37254",
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();


  };
  return (
    <div className="m-10">
      <div className="flex w-full">
        <div className="card bg-base-300 rounded-box grid h-80 grow place-items-center">
          <h1 className="font-bold text-3xl">Silver Membership</h1>
          <ul>
            <li>-chat with your connections</li>
            <li>-blue tick</li>
            <li>-100 connections request send in one day</li>
            <li>-happy</li>
          </ul>
          <button
            onClick={() => handleClickPayment("silver")}
            className="btn btn-secondary"
          >
            Buy Silver
          </button>
        </div>
        <div className="divider divider-horizontal">OR</div>
        <div className="card bg-base-300 rounded-box grid h-80 grow place-items-center">
          <h1 className="font-bold text-3xl">Golden Membership</h1>
          <ul>
            <li>-chat with your connections</li>
            <li>-blue tick</li>
            <li>-infinite connections request send in one day</li>
            <li>-very happy</li>
          </ul>
          <button
            onClick={() => handleClickPayment("gold")}
            className="btn btn-primary"
          >
            Buy Golden
          </button>
        </div>
      </div>
    </div>
  );
};

export default Razorpay;
