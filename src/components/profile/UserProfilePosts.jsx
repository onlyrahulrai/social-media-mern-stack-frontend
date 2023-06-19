import React from "react";

import Post from "./Post";
import NoContent from "./NoContent";

const UserProfilePosts = ({posts}) => {

  if(!posts?.length) return <NoContent text="You've not created posts" />
  
  return (
    <React.Fragment>
      <div className="cards">
        {posts?.map((post, key) => (
          <Post {...post} key={key} />
        ))}
      </div>
      
    </React.Fragment>
  );
};

export default UserProfilePosts;
