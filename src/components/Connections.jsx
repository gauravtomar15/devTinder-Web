import React, { useEffect } from "react";
import axios from "axios";
import { BASE_URL, getProfileImageUrl } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addConnection } from "../utils/connectionSlice";
import { Link } from "react-router-dom";
import GlassPanel from "./ui/GlassPanel";

const Connections = () => {
  const connections = useSelector((store) => store.connection);
  const dispatch = useDispatch();

  const fetchConnetions = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnection(res?.data?.data));
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchConnetions();
  }, []);

  if (!connections) return null;
  if (connections.length === 0) {
    return (
      <GlassPanel className="mx-auto max-w-3xl px-6 py-12 text-center">
        <h1 className="text-2xl font-semibold text-white sm:text-3xl">No connections yet</h1>
        <p className="mt-3 text-sm text-slate-300 sm:text-base">Start exploring and build your circle of collaborators.</p>
      </GlassPanel>
    );
  }

  return (
    <div className="animate-float-in">
      <div className="mb-6 text-center sm:text-left">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Network</p>
        <h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">Your curated connections</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {connections.map((connection, index) => {
          const { _id, firstName, lastName, age, about, photoUrl } = connection;

          return (
            <GlassPanel key={index} className="p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img className="h-16 w-16 rounded-full object-cover sm:h-20 sm:w-20" src={getProfileImageUrl(photoUrl)} alt={`${firstName} ${lastName}`} />
                  <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-slate-900 bg-emerald-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="truncate text-lg font-semibold text-white">{firstName + " " + lastName}</h2>
                    {connection?.isPremium && <span className="text-cyan-300">✓</span>}
                  </div>
                  <p className="text-sm text-slate-400">{age ? `${age} yrs` : "Developer"}</p>
                </div>
              </div>

              <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-300">{about || "A thoughtful collaborator with plenty to share."}</p>

              <div className="mt-5 flex items-center justify-between">
                <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-slate-300">Online now</span>
                <Link to={"/chat/" + _id}>
                  <button className="rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 px-4 py-2 text-sm font-semibold text-white">Chat</button>
                </Link>
              </div>
            </GlassPanel>
          );
        })}
      </div>
    </div>
  );
};

export default Connections;
