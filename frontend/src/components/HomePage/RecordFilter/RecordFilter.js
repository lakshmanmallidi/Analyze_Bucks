import React from "react";

function RecordFilter({filterState,toggleFilterState}) {

  const buttonGroupCss = "btn btn-outline-primary btn-light shadow-none ";
  return (
    <div style={{ zIndex: 1, position: "fixed", top: 0, right: 0 }}>
      <div className="btn-group m-2">
        <button
          className={
            filterState ? buttonGroupCss + "active" : buttonGroupCss
          }
          onClick={(e) => {
            toggleFilterState(true);
          }}
        >
          Active
        </button>
        <button
          className={
            !filterState ? buttonGroupCss + "active" : buttonGroupCss
          }
          onClick={(e) => {
            toggleFilterState(false);
          }}
        >
          Closed
        </button>
      </div>
    </div>
  );
}

export default RecordFilter;
