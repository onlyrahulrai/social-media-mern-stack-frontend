import React, { useEffect, useState } from "react";
import { Posts } from "../components";
import apiInstance from "../api/base";
import { useLayoutStore } from "../store/store";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const { setLoading } = useLayoutStore((state) => state);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      await apiInstance
        .get("/posts/")
        .then(({ data: { posts } }) => {
          setPosts(posts);
          setLoading(false);
        })
        .catch((error) => {
          setError("Something Went Wrong\nPlease try again after sometimes later.");
        });
    };
    fetchPosts();
  }, []);

  if (error)
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "36vh" }}
      >
        <div className="text-danger text-center">
          <pre>{error}</pre>
        </div>
      </div>
    );

  return <Posts posts={posts} />;
};

export default Home;
