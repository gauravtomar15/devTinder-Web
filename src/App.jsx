import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Body from "../src/components/Body";
import Login from "./components/Login";
import Profile from "./components/Profile";
import { Provider } from "react-redux";
import appStore from "./utils/appStore"
import Feed from "./components/Feed";
import Connections from "./components/Connections";
import Requests from "./components/Requests";
import Razorpay from "./components/Razorpay";
import Chat from "./components/Chat";

function App() {
  return (
    <>
        <Provider store={appStore}>
        <BrowserRouter basename="/">
          <Routes>
              <Route path="/" element={<Body />}>
              <Route path="/" element={<Feed/>}></Route>
              <Route path="/login" element={<Login />} />
              <Route path="/connections" element={<Connections />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/requests" element={<Requests/>}/>
              <Route path="/payment/create" element={<Razorpay/>}/>
              <Route path="/chat/:targetUserId" element={<Chat/>} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  );
}

export default App;
