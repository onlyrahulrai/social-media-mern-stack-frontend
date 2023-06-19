import React from "react";
import Post from "./Post";
import NoContent from "./NoContent";


const UserProfileSavedPosts = ({ featuredPosts }) => {

  if(!featuredPosts?.length) return <NoContent text="You've not saved posts" />

  return (
    <div className="cards">
      {featuredPosts?.map((post, key) => (
        <Post {...post} key={key} />
      ))}
    </div>
  );
};

export default UserProfileSavedPosts;
