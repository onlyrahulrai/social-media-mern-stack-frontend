import React from "react";
import { Spinner as ReactSpinner } from "reactstrap";

const Spinner = ({style}) => {
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={style || { minHeight: "42vh" }}
    >
      <ReactSpinner />
    </div>
  );
};

export default Spinner;
