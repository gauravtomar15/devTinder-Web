import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import GlassPanel from "./ui/GlassPanel";

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
          color: "#06b6d4",
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
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-cyan-400"></div>
          <p className="mt-4 text-sm sm:text-base text-slate-400">
            Checking your premium status...
          </p>
        </div>
      </div>
    );
  }

  if (isPremiumVerify) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6 animate-float-in">
        <GlassPanel className="max-w-md w-full text-center p-6 sm:p-8 hover:translate-y-0" hover={false}>
          <div className="mb-4 mx-auto w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 text-emerald-400"
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
          <h1 className="text-2xl font-bold text-white">Premium Status Active</h1>
          <p className="mt-2 text-sm text-slate-300">
            Thanks for supporting DevTinder. You have unlocked unlimited matchmaking and verified messaging features!
          </p>

          {error ? (
            <div className="mt-4 alert alert-error py-2 px-4 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-300 text-xs" role="alert">
              <span>{error}</span>
            </div>
          ) : null}
        </GlassPanel>
      </div>
    );
  }

  const FeatureList = ({ items }) => (
    <ul className="mt-6 space-y-3 text-left">
      {items.map((text) => (
        <li key={text} className="flex items-start gap-2.5 text-sm text-slate-300">
          <span className="mt-0.5 inline-flex w-5 h-5 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex-shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3 h-3"
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
    <div className="px-4 py-8 animate-float-in">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Membership</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mt-2">
            Elevate your networking
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
            Choose the membership that fits your networking goals. Unlock direct messaging, premium verified badges, and priority matching.
          </p>
        </div>

        {error ? (
          <div className="mb-6 alert alert-error py-3 px-4 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-300 text-sm" role="alert">
            <span>{error}</span>
          </div>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch max-w-4xl mx-auto">
          {/* Silver Card */}
          <GlassPanel className="p-6 sm:p-8 flex flex-col justify-between border-white/10 hover:border-slate-400/20" hover={true}>
            <div>
              <div className="text-center border-b border-white/5 pb-5">
                <span className="text-xs uppercase tracking-widest font-semibold text-slate-400 px-3 py-1 rounded-full border border-white/10 bg-white/5">Silver Plan</span>
                <h2 className="font-bold text-3xl text-white mt-4">Silver</h2>
                <p className="mt-2 text-sm text-slate-400">
                  Best for focused 1-to-1 connections.
                </p>
              </div>

              <FeatureList
                items={[
                  "One-to-one messaging with connections",
                  "Verified profile badge (Blue Tick)",
                  "Up to 100 connection requests per day",
                  "Standard priority support",
                ]}
              />
            </div>

            <button
              onClick={() => handleClickPayment("silver")}
              disabled={isProcessing}
              className="mt-8 w-full rounded-2xl border border-slate-700 bg-slate-800/80 px-4 py-3 font-semibold text-slate-200 transition duration-300 hover:bg-slate-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? "Processing..." : "Buy Silver"}
            </button>
          </GlassPanel>

          {/* Golden Card */}
          <GlassPanel className="relative p-6 sm:p-8 flex flex-col justify-between border-amber-500/20 bg-gradient-to-b from-amber-500/5 to-transparent hover:border-amber-400/40 shadow-[0_20px_60px_rgba(245,158,11,0.05)]" hover={true}>
            <div className="absolute top-0 right-6 -translate-y-1/2 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 px-3.5 py-1 text-xs font-bold text-slate-950 shadow-md">
              POPULAR
            </div>
            
            <div>
              <div className="text-center border-b border-amber-500/10 pb-5">
                <span className="text-xs uppercase tracking-widest font-bold text-amber-300 px-3 py-1 rounded-full border border-amber-500/20 bg-amber-500/10">Gold Plan</span>
                <h2 className="font-bold text-3xl text-amber-300 mt-4">Golden</h2>
                <p className="mt-2 text-sm text-slate-400">
                  For unlimited network expansions.
                </p>
              </div>

              <FeatureList
                items={[
                  "Unlimited messaging with connections",
                  "Verified profile badge (Blue Tick)",
                  "Unlimited connection requests per day",
                  "High-priority profile visibility boost",
                ]}
              />
            </div>

            <button
              onClick={() => handleClickPayment("gold")}
              disabled={isProcessing}
              className="mt-8 w-full rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 px-4 py-3.5 font-bold text-slate-950 shadow-lg shadow-amber-500/10 transition duration-300 hover:brightness-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? "Processing..." : "Buy Golden"}
            </button>
          </GlassPanel>
        </div>
      </div>
    </div>
  );
};

export default Razorpay;
