import React from "react";

const UserCard = ({ user }) => {
  const { firstName, lastName, about, age, gender, photoUrl } = user;
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
              <button className="btn btn-primary">ignored</button>
              <button className="btn btn-secondary">intreseted</button>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default UserCard;
