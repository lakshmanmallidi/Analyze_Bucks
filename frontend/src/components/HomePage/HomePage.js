import React, { useState, useEffect } from "react";
import Sidebar from "react-sidebar";
import "./HomePage.css";
import {
  PersonCircle,
  PeopleFill,
  BoxArrowInLeft,
  HouseDoorFill,
  Journals
} from "react-bootstrap-icons";
import Groups from "./Groups";
import Customers from "./Customers";
import Accounts from "./Accounts";
import Transactions from "./Transactions";

function HomePage({ history }) {
  const [isSideBarOpen, setSideBarOpen] = useState(false);
  const [viewType, setViewType] = useState(1);
  const [groupId, setGroupId] = useState();
  const [custId, setCustId] = useState();
  const [acctId, setAcctId] = useState();

  useEffect(() => {
    if (
      localStorage.getItem("is_login") == null ||
      localStorage.getItem("token") == null ||
      localStorage.getItem("is_login") === false
    ) {
      history.push("/");
    }
  }, []);

  function errorRouter(errorType) {
    localStorage.clear();
    if (errorType === "authError") history.push("/");
    else if (errorType === "apiError") history.push("/server_error");
  }

  function handleSideBarOpen() {
    setSideBarOpen(!isSideBarOpen);
  }

  function handleLogOut() {
    localStorage.clear();
    history.push("/");
  }

  function getView() {
    if (viewType === 1) {
      return (
        <Groups
          triggerError={errorRouter}
          setViewType={setViewType}
          setGroupId={setGroupId}
        />
      );
    } else if (viewType === 2) {
      return (
        <Customers
          triggerError={errorRouter}
          group_id={groupId}
          setViewType={setViewType}
          setCustId={setCustId}
        />
      );
    } else if (viewType === 3) {
      return (
        <Accounts
          triggerError={errorRouter}
          cust_id={custId}
          group_id={groupId}
          setViewType={setViewType}
          setAcctId={setAcctId}
        />
      );
    } else if (viewType === 4) {
      return (
        <Transactions
          triggerError={errorRouter}
          cust_id={custId}
          group_id={groupId}
          acct_id={acctId}
        />
      );
    }
  }

  function getNavContent(){
    if(viewType===1){
      return (<div></div>)
    }
    else if(viewType===2){
      return (<div>
        <button className="btn side-bar-item" onClick={() => setViewType(1)}>
          <HouseDoorFill color="white" size={30} />
          <span className="p-2 side-bar-span">Home</span>
        </button>
      </div>)
    }
    else if(viewType===3){
      return (<div>
        <button className="btn side-bar-item" onClick={() => setViewType(1)}>
          <HouseDoorFill color="white" size={30} />
          <span className="p-2 side-bar-span">Home</span>
        </button>
        <button className="btn side-bar-item" onClick={() => setViewType(2)}>
          <PeopleFill color="white" size={30} />
          <span className="p-2 side-bar-span">Customers</span>
        </button>
      </div>)
    }
    else if(viewType===4){
      return (<div>
        <button className="btn side-bar-item" onClick={() => setViewType(1)}>
          <HouseDoorFill color="white" size={30} />
          <span className="p-2 side-bar-span">Home</span>
        </button>
        <button className="btn side-bar-item" onClick={() => setViewType(2)}>
          <PeopleFill color="white" size={30} />
          <span className="p-2 side-bar-span">Customers</span>
        </button>
        <button className="btn side-bar-item" onClick={() => setViewType(3)}>
          <Journals color="white" size={30} />
          <span className="p-2 side-bar-span">Accounts</span>
        </button>
      </div>)
    }
  }
  const sideBarStyleParams = {
    sidebar: { background: "#25282d", width: "50%", maxWidth: "300px" },
  };

  const sideBarContext = (
    <div className="list-group">
      <button className="btn" style={{ background: "#2272aa", margin: "2px" }}>
        <PersonCircle color="white" size={96} />
        <h5 style={{ color: "white" }}>Profile</h5>
      </button>
      {getNavContent()}
      <button className="btn side-bar-item fixed-bottom" onClick={handleLogOut}>
        <BoxArrowInLeft color="white" size={30} />
        <span className="p-2 side-bar-span">Log Out</span>
      </button>
    </div>
  );

  return (
    <div>
      <Sidebar
        sidebar={sideBarContext}
        open={isSideBarOpen}
        onSetOpen={handleSideBarOpen}
        styles={sideBarStyleParams}
      >
        <div style={{ zIndex: 1, position: "fixed", top: 0, left: 0 }}>
          <button
            className="btn btn-primary m-2"
            type="button"
            onClick={handleSideBarOpen}
          >
            <span style={{ color: "white" }}>&#9776;</span>
          </button>
        </div>
        {getView()}
      </Sidebar>
    </div>
  );
}

export default HomePage;
