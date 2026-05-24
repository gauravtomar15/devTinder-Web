import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";

const Razorpay = () => {
  const [isPremiumVerify, setIsPremiumVerify] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    verifyPremium();
  }, []);

  const verifyPremium = async () => {
    setError("");
    try {
      const res = await axios.get(BASE_URL + "/premium/verify", {
        withCredentials: true,
      });
      setIsPremiumVerify(Boolean(res?.data?.isPremium));
    } catch (e) {
      setIsPremiumVerify(false);
      setError("Unable to verify your premium status. Please try again.");
    } finally {
      setIsVerifying(false);
      setIsProcessing(false);
    }
  };

  const handleClickPayment = async (type) => {
    setError("");
    setIsProcessing(true);
    try {
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
    } catch (e) {
      setIsProcessing(false);
      setError("Payment could not be initiated. Please try again.");
    }
  };

  if (isVerifying) {
    return (
      <div className="min-h-[45vh] flex items-center justify-center p-6">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="mt-4 text-sm sm:text-base text-base-content/70">
            Checking your premium status...
          </p>
        </div>
      </div>
    );
  }

  if (isPremiumVerify) {
    return (
      <div className="min-h-[45vh] flex items-center justify-center p-6">
        <div className="max-w-xl w-full text-center">
          <div className="mb-4 mx-auto w-12 h-12 rounded-full bg-success/20 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-7 h-7 text-success"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.704 5.29a1 1 0 010 1.42l-7.071 7.072a1 1 0 01-1.414 0L3.296 8.89a1 1 0 011.414-1.414l3.098 3.097 6.364-6.363a1 1 0 011.42 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold">You are already Premium</h1>
          <p className="mt-2 text-sm sm:text-base text-base-content/70">
            Thanks for supporting Dev Tinder. Enjoy all premium features!
          </p>

          {error ? (
            <div className="mt-4 alert alert-error" role="alert">
              <span>{error}</span>
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  const FeatureList = ({ items }) => (
    <ul className="mt-4 space-y-2 text-left">
      {items.map((text) => (
        <li key={text} className="flex items-start gap-2 text-sm sm:text-base">
          <span className="mt-0.5 inline-flex w-5 h-5 items-center justify-center rounded-full bg-success/20 text-success">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3.5 h-3.5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.704 5.29a1 1 0 010 1.42l-7.071 7.072a1 1 0 01-1.414 0L3.296 8.89a1 1 0 011.414-1.414l3.098 3.097 6.364-6.363a1 1 0 011.42 0z"
                clipRule="evenodd"
              />
            </svg>
          </span>
          <span>{text}</span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="px-4 sm:px-8 lg:px-10 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
            Upgrade your profile
          </h1>
          <p className="mt-3 text-sm sm:text-base text-base-content/70 max-w-2xl mx-auto">
            Choose the membership that fits your networking goals. Unlock messaging, verified
            badge and more.
          </p>
        </div>

        {error ? (
          <div className="mb-6 alert alert-error" role="alert">
            <span>{error}</span>
          </div>
        ) : null}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* Silver Card */}
          <div className="card bg-base-300/40 border border-base-300 rounded-box p-6 sm:p-8 shadow-sm flex flex-col">
            <div className="text-center">
              <h2 className="font-bold text-xl sm:text-2xl lg:text-3xl">Silver</h2>
              <p className="mt-1 text-sm sm:text-base text-base-content/70">
                Best for focused 1-to-1 conversations.
              </p>
            </div>

            <FeatureList
              items={[
                "One-to-one messaging with your connections",
                "Verified profile badge (Blue Tick)",
                "Up to 100 connection requests per day",
                "Standard priority support",
              ]}
            />

            <button
              onClick={() => handleClickPayment("silver")}
              disabled={isProcessing}
              className="btn btn-secondary mt-7 w-full self-center disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isProcessing ? "Processing..." : "Buy Silver"}
            </button>
          </div>

          {/* Golden Card */}
          <div className="card bg-base-300/40 border border-base-300 rounded-box p-6 sm:p-8 shadow-sm flex flex-col">
            <div className="text-center">
              <h2 className="font-bold text-xl sm:text-2xl lg:text-3xl">Golden</h2>
              <p className="mt-1 text-sm sm:text-base text-base-content/70">
                For unlimited networking and visibility.
              </p>
            </div>

            <FeatureList
              items={[
                "Unlimited messaging with your connections",
                "Verified profile badge (Blue Tick)",
                "Unlimited connection requests per day",
                "High-priority support & visibility boost",
              ]}
            />

            <button
              onClick={() => handleClickPayment("gold")}
              disabled={isProcessing}
              className="btn btn-primary mt-7 w-full self-center disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isProcessing ? "Processing..." : "Buy Golden"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Razorpay;
