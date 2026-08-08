import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import UserCard from "./UserCard";
import GlassPanel from "./ui/GlassPanel";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const [showToast, setShowToast] = useState(false);
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      const res = await axios.get(BASE_URL + "/feed", {
        withCredentials: true,
      });
      dispatch(addFeed(res?.data));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  if (!feed) return null;
  if (feed.length <= 0) {
    return (
      <GlassPanel className="mx-auto max-w-3xl px-6 py-12 text-center">
        <h1 className="text-2xl font-semibold text-white sm:text-3xl">No new developers nearby right now</h1>
        <p className="mt-3 text-sm text-slate-300 sm:text-base">Check back soon for fresh matches and opportunities.</p>
      </GlassPanel>
    );
  }

  return (
    <div className="animate-float-in">
      <div className="mb-6 flex flex-col gap-2 text-center sm:text-left">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Discover</p>
        <h1 className="text-3xl font-semibold text-white sm:text-4xl">Find your next great connection</h1>
      </div>
      <UserCard user={feed[0]} />

      {showToast && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-success rounded-2xl border border-emerald-400/20 bg-emerald-500/90 text-emerald-950">
            <span>Feed refreshed successfully</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feed;
