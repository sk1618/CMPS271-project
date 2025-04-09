import React from "react";

const OurServices = (props) => {
  return (
    <div className="card">
      <img src={props.image} alt={props.name} />
      <h3>{props.name}</h3>
      <p>{props.description}</p>
      <a href="#" className="btn">
        Read More
      </a>
    </div>
  );
};

export default OurServices;