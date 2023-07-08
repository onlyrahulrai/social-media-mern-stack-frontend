import {
  Home,
  Login,
  PageNotFound,
  Profile,
  Recovery,
  Register,
  OTPVerify,
  Reset,
  PostDetails,
  CreatePost,
  EditProfile,
  Notification,
} from "./views";
import { PrivateRoutes, PublicRoutes } from "./middleware/Auth";
import { Toaster } from "react-hot-toast";
import BaseLayout from "./layouts/BaseLayout";
import Friends from "./components/profile/Friends";
import React, { useEffect } from "react";
import { useAuthStore } from "./store/store";
import axiosInstance, { getAuthTokens } from "./api/base";
import { Routes, Route } from "react-router-dom";
import io from "socket.io-client";
import { isAuthTokenExpired } from "./helper/validate";

function App() {
  const { setState, auth,notifications } = useAuthStore((state) => state);

  const socket = io.connect("http://127.0.0.1:9000", {
    query:
      getAuthTokens()?.access && !isAuthTokenExpired(getAuthTokens()?.access)
        ? {
            token: getAuthTokens()?.access,
          }
        : null,
  });

  useEffect(() => {
    const loadUserDetails = async () => {
      await axiosInstance
        .get("/user-details/")
        .then((response) => {
          setState({ auth: response.data, socket });
        })
        .catch((error) => {
          console.log(" Error ");
        });
    };

    if (localStorage.getItem("authTokens")) {
      loadUserDetails();
    }
  }, []);

  useEffect(() => {
    socket.on("onNotificationMarkedReadResponse", ({notification:_notification,countOfNotification}) => {

      const tempNotifications = notifications.map((notification) => {
        if(notification._id === _notification?._id){
          return {...notification,read:_notification?.read}
        }
        return notification
      })

      setState({notifications:tempNotifications,auth:{...auth,countOfNotification}})
    });

    socket.on("sendPostLikedNotificationMessage", (data) => {
      console.log(" Data ",data)
      const { countOfNotification, notification } = data;

      setState({notifications:notifications.concat(notification),auth:{ ...auth, countOfNotification }});
    });

    socket.on("onFollowUserResponse",(data) => {
      console.log(" data on Follow User Response",data)

      const { countOfNotification, notification } = data;

      setState({notifications:notifications.concat(notification),auth:{ ...auth, countOfNotification }});
    })

    socket.on("onCreatePostResponse",(data) => {
      console.log(" data on create post response ",data)

      const { countOfNotification, notification } = data;

      setState({notifications:notifications.concat(notification),auth:{ ...auth, countOfNotification }});
    })
  }, [socket]);

  return (
    <React.Fragment>
      <Routes>
        <Route element={<BaseLayout sidebar hero />}>
          <Route path="/" element={<Home />} />
          <Route path="/posts/:id" element={<PostDetails />} />
        </Route>

        <Route element={<PrivateRoutes />}>
          <Route element={<BaseLayout />}>
            <Route path="notifications" element={<Notification />} />
            <Route path="/posts/create/" element={<CreatePost />} />
            <Route path="/posts/:id/update" element={<CreatePost />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/:username" element={<Profile />} />
            <Route path="/:username/friends" element={<Friends />} />
          </Route>
        </Route>

        <Route element={<PublicRoutes />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset" element={<Reset />} />
          <Route path="/verify-otp" element={<OTPVerify />} />
          <Route path="/recovery" element={<Recovery />} />
        </Route>

        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Toaster position="top-center" reverseOrder={false} />
    </React.Fragment>
  );
}

export default App;
