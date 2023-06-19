import React from "react";
import Post from "./Post";
import { useLayoutStore } from "../../store/store";
import Spinner from "../Spinner";

const Posts = ({posts}) => {
  const {loading} = useLayoutStore((state) =>  state)

  if(loading) return <Spinner />

  return (
    <React.Fragment>
      <h3 className="pb-4 mb-4 fst-italic border-bottom">From the Toksi</h3>

      {
        posts.map((post,key) => <Post key={key} {...post} />)
      }
      
    </React.Fragment>
  );
};

export default Posts;
