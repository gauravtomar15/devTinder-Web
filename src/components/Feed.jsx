import React, { useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import UserCard from "./UserCard";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  console.log(feed);
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      const res = await axios.get(BASE_URL + "/feed", {
        withCredentials: true,
      });
      dispatch(addFeed(res?.data));
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    getData();
  }, []);
  if (!feed) return;
  if(feed.length <=0) return <h1 className="text-3xl m-1 p-1 font-bold text-center"> No New User Found !!</h1>
  return (
    feed && (
      <div>
        
          <UserCard user={feed[0]} />
       
      </div>
    )
  );
};

export default Feed;
