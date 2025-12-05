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
      <div className="flex justify-center my-4 sm:my-6 px-2 sm:px-4">
        <div className="card bg-base-200 w-[320px] sm:w-[360px] md:w-[400px] shadow-sm mx-2 sm:mx-4 px-3 sm:px-4 md:px-6 py-3 sm:py-4 flex flex-col">
          <figure className="mt-2 sm:mt-3 w-full h-[200px] sm:h-[240px] md:h-[280px] overflow-hidden rounded-xl flex-shrink-0">
            <img 
              className="w-full h-full object-cover rounded-xl" 
              src={photoUrl} 
              alt={`${firstName} ${lastName}`}
            />
          </figure>
          <div className="my-2 sm:my-3 flex-shrink-0">
            <h2 className="card-title text-base sm:text-lg md:text-xl mb-1 sm:mb-2">{firstName + " " + lastName}</h2>
            <div className="min-h-[40px] sm:min-h-[48px] md:min-h-[56px]">
              <p className="text-xs sm:text-sm md:text-base mb-1 sm:mb-2 line-clamp-2">{about || "No description available"}</p>
            </div>
            <div className="flex gap-3 text-xs sm:text-sm text-base-content/70">
              {age && <p>Age: {age}</p>}
              {gender && <p>Gender: {gender}</p>}
            </div>
          </div>
           <div className="card-actions justify-center gap-3 sm:gap-4 md:gap-6 mt-auto">
              <button 
                className="btn btn-primary btn-sm sm:btn-md text-xs sm:text-sm px-3 sm:px-4 min-w-[70px] sm:min-w-[80px]" 
                onClick={()=> handleFeed("ignored",_id)}
              >
                Ignored
              </button>
              <button 
                className="btn btn-secondary btn-sm sm:btn-md text-xs sm:text-sm px-3 sm:px-4 min-w-[70px] sm:min-w-[80px]" 
                onClick={()=> handleFeed("interested",_id)}
              >
                Interested
              </button>
            </div>
        </div>
      </div>
    )
  );
};

export default UserCard;
