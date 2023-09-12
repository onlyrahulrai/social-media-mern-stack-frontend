import React, { useEffect, useState } from "react";
import { useAuthStore, useLayoutStore } from "../store/store";
import Avatar from "../assets/profile.png";
import { capitalizeString, getImageUrl } from "../helper/common";
import { Button, Nav, NavItem, TabContent, TabPane } from "reactstrap";
import { TableCellsIcon, BookmarkIcon } from "@heroicons/react/24/outline";
import {
  createSearchParams,
  useNavigate,
  useParams,
} from "react-router-dom";
import { UserProfilePosts, UserProfileSavedPosts } from "../components";
import { getUser } from "../helper/helper";
import { toast } from "react-hot-toast";
import Spinner from "../components/Spinner";
import axiosInstance from "../api/base";
import useSocketContext from "../context/useSocketContext";

const Profile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState(1);
  const [user, setUser] = useState({});
  const { auth, socket } = useAuthStore((state) => state);
  const { loading, setLoading } = useLayoutStore((state) => state);
  const {onFollowUserRequest} = useSocketContext();


  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        setUser(await getUser({ username }));
        setLoading(false);
      } catch (error) {
        toast.error(error);
      }
    };
    fetchUser();
  }, []);

  const onFollow = async (user, id) => {
    try {
      const followPromise = axiosInstance.put(
        `${user?.followers?.includes(id) ? "/unfollow-user" : "/follow-user"}`,
        {
          followUserId: user?.id,
        }
      );

      toast.promise(followPromise, {
        loading: "Checking User...",
        success: `You have  ${
          user?.followers?.includes(id) ? "stopped" : "started"
        } following ${user?.username}.`,
        error: "Couldn't follow the user.",
      });

      followPromise.then(({ data }) => {
        Promise.resolve(
          setUser((state) => ({ ...state, followers: data.followers }))
        ).then(() => {
          if (!user?.followers?.includes(id)) {

            console.log(" Data ",data)

            onFollowUserRequest({
              user: user?.id,
              follow: !user?.followers?.includes(id) ? true : false,
            });
          }
        });
      });
    } catch (error) {
      return toast.error("Couldn't follow the user.");
    }
  };

  if (loading) return <Spinner style={{ minHeight: "68vh" }} />;

  return (
    <React.Fragment>
      <div className="row justify-content-center align-items-center my-5">
        <div className="col-md-3">
          <img
            src={user?.profile ? getImageUrl(user?.profile) : Avatar}
            alt=""
            width={198}
            height={198}
            className="object-fit-contain rounded-full cursor-pointer"
          />
        </div>
        <div className="col-md-7 px-5">
          <div className="d-flex flex-row align-items-center">
            <span className="fs-3">
              {capitalizeString(user?.username || "")}
            </span>

            {auth?.id === user?.id ? (
              <Button
                color="primary"
                type="button"
                onClick={() => navigate("/edit-profile/")}
                className="mx-5"
              >
                Edit Profile
              </Button>
            ) : (
              <>
                <Button
                  color="primary"
                  type="button"
                  onClick={() => onFollow(user, auth?.id)}
                  className="mx-5"
                >
                  {user?.followers?.includes(auth?.id) ? "Unfollow" : "Follow"}
                </Button>
              </>
            )}
          </div>

          <div className="my-3">
            <span className="fs-5">{user?.posts?.length} Posts</span>
            <span
              className="fs-5 mx-3 cursor-pointer"
              onClick={() =>
                user?.following?.length
                  ? navigate({
                      pathname: `/${user?.username}/friends/`,
                      search: createSearchParams({ tab: 1 }).toString(),
                    })
                  : void 0
              }
            >
              {" "}
              {user?.following?.length} following{" "}
            </span>
            <span
              className="fs-5 mx-3 cursor-pointer"
              onClick={() =>
                user?.followers?.length
                  ? navigate({
                      pathname: `/${user?.username}/friends/`,
                      search: createSearchParams({ tab: 2 }).toString(),
                    })
                  : void 0
              }
            >
              {" "}
              {user?.followers?.length} followers{" "}
            </span>
          </div>

          <div>
            <span>
              <strong>
                {capitalizeString(user?.firstName || " ")}{" "}
                {capitalizeString(user?.lastName || " ")}{" "}
              </strong>
            </span>
          </div>
        </div>
      </div>
      <div className="row justify-content-center my-2">
        <div>
          <Nav
            pills
            className="d-flex justify-content-center gap-5 mb-5 border-top"
          >
            <NavItem
              className={`cursor-pointer ${
                tab === 1 ? "bg-primary py-1 px-2 rounded text-white" : ""
              }`}
              onClick={() => setTab(1)}
            >
              <TableCellsIcon style={{ width: "1.5rem", height: "1.5rem" }} />
              <span className="mx-1">Posts</span>
            </NavItem>

            <NavItem
              className={`cursor-pointer ${
                tab === 2 ? "bg-primary py-1 px-2 rounded text-white" : ""
              }`}
              onClick={() => setTab(2)}
            >
              <BookmarkIcon style={{ width: "1.5rem", height: "1.5rem" }} />
              <span className="mx-1">Saved</span>
            </NavItem>
          </Nav>
          <TabContent activeTab={`${tab}`}>
            <TabPane tabId="1">
              <UserProfilePosts posts={user?.posts} />
            </TabPane>
            <TabPane tabId="2">
              <UserProfileSavedPosts featuredPosts={user?.featuredPosts} />
            </TabPane>
          </TabContent>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Profile;
