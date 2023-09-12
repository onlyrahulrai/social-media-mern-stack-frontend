import React, { useState } from "react";
import UserCard from "../common/UserCard";
import { useAuthStore } from "../../store/store";
import useFetchAPI from "../../hooks/useFetchAPI";
import Spinner from "../Spinner";
import { useParams } from "react-router-dom";
import { ListGroup, ListGroupItem } from "reactstrap";

const Followers = ({ profile, onRequestFriend, onRemoveUserFromFollowers }) => {
  const { auth } = useAuthStore((state) => state);
  const { username } = useParams();
  const [{ data, loading }, , refetch] = useFetchAPI(`/followers/${username}/`);
  const [search, setSearch] = useState("");

  const FriendRequiredAction = ({ user }) => {
    return (
      <>
        {console.log(
          " Profile and Auth ",
          profile?.id === auth?.id,
          auth?.followers,
          user?._id
        )}
        {auth?.id !== user?._id ? (
          profile?.id === auth?.id && auth?.followers?.includes(user?._id) ? (
            <button
              className="btn btn-primary"
              type="button"
              onClick={() => onRemoveUserFromFollowers(user, refetch)}
            >
              Remove
            </button>
          ) : auth?.following?.includes(user?._id) ? (
            <button
              className="btn btn-primary"
              type="button"
              onClick={() => onRequestFriend(user)}
            >
              Following
            </button>
          ) : (
            <button
              className="btn btn-primary"
              type="button"
              onClick={() => onRequestFriend(user)}
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
      {data?.followers?.length ? (
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
              {data?.followers?.map((user, key) => (
                <ListGroupItem className="shadow-lg my-1 rounded" key={key}>
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
          <span>You don't have any followers.</span>
        </div>
      )}
    </div>
  );
};

export default Followers;
