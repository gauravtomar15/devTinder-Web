import React, { useState } from "react";
import UserCard from "./UserCard";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import GlassPanel from "./ui/GlassPanel";

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user.firstName || "");
  const [lastName, setLastName] = useState(user.lastName || "");
  const [gender, setGender] = useState(user.gender || "");
  const [about, setAbout] = useState(user.about || "");
  const [age, setAge] = useState(user.age || "");
  const [photoUrl, setPhotourl] = useState(user.photoUrl || "");
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const dispatch = useDispatch();

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      setUploadError("Only JPEG, JPG, PNG, WEBP, and GIF images are allowed.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image must be smaller than 5MB.");
      return;
    }

    setUploadError("");
    setUploading(true);

    const formData = new FormData();
    formData.append("photo", file);

    try {
      const res = await axios.post(BASE_URL + "/profile/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      const updatedUser = res?.data?.data;
      setPhotourl(updatedUser.photoUrl);
      dispatch(addUser(updatedUser));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (err) {
      setUploadError(err?.response?.data?.error || "Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const saveInfo = async () => {
    setError("");
    try {
      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        { firstName, lastName, age, gender, about, photoUrl },
        { withCredentials: true }
      );
      dispatch(addUser(res?.data?.data));
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 2000);
    } catch (err) {
      setError(err?.message || "Unable to update profile.");
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <GlassPanel className="p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Profile</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">Shape your public presence</h2>
          <p className="mt-2 text-sm text-slate-300 sm:text-base">Keep your details polished while preserving the same backend flow.</p>
        </div>

        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm text-slate-300">First Name</span>
              <input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white outline-none ring-0" />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm text-slate-300">Last Name</span>
              <input value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white outline-none ring-0" />
            </label>
          </div>

          <div className="block">
            <span className="mb-2 block text-sm font-medium text-slate-300">Profile Photo</span>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <label className="flex flex-1 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/20 bg-slate-950/40 p-4 transition duration-300 hover:border-cyan-400/40 hover:bg-slate-950/60">
                <div className="flex flex-col items-center justify-center gap-1.5 text-center">
                  <svg className="h-6 w-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm font-medium text-slate-200">
                    {uploading ? "Uploading..." : "Click or drag to upload"}
                  </span>
                  <span className="text-xs text-slate-400">JPEG, PNG, WEBP, GIF (Max 5MB)</span>
                </div>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" disabled={uploading} />
              </label>
            </div>
            {uploadError && <p className="mt-2 text-xs text-rose-300">{uploadError}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm text-slate-300">Age</span>
              <input value={age} onChange={(e) => setAge(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white outline-none ring-0" />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm text-slate-300">Gender</span>
              <input value={gender} onChange={(e) => setGender(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white outline-none ring-0" />
            </label>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">About</span>
            <textarea value={about} rows="4" onChange={(e) => setAbout(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white outline-none ring-0" />
          </label>

          {error && <p className="text-sm text-rose-300">{error}</p>}

          <button className="w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-500 px-4 py-3 font-semibold text-white shadow-lg shadow-cyan-500/20" onClick={saveInfo}>
            Save profile
          </button>
        </div>
      </GlassPanel>

      <div className="flex items-start justify-center">
        <UserCard user={{ firstName, lastName, age, gender, about, photoUrl }} />
      </div>

      {showToast && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-success rounded-2xl border border-emerald-400/20 bg-emerald-500/90 text-emerald-950">
            <span>Profile updated successfully.</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfile;
