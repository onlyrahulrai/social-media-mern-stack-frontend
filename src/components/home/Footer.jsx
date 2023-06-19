import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="blog-footer w-100 text-center py-4 shadow-lg mt-5">
      <p>
        Developed and Managed by{" "}
        <Link to="https://www.linkedin.com/in/rahulraifzb/" target="blank">Rahul Rai</Link> by{" "}
      </p>
      <p>
        <a href="#header">Back to top</a>
      </p>
    </footer>
  );
};

export default Footer;
