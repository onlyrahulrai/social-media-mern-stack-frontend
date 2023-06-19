import React from "react";
import Posts from "./Posts";
import Sidebar from "./Sidebar";

const Main = () => {
  return (
    <div className="row">
      <div className="col-md-8">
        <Posts />
      </div>
      <div className="col-md-4">
        <Sidebar />
      </div>
    </div>
  );
};

export default Main;
