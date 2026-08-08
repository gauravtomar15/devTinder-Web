import axios from "axios";
import React from "react";
import { BASE_URL, getProfileImageUrl } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";
import GlassPanel from "./ui/GlassPanel";

const UserCard = ({ user }) => {
  const dispatch = useDispatch();
  const handleFeed = async (status, _id) => {
    try {
      await axios.post(BASE_URL + "/send" + "/" + status + "/" + _id, {}, { withCredentials: true });
      dispatch(removeUserFromFeed(_id));
    } catch (err) {
      console.error(err);
    }
  };

  const { _id, firstName, lastName, about, age, gender, photoUrl } = user;

  return (
    user && (
      <div className="mx-auto flex w-full max-w-5xl justify-center px-2 py-4 sm:px-4 sm:py-6">
        <GlassPanel className="w-full overflow-hidden p-3 sm:p-4 md:p-6 lg:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-stretch">
            <div className="relative overflow-hidden rounded-[24px] lg:w-[45%]">
              <img
                className="h-[280px] w-full object-cover sm:h-[360px] lg:h-full"
                src={getProfileImageUrl(photoUrl)}
                alt={`${firstName} ${lastName}`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />
              <div className="absolute bottom-4 left-4 rounded-full border border-white/20 bg-slate-900/70 px-3 py-1 text-sm font-medium text-slate-100">
                {age ? `${age} yrs` : "New match"}
              </div>
            </div>

            <div className="flex flex-1 flex-col justify-between gap-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-2xl font-semibold text-white sm:text-3xl">
                      {firstName + " " + lastName}
                    </h2>
                    <p className="mt-1 text-sm text-slate-300 sm:text-base">{gender || "Developer"}</p>
                  </div>
                  <div className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-sm font-medium text-cyan-200">
                    Ready to connect
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                  <p className="text-sm leading-7 text-slate-300 sm:text-base">{about || "No description available yet, but this profile looks exciting."}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {["React", "Node.js", "UI/UX", "Open Source"].map((skill) => (
                    <span key={skill} className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-sm text-slate-200">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  className="flex-1 rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 font-semibold text-rose-200 transition hover:scale-[1.01] hover:bg-rose-500/20"
                  onClick={() => handleFeed("ignored", _id)}
                >
                  Ignore
                </button>
                <button
                  className="flex-1 rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-500 px-4 py-3 font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:scale-[1.01]"
                  onClick={() => handleFeed("interested", _id)}
                >
                  Interested
                </button>
              </div>
            </div>
          </div>
        </GlassPanel>
      </div>
    )
  );
};

export default UserCard;
