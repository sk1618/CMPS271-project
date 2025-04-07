import React from "react";
import Card from "./components/Card";
import data from "./data";

function App(){
    const card = data.map(item => {
        return <Card image={item.img} name={item.name} des={item.des} />;
    });
    return(
        <>
        <h1 className="heading">Our Services</h1>
        <div className="header_underline">

        </div>
        <div className="wrapper">{card}</div>
        </>
    )
}

export default App;
