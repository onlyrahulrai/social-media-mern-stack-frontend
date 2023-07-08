import React from "react";
import { useAuthStore } from "../../store/store";

const Sidebar = () => {
  const { auth } = useAuthStore((state) => state);

  return (
    <div className="position-sticky" style={{ top: "2rem" }}>
      {auth ? (
        <div className="p-4 mb-3 bg-body-tertiary rounded">
          <h4 className="fst-italic">About</h4>
          <p className="mb-0">{auth?.bio}</p>
        </div>
      ) : null}

      <div className="p-4">
        <h4 className="fst-italic">Archives</h4>
        <ol className="list-unstyled mb-0">
          <li>March 2021</li>
          <li>February 2021</li>
          <li>January 2021</li>
          <li>December 2020</li>
          <li>November 2020</li>
          <li>October 2020</li>
          <li>September 2020</li>
          <li>August 2020</li>
          <li>July 2020</li>
          <li>June 2020</li>
          <li>May 2020</li>
          <li>April 2020</li>
        </ol>
      </div>

      <div className="p-4">
        <h4 className="fst-italic">Elsewhere</h4>
        <ol className="list-unstyled">
          <li>GitHub</li>
          <li>Twitter</li>
          <li>Facebook</li>
        </ol>
      </div>
    </div>
  );
};

export default Sidebar;
