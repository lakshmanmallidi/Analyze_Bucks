import React from "react";
import logo from "./logo.png";
import "./card.css";
import Login from "./Login/Login";
import Register from "./Register/Register";
import {Link} from "react-router-dom";

function LandingPage({page,history}) {

  function getPage(){
    if(page==="login"){
      return <Login history={history}/>
    }
    else if(page==="register"){
      return <Register history={history}/>
    }
    else if(page==="server_error"){
      return (<div className="text-center">
        <h4>Unable to fetch data</h4>
        <Link to="/">Go to Home Page</Link>
      </div>)
    }
    else{
      return (<div className="text-center">
        <h4>404</h4>
        <h4>Page Not Found</h4>
        <Link to="/">Go to Home Page</Link>
      </div>)
    }
  }

  return (
    <div className="blue-background">
      <div className="container">
        <div className="row">
          <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
            <div className="card card-signin my-5">
              <div className="card-body">
                <h4 className="text-center">Analyze Bucks</h4>
                <img
                  src={logo}
                  alt="Logo"
                  className="w-25 h-25 img-rounded mx-auto d-block p-2"
                />
                {getPage()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
