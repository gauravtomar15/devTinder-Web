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
      <h1 className="text-3xl font-bold text-center m-2 p-2">
        No Requests Available
      </h1>
    );
  return (
    <div className="text-center  ">
      <h1 className="text-3xl m-1 p-1 font-bold"> All Requests</h1>

      <div className=" flex-row justify-center m-2 p-2 ">
        {requests.map((request) => {
          const { _id, firstName, lastName, age, about, photoUrl } =
            request.fromUserId;
          console.log(firstName);

          return (
            <div
              key={_id}
              className="  bg-base-300 rounded-xl my-4 mx-30 flex  w-1/3 p-2 m-2  "
            >
              <div>
                <img
                  className="h-20 w-20  rounded-full"
                  src={photoUrl}
                  alt="image"
                />
              </div>
              <div className=" flex-row  font-serif mx-4 ">
                <h1 className="flex font-bold text-lg">
                  {firstName + " " + lastName}
                </h1>
                {age && <p>{age}</p>}
                <p>{about}</p>
              </div>
              <div className="p-2">
                <button
                  className="btn btn-primary m-2"
                  onClick={() => reviewRequest("rejected", request._id)}
                >
                  Reject
                </button>
                <button
                  className="btn btn-secondary"
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
