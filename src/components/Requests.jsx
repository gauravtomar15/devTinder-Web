import React, { useEffect } from "react";
import axios from "axios";
import { BASE_URL, getProfileImageUrl } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequest } from "../utils/requests";
import GlassPanel from "./ui/GlassPanel";

const Requests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((store) => store.request);

  const reviewRequest = async (status, _id) => {
    try {
      await axios.post(
        BASE_URL + "/request" + "/" + status + "/" + _id,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequest(_id));
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRequests = async () => {
    const res = await axios.get(BASE_URL + "/user/request/received", {
      withCredentials: true,
    });
    dispatch(addRequests(res.data.data));
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (!requests) return null;
  if (requests.length === 0) {
    return (
      <GlassPanel className="mx-auto max-w-3xl px-6 py-12 text-center">
        <h1 className="text-2xl font-semibold text-white sm:text-3xl">No requests right now</h1>
        <p className="mt-3 text-sm text-slate-300 sm:text-base">Your inbox is calm and clear.</p>
      </GlassPanel>
    );
  }

  return (
    <div className="animate-float-in">
      <div className="mb-6 text-center sm:text-left">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Requests</p>
        <h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">Incoming invites</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {requests.map((request) => {
          const { _id, firstName, lastName, age, about, photoUrl } = request.fromUserId;

          return (
            <GlassPanel key={_id} className="p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <img className="h-16 w-16 rounded-full object-cover sm:h-20 sm:w-20" src={getProfileImageUrl(photoUrl)} alt={`${firstName} ${lastName}`} />
                <div>
                  <h2 className="text-lg font-semibold text-white">{firstName + " " + lastName}</h2>
                  <p className="text-sm text-slate-400">{age ? `${age} yrs` : "Developer"}</p>
                </div>
              </div>
              <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-300">{about || "Would love to connect and collaborate."}</p>
              <div className="mt-5 flex gap-2">
                <button className="flex-1 rounded-2xl border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-sm font-semibold text-rose-200" onClick={() => reviewRequest("rejected", request._id)}>
                  Reject
                </button>
                <button className="flex-1 rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-500 px-3 py-2 text-sm font-semibold text-white" onClick={() => reviewRequest("accepted", request._id)}>
                  Accept
                </button>
              </div>
            </GlassPanel>
          );
        })}
      </div>
    </div>
  );
};

export default Requests;
