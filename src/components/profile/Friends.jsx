import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Nav, NavItem, TabContent, TabPane } from "reactstrap";
import Spinner from "../Spinner";
import Followers from "./Followers";
import Following from "./Following";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { getUser } from "../../helper/helper";
import { toast } from "react-hot-toast";
import axiosInstance from "../../api/base";
import { useAuthStore } from "../../store/store";

const Friends = () => {
  const { auth } = useAuthStore((state) => state);
  const [searchParams, setSearchParams] = useSearchParams();
  const { tab } = useMemo(() => Object.fromEntries([...searchParams]), [
    searchParams,
  ]);
  const navigate = useNavigate();
  const { username } = useParams();
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);

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

  const onChageTab = (tab) => {
    searchParams.set("tab", tab);
    setSearchParams(searchParams);
  };

  const onRemoveUserFromFollowers = async (user, refetch) => {
    try {
      const URL = "/remove-user-from-followers/";

      const followPromise = axiosInstance.put(URL, {
        followUserId: user?._id,
      });

      toast.promise(followPromise, {
        loading: "Checking User...",
        success: `You have removed ${user?.username} from followers.`,
        error: "Couldn't follow the user.",
      });

      followPromise.then(({ data: { followers } }) => {
        Promise.resolve(refetch()).then(() =>
          setUser((state) => ({ ...state, followers }))
        );
      });
    } catch (error) {
      return toast.error("Couldn't follow the user.");
    }
  };

  const onRequestFriend = async (user, refetch) => {
    try {
      const URL = auth?.following?.includes(user?._id)
        ? "/unfollow-user"
        : "/follow-user";

      const followPromise = axiosInstance.put(
        URL,
        {
          followUserId: user?._id,
        },
        {
          headers: {
            friends: true,
          },
        }
      );

      toast.promise(followPromise, {
        loading: "Checking User...",
        success: `You have ${
          auth?.following?.includes(user?._id) ? "stopped" : "started"
        } following ${user?.username}.`,
        error: "Couldn't follow the user.",
      });

      followPromise.then(({ data }) => {
        Promise.resolve(refetch());
      });
    } catch (error) {
      return toast.error("Couldn't follow the user.");
    }
  };

  if (loading) return <Spinner style={{ minHeight: "68vh" }} />;

  return (
    <div style={{ minHeight: "62vh" }} className="mt-5">
      <div
        className="text-primary cursor-pointer"
        onClick={() => navigate(`/${username}`)}
      >
        <ArrowLeftIcon style={{ width: "1.5rem", height: "1.5rem" }} />{" "}
        {username}
      </div>

      <h3 className="text-center my-5">Friends</h3>

      <div>
        <Nav className="d-flex justify-content-center align-items-center gap-5 mb-4 pt-2 border-top">
          <NavItem
            className={`cursor-pointer ${
              tab === "1" ? "bg-primary text-light py-2 px-2 rounded" : null
            }`}
            onClick={() => (user?.following?.length ? onChageTab(1) : void 0)}
          >
            <span className="mx-1">{(user?.id === auth?.id) ? auth?.following?.length : user?.following?.length} Following</span>
          </NavItem>

          <NavItem
            className={`cursor-pointer ${
              tab === "2" ? "bg-primary text-light py-2 px-2 rounded" : null
            }`}
            onClick={() => (user?.followers?.length ? onChageTab(2) : void 0)}
          >
            <span className="mx-1">{(user?.id === auth?.id) ? auth?.followers?.length : user?.followers?.length} Followers</span>
          </NavItem>
        </Nav>
        <TabContent activeTab={`${tab}`}>
          <TabPane tabId="1">
            {tab === "1" ? (
              <Following profile={user} onRequestFriend={onRequestFriend}  />
            ) : null}
          </TabPane>
          <TabPane tabId="2">
            {tab === "2" ? (
              <Followers
                profile={user}
                onRequestFriend={onRequestFriend}
                onRemoveUserFromFollowers={onRemoveUserFromFollowers}
              />
            ) : null}
          </TabPane>
        </TabContent>
      </div>
    </div>
  );
};

export default Friends;
