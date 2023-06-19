import { BrowserRouter, Routes, Route } from "react-router-dom";
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
} from "./views";
import { PrivateRoutes, PublicRoutes } from "./middleware/Auth";
import { Toaster } from "react-hot-toast";
import BaseLayout from "./layouts/BaseLayout";
import Friends from "./components/profile/Friends";
import useFetch from "./hooks/fetch.hook";

function App() {
  const [{loading}] = useFetch();

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PrivateRoutes />}>
          <Route element={<BaseLayout sidebar hero />}>
            <Route path="/" element={<Home />} />
            <Route path="/posts/:id" element={<PostDetails />} />
          </Route>

          <Route element={<BaseLayout />}>
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
    </BrowserRouter>
  );
}

export default App;
