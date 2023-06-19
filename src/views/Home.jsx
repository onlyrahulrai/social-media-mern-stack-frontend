import React, { useEffect, useState } from "react";
import { Posts } from "../components";
import apiInstance from "../api/base";
import {toast} from "react-hot-toast";
import { useLayoutStore } from "../store/store";


const Home = () => {
  const [posts,setPosts] = useState([]);
  const {setLoading} = useLayoutStore((state) => state)
  
  useEffect(() => {
    const fetchPosts = async () => {
    setLoading(true)
      await apiInstance.get("/posts/")
      .then(({data:{posts}}) => {
        setPosts(posts)
        setLoading(false)
      })
      .catch((error) => {
        toast.error("Couldn't fetch the posts.")
      })
    }
    fetchPosts()
  },[])

  return <Posts posts={posts} />
};

export default Home;
