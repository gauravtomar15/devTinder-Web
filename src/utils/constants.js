export const BASE_URL = location.hostname === "localhost" ? "http://localhost:7777" : "/api";

export const getProfileImageUrl = (photoUrl) => {
  if (!photoUrl) return "https://geographyandyou.com/images/user-profile.png";
  if (photoUrl.startsWith("http://") || photoUrl.startsWith("https://")) {
    return photoUrl;
  }
  const cleanPath = photoUrl.startsWith("/") ? photoUrl : `/${photoUrl}`;
  return `${BASE_URL}${cleanPath}`;
};