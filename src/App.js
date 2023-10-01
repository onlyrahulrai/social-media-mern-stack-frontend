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
import useSocketContext from "./context/useSocketContext";
import { Swal, capitalizeString, getImageUrl } from "./helper/common";
import { PhoneIcon } from "@heroicons/react/24/outline";

function App() {
  const { setState } = useAuthStore((state) => state);
  const { socket } = useSocketContext();

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

  useEffect(() => {
    if (socket) {
      socket.on("onWaitForVideoCall", (data) => {
        Swal.fire({
          position: 'bottom-end',
          html: <div>
            <div>
              <img src={getImageUrl(data?.caller?.profile)} alt={data?.caller?.username} className="img-thumbnail rounded-circle object-fit-contain" width={128} height={128} />
            </div>

            <div className="mt-2">
              {capitalizeString(`${data?.caller?.firstName} ${data?.caller?.lastName}`)}
            </div>

            <div className="my-2">
              <span>Incoming Call...</span>
            </div>

            <div className="d-flex justify-content-center gap-2 mt-3">
              <div className="d-flex justify-content-center align-items-center rounded-circle cursor-pointer" style={{ width: "2.5rem", height: "2.5rem", background: "#20c997" }}>
                <PhoneIcon color="white" style={{ width: "1.5rem", height: "1.5rem" }} />
              </div>

              <div className="d-flex justify-content-center align-items-center rounded-circle cursor-pointer" style={{ width: "2.5rem", height: "2.5rem", background: "#dc3545" }} onClick={() => Promise.resolve(
                socket.emit("onRejectCallRequest", data?.caller)
              ).then(() => {
                Swal.close()
              })} >
                <PhoneIcon color="white" style={{ width: "1.5rem", height: "1.5rem", transform: "rotate(135deg)" }} />
              </div>
            </div>
          </div>,
          showConfirmButton: false,
        })
      })

      socket.on("onResponseDismissCall", () => {
        console.log(" Call Dismissed... ")
        Swal.close()
      })
    }
  }, [socket])

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
            <Route path="/notifications" element={<Notification />} />

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
      <Toaster reverseOrder={false} />
    </React.Fragment>
  );
}

export default App;
