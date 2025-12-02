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
        dispatch(removeUserFromFeed(res.data.data));
    } catch (err) {
      console.error(err)
      
    }
  }
  const {_id, firstName, lastName, about, age, gender, photoUrl } = user;
  

  return (
    user && (
      <div className="flex justify-center m-4 ">
        <div className="card bg-base-200 w-96 shadow-sm ">
          <figure>
            <img className="h-50 w-50" src={photoUrl} alt="logo" />
          </figure>
          <div className="card-body">
            <h2 className="card-title">{firstName + " " + lastName}</h2>
            <p>{about}</p>
            {age && <p>{age}</p>}
            {gender && <p>{gender}</p>}

            <div className="card-actions justify-center gap-20 m-4 ">
              <button className="btn btn-primary" onClick={()=> handleFeed("ignored",_id)}>ignored</button>
              <button className="btn btn-secondary" onClick={()=> handleFeed("interested",_id)}>intreseted</button>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default UserCard;
