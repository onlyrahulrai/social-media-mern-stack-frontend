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
  Chat,
} from "./views";
import { PrivateRoutes, PublicRoutes } from "./middleware/Auth";
import { Toaster } from "react-hot-toast";
import BaseLayout from "./layouts/BaseLayout";
import Friends from "./components/profile/Friends";
import React, { useEffect } from "react";
import { useAuthStore } from "./store/store";
import axiosInstance from "./api/base";
import { Routes, Route } from "react-router-dom";
import { ChatProvider } from "./context/useChatContext";

function App() {
  const { setState } = useAuthStore((state) => state);

  useEffect(() => {
    const loadUserDetails = async () => {
      await axiosInstance
        .get("/user-details/")
        .then((response) => {
          setState({ auth: response.data });
        })
        .catch((error) => {
          console.log(" Error ");
        });
    };

    if (localStorage.getItem("authTokens")) {
      loadUserDetails();
    }
  }, []);

  return (
    <React.Fragment>
      <Routes>
        <Route element={<BaseLayout sidebar slider />}>
          <Route path="/" element={<Home />} />
        </Route>

        <Route element={<BaseLayout sidebar />}>
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
          <Route element={<BaseLayout full />}>
            <Route
              path="chat"
              element={
                <ChatProvider>
                  <Chat />
                </ChatProvider>
              }
            />
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
