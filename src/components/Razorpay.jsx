import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";

const Razorpay = () => {
  const [isPremiumVerify, setIsPremiumVerify] = useState(false);

  useEffect(() => {
    verifyPremium();
  }, []);
  const verifyPremium = async () => {
    const res = await axios.get(BASE_URL + "/premium/verify", {
      withCredentials: true,
    });
    if (res.data.isPremium) {
      setIsPremiumVerify(true);
    }
  };

  const handleClickPayment = async (type) => {
    const order = await axios.post(
      BASE_URL + "/payment/create",
      { membershipType: type },
      { withCredentials: true },
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
      },
      handler: verifyPremium,
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };
  return isPremiumVerify? ( "you are already premium user") : (
    <div className="m-4 sm:m-8 lg:m-10">
  <div className="flex flex-col lg:flex-row w-full gap-6">
    
    {/* Silver Card */}
    <div className="card bg-base-300 rounded-box flex flex-col justify-between p-6 sm:p-8 h-auto lg:h-80">
      <div className="space-y-4 text-center">
        <h1 className="font-bold text-xl sm:text-2xl lg:text-3xl">
          Silver Membership
        </h1>

        <ul className="text-sm sm:text-base text-left list-disc list-inside space-y-1">
          <li>One-to-one messaging with your connections</li>
          <li>Verified profile badge (Blue Tick)</li>
          <li>Up to 100 connection requests per day</li>
          <li>Standard priority support</li>
        </ul>
      </div>

      <button
        onClick={() => handleClickPayment("silver")}
        className="btn btn-secondary mt-6 w-full sm:w-auto self-center"
      >
        Buy Silver
      </button>
    </div>

    {/* Divider */}
    <div className="hidden lg:flex divider divider-horizontal">OR</div>

    {/* Golden Card */}
    <div className="card bg-base-300 rounded-box flex flex-col justify-between p-6 sm:p-8 h-auto lg:h-80">
      <div className="space-y-4 text-center">
        <h1 className="font-bold text-xl sm:text-2xl lg:text-3xl">
          Golden Membership
        </h1>

        <ul className="text-sm sm:text-base text-left list-disc list-inside space-y-1">
          <li>Unlimited messaging with your connections</li>
          <li>Verified profile badge (Blue Tick)</li>
          <li>Unlimited connection requests per day</li>
          <li>High-priority support & visibility boost</li>
        </ul>
      </div>

      <button
        onClick={() => handleClickPayment("gold")}
        className="btn btn-primary mt-6 w-full sm:w-auto self-center"
      >
        Buy Golden
      </button>
    </div>

  </div>
</div>

  );
};

export default Razorpay;
