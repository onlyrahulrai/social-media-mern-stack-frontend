import React, { useState } from "react";
import useFetchAPI from "../../hooks/useFetchAPI";
import Spinner from "../Spinner";
import UserCard from "../common/UserCard";
import { useAuthStore } from "../../store/store";
import { useParams } from "react-router-dom";
import { ListGroup, ListGroupItem } from "reactstrap";

const Followers = ({ onRequestFriend }) => {
  const { auth } = useAuthStore((state) => state);
  const { username } = useParams();
  const [{ data, loading }, , refetch] = useFetchAPI(`/following/${username}`);
  const [search, setSearch] = useState("");

  const FriendRequiredAction = ({ user }) => {
    return (
      <>
        {auth?.id !== user?._id ? (
          auth?.following?.includes(user?._id) ? (
            <button
              className="btn btn-primary"
              type="button"
              onClick={() => onRequestFriend(user, refetch)}
            >
              Following
            </button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={() => onRequestFriend(user, refetch)}
              type="button"
            >
              Follow
            </button>
          )
        ) : (
          ""
        )}
      </>
    );
  };

  if (loading) return <Spinner />;

  return (
    <div>
      {data?.length ? (
        <div>
          <div className="input-group">
            <input
              className="form-control border rounded-pill"
              type="search"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="d-flex justify-content-center mt-3">
            <ListGroup style={{ width: "75%" }}>
              {data?.map((user, key) => (
                <ListGroupItem key={key} className="shadow-lg my-1 rounded">
                  <div>
                    <div className="d-flex justify-content-between">
                      <UserCard user={user} />

                      <FriendRequiredAction user={user} />
                    </div>
                  </div>
                </ListGroupItem>
              ))}
            </ListGroup>
          </div>
        </div>
      ) : (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "62vh" }}
        >
          <span>You are not following anyone.</span>
        </div>
      )}
    </div>
  );
};

export default Followers;
