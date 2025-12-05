import axios from "axios";
import React from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";

const UserCard = ({ user }) => {
   
  const dispatch = useDispatch();
  const handleFeed = async (status,_id)=>{
    try {
        const res = await axios.post(BASE_URL+ "/send"+ "/"+status+ "/"+ _id , {}, {withCredentials: true});
        dispatch(removeUserFromFeed(_id));
    } catch (err) {
      console.error(err)
      
    }
  }
  const {_id, firstName, lastName, about, age, gender, photoUrl } = user;
  

  return (
    user && (
      <div className="flex justify-center  my-10 ">
        <div className="card bg-base-200 h-110 w-auto  shadow-sm mx-8 px-8">
          <figure className=" object-cover mt-6 ">
            <img className="h-60 w-auto   rounded-2xl" src={photoUrl} alt="logo" />
          </figure>
          <div className=" my-2">
            <h2 className="card-title ">{firstName + " " + lastName}</h2>
            <p>{about}</p>
            {age && <p>{age}</p>}
            {gender && <p>{gender}</p>}
          </div>
           <div className="card-actions justify-center gap-11 mt-8 ">
              <button className="btn btn-primary" onClick={()=> handleFeed("ignored",_id)}>ignored</button>
              <button className="btn btn-secondary" onClick={()=> handleFeed("interested",_id)}>intreseted</button>
            </div>
        </div>
      </div>
    )
  );
};

export default UserCard;
