import React, { useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequest } from "../utils/requests";

const Requests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((store) => store.request);

  const reviewRequest = async (status, _id) => {
    try {
      const res = await axios.post(
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

  if (!requests) return;
  if (requests.length === 0)
    return (
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center m-2 sm:m-4 p-2 sm:p-4">
        No Requests Available
      </h1>
    );
  return (
    <div className="text-center px-2 sm:px-4 md:px-6 py-4 sm:py-6">
      <h1 className="text-2xl sm:text-3xl md:text-4xl m-2 sm:m-4 p-2 sm:p-4 font-bold"> All Requests</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-7xl mx-auto">
        {requests.map((request) => {
          const { _id, firstName, lastName, age, about, photoUrl } =
            request.fromUserId;
          console.log(firstName);

          return (
            <div
              key={_id}
              className="bg-base-300 rounded-xl p-3 sm:p-4 md:p-6 flex flex-col items-center sm:items-start gap-3 sm:gap-4 shadow-sm"
            >
              <div className="flex items-center sm:items-start gap-3 sm:gap-4 w-full">
                <div className="flex-shrink-0">
                  <img
                    className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 rounded-full object-cover"
                    src={photoUrl}
                    alt={`${firstName} ${lastName}`}
                  />
                </div>
                <div className="flex-1 text-center sm:text-left font-serif">
                  <h1 className="font-bold text-base sm:text-lg md:text-xl mb-1 sm:mb-2">
                    {firstName + " " + lastName}
                  </h1>
                  {age && <p className="text-xs sm:text-sm md:text-base text-base-content/70 mb-1">Age: {age}</p>}
                  <p className="text-xs sm:text-sm md:text-base">{about}</p>
                </div>
              </div>
              <div className="flex gap-2 sm:gap-3 w-full sm:w-auto justify-center sm:justify-end mt-2 sm:mt-0">
                <button
                  className="btn btn-primary text-xs sm:text-sm md:text-base px-3 sm:px-4 md:px-6 flex-1 sm:flex-initial"
                  onClick={() => reviewRequest("rejected", request._id)}
                >
                  Reject
                </button>
                <button
                  className="btn btn-secondary text-xs sm:text-sm md:text-base px-3 sm:px-4 md:px-6 flex-1 sm:flex-initial"
                  onClick={() => reviewRequest("accepted", request._id)}
                >
                  Accept
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Requests;
