import React from "react";
import { Footer, Header, Hero } from "../components";
import Sidebar from "../components/home/Sidebar";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Outlet, useSearchParams } from "react-router-dom";
import Carousel from "../components/home/Carousel";

const BaseLayout = (props) => {
  const [searchParams] = useSearchParams();

  return (
    <React.Fragment>
      <div>
        <Header />
        <div className="container">
          {props.hero ? <Hero /> : null}

          {(props.slider && !searchParams.get("category")) ? <Carousel /> : null}

          <div className="row justify-content-center">
            <div className={`${props.full ? "col-md-10" : "col-md-8"}`}>
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
