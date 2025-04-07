import React from "react";

function Card(props){
    return(
        <div className="card">
            <img src={props.image}></img>
            <h3>{props.name}</h3>
            <p>{props.des}</p>
            <a href="#" className="btn">
                read more
            </a>
        </div>
    )
}
export default Card;
