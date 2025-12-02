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
      <h1 className="text-3xl font-bold text-center m-2 p-2">
        No Connection Available
      </h1>
    );
  return (
    <div className="text-center  ">
      <h1 className="text-3xl">My Connections</h1>
      <div className=" flex-row justify-center ">
        {connections.map((connection, index) => {
          const { firstName, lastName, age, about, photoUrl } = connection;
          return (
            <div
              key={index}
              className="  bg-base-300 rounded-xl my-4 mx-30 flex  w-1/3  "
            >
              <div>
                <img
                  className="h-20 w-20  rounded-full m-1 p-1"
                  src={photoUrl}
                  alt="image"
                />
              </div>
              <div className=" flex-row  font-serif mx-4 p-2">
                <h1 className="flex font-bold text-lg">
                  {firstName + " " + lastName}
                </h1>
                {age && <p>{age}</p>}
                <p>{about}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Connections;
