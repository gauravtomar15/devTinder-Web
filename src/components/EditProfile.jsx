import React, { useState } from "react";
import UserCard from "./UserCard";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user.firstName || "");
  const [lastName, setLastName] = useState(user.lastName || "");
  const [gender, setGender] = useState(user.gender || "");
  const [about, setAbout] = useState(user.about || "");
  const [age, setAge] = useState(user.age || "");
  const [photoUrl, setPhotourl] = useState(user.photoUrl || "");
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const dispatch = useDispatch();

  const saveInfo = async () => {
    setError("");
    try {
      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        { firstName, lastName, age, gender, about, photoUrl },
        { withCredentials: true }
      );
      console.log(res)

      dispatch(addUser(res?.data?.data));
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 2000);
    } catch (err) {
      console.log(err.message+"yes");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 md:gap-8 mx-2 sm:mx-4 md:mx-6 lg:mx-10 my-4 sm:my-6 md:my-8 lg:my-10">
      <div className="flex justify-center my-4 sm:my-6 md:my-8 lg:my-10 w-full lg:w-auto">
        <div className="flex justify-center mx-2 sm:mx-4 md:mx-6 lg:mx-10 w-full">
          <div className="card bg-base-300 w-full max-w-sm sm:max-w-md md:w-96 shadow-xl">
            <div className="card-body px-4 sm:px-6">
              <h2 className="card-title justify-center text-lg sm:text-xl md:text-2xl">Edit Profile</h2>
              <div>
                <label className="form-control w-full my-2">
                  <div className="label">
                    <span className="label-text text-sm sm:text-base">First Name:</span>
                  </div>
                  <input
                    type="text"
                    value={firstName}
                    className="input input-bordered w-full text-sm sm:text-base"
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </label>
                <label className="form-control w-full my-2">
                  <div className="label">
                    <span className="label-text text-sm sm:text-base">Last Name:</span>
                  </div>
                  <input
                    type="text"
                    value={lastName}
                    className="input input-bordered w-full text-sm sm:text-base"
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </label>
                <label className="form-control w-full my-2">
                  <div className="label">
                    <span className="label-text text-sm sm:text-base">Photo URL:</span>
                  </div>
                  <input
                    type="text"
                    value={photoUrl}
                    className="input input-bordered w-full text-sm sm:text-base"
                    onChange={(e) => setPhotourl(e.target.value)}
                  /> 
                </label>
                <label className="form-control w-full my-2">
                  <div className="label">
                    <span className="label-text text-sm sm:text-base">Age:</span>
                  </div>
                  <input
                    type="text"
                    value={age}
                    className="input input-bordered w-full text-sm sm:text-base"
                    onChange={(e) => setAge(e.target.value)}
                  />
                </label>
                <label className="form-control w-full my-2">
                  <div className="label">
                    <span className="label-text text-sm sm:text-base">Gender:</span>
                  </div>
                  <input
                    type="text"
                    value={gender}
                    className="input input-bordered w-full text-sm sm:text-base"
                    onChange={(e) => setGender(e.target.value)}
                  />
                </label>
                <label className="form-control w-full my-2">
                  <div className="label">
                    <span className="label-text text-sm sm:text-base">About:</span>
                  </div>
                  <input
                    type="text"
                    value={about}
                    className="input input-bordered w-full text-sm sm:text-base"
                    onChange={(e) => setAbout(e.target.value)}
                  />
                </label>
              </div>
              <p className="text-red-500 text-xs sm:text-sm">{error}</p>
              <div className="card-actions justify-center m-2">
                <button className="btn btn-primary w-full sm:w-auto text-sm sm:text-base" onClick={saveInfo}>
                  Save Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full lg:w-auto flex justify-center">
        <UserCard user={{ firstName, lastName, age, gender, about , photoUrl }} />
      </div>

      {showToast && (
        <div className="toast toast-top toast-center ">
          <div className="alert alert-success">
            <span>Profile Updated successfully.</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfile;
