import React from "react";
import Post from "./Post";
import { useLayoutStore } from "../../store/store";
import Spinner from "../Spinner";
import { useSearchParams } from "react-router-dom";

const Posts = ({ posts }) => {
  const { loading } = useLayoutStore((state) => state);
  const [searchParams] = useSearchParams();

  if (loading) return <Spinner />;

  return (
    <React.Fragment>
      {!searchParams.get("category") ? (
        <h3 className="pb-2 mb-3 fst-italic border-bottom">From the Toksi</h3>
      ) : null}

      {posts.map((post, key) => (
        <Post key={key} {...post} />
      ))}
    </React.Fragment>
  );
};

export default Posts;
