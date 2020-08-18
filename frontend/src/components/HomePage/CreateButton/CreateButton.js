import React from "react";
import { Plus, Dash } from "react-bootstrap-icons";

function CreateButton({isCreateWindowOpen, setCreateWindowOpen}) {

  return (
    <div style={{ zIndex: 1, position: "fixed", right: 0, bottom: 0 }}>
      {!isCreateWindowOpen && (
        <button
          className="btn btn-primary m-3"
          type="button"
          onClick={(e)=>setCreateWindowOpen(true)}
        >
          <Plus color="white" size="25" />
        </button>
      )}
      {isCreateWindowOpen && (
        <button
          className="btn btn-danger m-3"
          type="button"
          onClick={(e)=>setCreateWindowOpen(false)}
        >
          <Dash color="white" size="25" />
        </button>
      )}
    </div>
  );
}

export default CreateButton;
