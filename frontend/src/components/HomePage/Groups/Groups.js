import React, { useState, useEffect } from "react";
import { DoorClosed, Trash, DoorOpen } from "react-bootstrap-icons";
import Loading from "../../Loading";
import CreateButton from "../CreateButton";
import RecordFilter from "../RecordFilter";
import getServerUrl from "../../../Constants"

function Groups({ triggerError, setViewType, setGroupId}) {
  const [inProgess, setInProgess] = useState(false);
  const [groups, setGroups] = useState([]);
  const [isCreateWindowOpen, setCreateWindowOpen] = useState(false);
  const [creationInProgress, setCreationInProgress] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [filterState, toggleFilterState] = useState(true);
  const [groupIdPlaceHolder, setDeleteGroup] = useState(0);
  const [isDelGroupWindowOpen, setDelGroupWindowOpen] = useState(false);
  const [groupDeletionInProgress, setGroupDeletionInProgress] = useState(false);

  useEffect(() => {
    async function getGroups() {
      setInProgess(true);
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token " + localStorage.getItem("token"),
        },
      };
      try {
        const response = await fetch(
          getServerUrl() + "finance/business_group/",
          requestOptions
        );
        if (response.ok) {
          const data = await response.json();
          setGroups(data);
          setInProgess(false);
        } else if (response.status === 401) {
          setInProgess(false);
          triggerError("authError");
        } else {
          setInProgess(false);
          alert("Server Error");
          triggerError("apiError");
        }
      } catch {
        triggerError("apiError");
      }
    }
    getGroups();
  }, []);

  async function createGroup() {
    setCreationInProgress(true);
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + localStorage.getItem("token"),
      },
      body: JSON.stringify({ group_name: groupName }),
    };
    try {
      const response = await fetch(
        getServerUrl() + "finance/business_group/",
        requestOptions
      );
      if (response.ok) {
        const data = await response.json();
        setGroups(groups.concat(data));
        setCreationInProgress(false);
        setGroupName("");
        setCreateWindowOpen(false);
      } else if (response.status === 401) {
        setCreationInProgress(false);
        triggerError("authError");
      } else {
        setCreationInProgress(false);
        alert("Server Error");
      }
    } catch (e) {
      setCreationInProgress(false);
      triggerError("apiError");
    }
  }

  async function closeGroup(group_id) {
    setInProgess(true);
    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + localStorage.getItem("token"),
      },
      body: JSON.stringify({ operation: "CLOSE" }),
    };
    try {
      const response = await fetch(
        getServerUrl() + "finance/business_group/" + group_id + "/",
        requestOptions
      );
      if (response.ok) {
        const data = await response.json();
        groups.map((group) => {
          if (group.group_id === group_id) {
            group.is_active = data.is_active;
          }
          return group;
        });
        setInProgess(false);
      } else if (response.status === 401) {
        setInProgess(false);
        triggerError("authError");
      } else {
        setInProgess(false);
        alert("Server Error");
      }
    } catch (e) {
      setInProgess(false);
      triggerError("apiError");
    }
  }

  async function activateGroup(group_id) {
    setInProgess(true);
    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + localStorage.getItem("token"),
      },
      body: JSON.stringify({ operation: "ACTIVE" }),
    };
    try {
      const response = await fetch(
        getServerUrl() + "finance/business_group/" + group_id + "/",
        requestOptions
      );
      if (response.ok) {
        const data = await response.json();
        groups.map((group) => {
          if (group.group_id === group_id) {
            group.is_active = data.is_active;
          }
          return group;
        });
        setInProgess(false);
      } else if (response.status === 401) {
        setInProgess(false);
        triggerError("authError");
      } else {
        setInProgess(false);
        alert("Server Error");
      }
    } catch (e) {
      setInProgess(false);
      triggerError("apiError");
    }
  }

  async function deleteGroup() {
    setGroupDeletionInProgress(true);
    const requestOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + localStorage.getItem("token"),
      },
    };
    try {
      const response = await fetch(
        getServerUrl() + "finance/business_group/" + groupIdPlaceHolder + "/",
        requestOptions
      );
      if (response.ok) {
        setGroups(groups.filter(group=>group.group_id===groupIdPlaceHolder ? false : true))
        setGroupDeletionInProgress(false)
        closeDelGroupWindow()
      } else if (response.status === 401) {
        setGroupDeletionInProgress(false);
        triggerError("authError");
      } else {
        setGroupDeletionInProgress(false);
        closeDelGroupWindow()
        alert("Server Error");
      }
    } catch (e) {
      setGroupDeletionInProgress(false);
      triggerError("apiError");
    }
  }

  function createWindowValidation() {
    return groupName.length > 0;
  }

  function openDelGroupWindow(group_id) {
    setDeleteGroup(group_id);
    setDelGroupWindowOpen(true);
  }

  function closeDelGroupWindow() {
    setDeleteGroup(0);
    setDelGroupWindowOpen(false);
  }

  function openGroup(group_id) {
    setViewType(2)
    setGroupId(group_id)
  }

  function renderCard(group, index) {
    const choice = (index % 8) + 1;

    let cssStyle = "";
    switch (choice) {
      case 2:
        cssStyle = "bg-secondary";
        break;
      case 3:
        cssStyle = "bg-success";
        break;
      case 4:
        cssStyle = "bg-danger";
        break;
      case 5:
        cssStyle = "bg-warning";
        break;
      case 6:
        cssStyle = "bg-info";
        break;
      case 7:
        cssStyle = "bg-primary";
        break;
      default:
        cssStyle = "bg-dark";
    }

    return (
      <div className="card border border-dark m-2" key={group.group_id}>
        <div className={"text-white " + cssStyle}>
          <div className="text-center">
            {group.group_name.toUpperCase()}
            <div className="float-right">
              {group.is_active && (
                <button
                  className="btn p-0 m-1"
                  onClick={(e) => closeGroup(group.group_id)}
                >
                  <DoorClosed color="white" />
                </button>
              )}
              {!group.is_active && (
                <div>
                  <button
                    className="btn p-0 m-1"
                    onClick={(e) => openDelGroupWindow(group.group_id)}
                  >
                    <Trash color="white" />
                  </button>
                  <button
                    className="btn p-0 m-1"
                    onClick={(e) => activateGroup(group.group_id)}
                  >
                    <DoorOpen color="white" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="card-body mx-auto">
          <button className={"btn text-white " + cssStyle} onClick={e=>openGroup(group.group_id)}>Open</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <RecordFilter
        filterState={filterState}
        toggleFilterState={toggleFilterState}
      />
      {filterState && (
        <CreateButton
          isCreateWindowOpen={isCreateWindowOpen}
          setCreateWindowOpen={setCreateWindowOpen}
        />
      )}
      {isCreateWindowOpen && (
        <div
          style={{ zIndex: 1, position: "fixed", width: "100%", top: "20%" }}
        >
          <div className="m-3 bg-light p-3 border border-dark ">
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                id="groupName"
                placeholder="Enter New Group Name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                required
                autoFocus
                autoComplete="off"
              />
            </div>
            <button
              className="btn btn-primary m-2"
              onClick={createGroup}
              disabled={!createWindowValidation() || creationInProgress}
            >
              {!creationInProgress && <div>Create</div>}
              {creationInProgress && <Loading />}
            </button>
          </div>
        </div>
      )}
      {isDelGroupWindowOpen && (
        <div
          style={{ zIndex: 1, position: "fixed", width: "100%", top: "20%" }}
        >
          <div className="m-3 bg-light p-3 border border-dark text-center">
            <h4>
              you will loss data permanently, Do you want to Delete this group?
            </h4>
            <div>
              <button
                className="btn btn-danger m-2"
                onClick={deleteGroup}
                disabled={groupDeletionInProgress}
              >
                {!groupDeletionInProgress && <div>Confrim</div>}
                {groupDeletionInProgress && <Loading />}
              </button>
              <button
                className="btn btn-primary m-2"
                onClick={closeDelGroupWindow}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {inProgess && (
        <div style={{ zIndex: 1, position: "fixed", top: "50%", left: "50%" }}>
          <Loading />
        </div>
      )}
      <div
        style={{
          background: "white",
          zIndex: 0,
          top: 0,
          position: "fixed",
          width: "100%",
          height: "60px",
        }}
      />
      <div style={{ marginTop: "60px" }}>
        <div className="container">
          {groups
            .filter((group) =>
              filterState ? group.is_active : !group.is_active
            )
            .map((group, index) => renderCard(group, index))}
        </div>
      </div>
    </div>
  );
}

export default Groups;
