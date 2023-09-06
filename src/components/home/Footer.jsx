import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="blog-footer w-100 text-center py-4 shadow-lg mt-4">
      <p>
        Developed and Managed by{" "}
        <Link to="https://www.linkedin.com/in/rahulraifzb/" target="blank" className="text-decoration-none">Rahul Rai</Link> by{" "}
      </p>
      <p onClick={() =>   window.scrollTo(0, 0)} className="cursor-pointer text-primary">
        Back to top
      </p>
    </footer>
  );
};

export default Footer;
