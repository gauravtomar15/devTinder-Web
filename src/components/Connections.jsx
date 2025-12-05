import React, { useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addConnection } from "../utils/connectionSlice";

const Connections = () => {
  const connections = useSelector((store) => store.connection);
  const dispatch = useDispatch();

  const fetchConnetions = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      console.log(res?.data?.data);
      dispatch(addConnection(res?.data?.data));
    } catch (err) {
      console.error(err.message);
    }
  };
  useEffect(() => {
    fetchConnetions();
  }, []);

  if (!connections) return;
  if (connections.length === 0)
    return (
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center m-2 sm:m-4 p-2 sm:p-4">
        No Connection Available
      </h1>
    );
  return (
    <div className="text-center px-2 sm:px-4 md:px-6 py-4 sm:py-6">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">My Connections</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-7xl mx-auto">
        {connections.map((connection, index) => {
          const { firstName, lastName, age, about, photoUrl } = connection;
          return (
            <div
              key={index}
              className="bg-base-300 rounded-xl p-3 sm:p-4 md:p-6 flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 shadow-sm"
            >
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
          );
        })}
      </div>
    </div>
  );
};

export default Connections;
