import io from "socket.io-client";
import { BASE_URL } from "./constants";

export const createSocketConnection = () => {
  if (location.hostname === "localhost") {
    return io(BASE_URL);
  } else {
    return io("https://gauravdevsocial.site", {
      path: "/api/socket.io",
      withCredentials: true,
    });
  }
};
