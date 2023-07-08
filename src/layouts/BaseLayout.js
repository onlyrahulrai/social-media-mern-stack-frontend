import React from "react";
import { Footer, Header, Hero } from "../components";
import Sidebar from "../components/home/Sidebar";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Outlet } from "react-router-dom";

const BaseLayout = (props) => {
  return (
    <React.Fragment>
      <div>
        <Header />
        <div className="container">
          {props.hero ? <Hero /> : null}

          <div className="row justify-content-center">
            <div className="col-md-8">
              <Outlet />
            </div>

            {props.sidebar ? (
              <div className="col-md-4">
                <Sidebar />
              </div>
            ) : null}
          </div>
        </div>
        <Footer />
      </div>
    </React.Fragment>
  );
};

export default BaseLayout;
