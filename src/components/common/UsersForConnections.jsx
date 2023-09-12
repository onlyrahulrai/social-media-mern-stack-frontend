import React, { useEffect, useState } from "react";
import { Button, Spinner } from "reactstrap";
import { toast } from "react-hot-toast";
import axiosInstance from "../../api/base";
import UserCard from "./UserCard";
import useSocketContext from "../../context/useSocketContext";

const UsersForConnections = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const {onFollowUserRequest} = useSocketContext();

  const fetchUsersForConnections = async () => {
    setLoading(true);
    await axiosInstance
      .get("/users-for-connections/")
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(" Error ", error);
        setError("Couldn't fetch users");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsersForConnections();
  }, []);

  const onRequestFriend = async (user) => {
    try {
      const followPromise = axiosInstance.put(
        "/follow-user",
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
        success: `You have started following ${user?.username}.`,
        error: "Couldn't follow the user.",
      });

      followPromise.then(() => {

        onFollowUserRequest({
          user: user?._id,
          follow:  true,
        });

        fetchUsersForConnections();
      });
    } catch (error) {
      return toast.error("Couldn't follow the user.");
    }
  };

  if (loading || error || !users.length)
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "198px" }}
      >
        {loading ? <Spinner /> : null}

        {error ? (
          <div className="text-danger text-center">
            <span>{error}</span>
          </div>
        ) : null}

        {!loading && !error ? <span>No Users found to follow!</span> : null}
      </div>
    );

  return (
    <div>
      {users.map((user, key) => (
        <div className="shadow-sm my-3 rounded" key={key}>
          <div>
            <div className="d-flex justify-content-between">
              <UserCard user={user} />

              <Button
                color="primary"
                size="sm"
                onClick={() => onRequestFriend(user)}
              >
                Follow
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UsersForConnections;
