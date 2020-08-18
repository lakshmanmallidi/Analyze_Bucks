import React, { useState, useEffect } from "react";
import { DoorClosed, DoorOpen } from "react-bootstrap-icons";
import Loading from "../../Loading";
import CreateButton from "../CreateButton";
import RecordFilter from "../RecordFilter";
import Select from "react-select";
import getServerUrl from "../../../Constants"

function Accounts({ triggerError, cust_id, group_id, setViewType, setAcctId }) {
  const [inProgess, setInProgess] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [isCreateWindowOpen, setCreateWindowOpen] = useState(false);
  const [creationInProgress, setCreationInProgress] = useState(false);
  const [accoutName, setAccoutName] = useState("");
  const [accountType, setAccoutType] = useState({ label: "None", value: null });
  const [timePeriodType, setTimePeriodType] = useState("days");
  const [amount, setAmount] = useState(0);
  const [time, setTime] = useState(null);
  const [intrestAmount, setIntrest] = useState(null);
  const [filterState, toggleFilterState] = useState(true);

  useEffect(() => {
    async function getAccounts() {
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
          getServerUrl() + "finance/get_accounts_list/" +
            group_id +
            "/" +
            cust_id +
            "/",
          requestOptions
        );
        if (response.ok) {
          const data = await response.json();
          setAccounts(data);
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
    getAccounts();
  }, []);

  async function createAccount() {
    setCreationInProgress(true);
    const postData = {
      display_name: accoutName,
      customer: cust_id,
      acct_type: accountType.label,
      principle: amount,
      time: time,
      interest_inadvance: intrestAmount,
    };
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        business_group: group_id,
        acct_data: postData,
      }),
    };
    try {
      const response = await fetch(
        getServerUrl() + "finance/account/",
        requestOptions
      );
      if (response.ok) {
        const data = await response.json();
        setAccounts(accounts.concat(data));
        setCreationInProgress(false);
        resetCreateForm();
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

  function resetCreateForm() {
    setAccoutName("");
    setAccoutType({ label: "None", value: null });
    setTimePeriodType("days");
    setAmount("");
    setTime(null);
    setIntrest(null);
  }

  async function closeAccount(acct_id) {
    setInProgess(true);
    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        operation: "CLOSE",
        business_group: group_id,
        customer: cust_id,
      }),
    };
    try {
      const response = await fetch(
        getServerUrl() + "finance/account/" + acct_id + "/",
        requestOptions
      );
      if (response.ok) {
        const data = await response.json();
        accounts.map((account) => {
          if (account.acct_id === acct_id) {
            account.is_active = data.is_active;
          }
          return account;
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

  async function activateAccout(acct_id) {
    setInProgess(true);
    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        operation: "ACTIVE",
        business_group: group_id,
        customer: cust_id,
      }),
    };
    try {
      const response = await fetch(
        getServerUrl() + "finance/account/" + acct_id + "/",
        requestOptions
      );
      if (response.ok) {
        const data = await response.json();
        accounts.map((account) => {
          if (account.acct_id === acct_id) {
            account.is_active = data.is_active;
          }
          return account;
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

  function createWindowValidation() {
    return (
      accoutName.length > 0 &&
      accountType.value !== null &&
      amount > 0 &&
      intrestAmount > 0 &&
      (accountType === "OneTime" || accountType === "Adjustment"
        ? true
        : time === null
        ? false
        : time > 0)
    );
  }

  function openAccount(acct_id) {
    setViewType(4);
    setAcctId(acct_id);
  }
  
  function getRemainingTime(account) {
    var timePeriod = 0
    if(account.acct_type === "Weekly") timePeriod = account.time*7
    else if(account.acct_type === "Monthly") timePeriod = account.time*30
    else timePeriod = account.time
    var final_date = new Date(account.created_at)
    final_date.setDate(final_date.getDate() + timePeriod)
    return Math.ceil((Math.abs((new Date()).getTime()-final_date.getTime())) / (1000 * 60 * 60 * 24));
  }

  function renderCard(account, index) {
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
      <div className="card border border-dark m-2" key={account.acct_id}>
        <div className={"text-white " + cssStyle}>
          <div className="text-center">
            <div
              style={{
                width: "85%",
                float: "left",
              }}
            >
              <button
                className="btn btn-link p-0"
                onClick={(e) => openAccount(account.acct_id)}
              >
                <b>{account.display_name.toUpperCase()}</b>
              </button>
              {" | " + account.acct_id}
            </div>
            <div className="float-right">
              {account.is_active && (
                <button
                  className="btn p-0 m-1"
                  onClick={(e) => closeAccount(account.acct_id)}
                >
                  <DoorClosed color="white" />
                </button>
              )}
              {!account.is_active && (
                <div>
                  <button
                    className="btn p-0 m-1"
                    onClick={(e) => activateAccout(account.acct_id)}
                  >
                    <DoorOpen color="white" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="card-body">
          <h6>
            <b>Amount:</b>{" "}
            <span style={{ color: "blue" }}>
              {account.sum === null ? 0 : account.sum}
            </span>
            {" / "}
            {account.principle}
          </h6>
          <h6>
            <b>Account Type:</b> {account.acct_type}
          </h6>
          <h6>
            <b>Created On:</b> {new Date(account.created_at).toUTCString()}
          </h6>
          {account.time !== null && <h6>
            <b>Time left:</b> {getRemainingTime(account)}
          </h6>}
        </div>
      </div>
    );
  }

  function setAcctTypeValue(obj) {
    setAccoutType(obj);
    if (obj.label === "Daily") setTimePeriodType("days");
    else if (obj.label === "Weekly") setTimePeriodType("weeks");
    else if (obj.label === "Monthly") setTimePeriodType("months");
    else setTimePeriodType("days");
  }

  function setTimeValue(e) {
    if (e.target.value === "") setTime(null);
    else setTime(e.target.value);
  }

  function setIntrestValue(e) {
    if (e.target.value === "") setIntrest(null);
    else setIntrest(e.target.value);
  }

  const account_types = [
    { label: "None", value: null },
    { label: "Daily", value: 1 },
    { label: "Weekly", value: 2 },
    { label: "Monthly", value: 3 },
    { label: "OneTime", value: 4 },
    { label: "Adjustment", value: 5 },
  ];

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
                className="form-control mb-3"
                id="acctName"
                placeholder="Enter New Account Name"
                value={accoutName}
                onChange={(e) => setAccoutName(e.target.value)}
                required
                autoComplete="off"
              />
              <Select
                className="mb-3"
                value={accountType}
                placeholder="Select Account Type"
                options={account_types}
                onChange={(obj) => setAcctTypeValue(obj)}
              />
              <input
                type="number"
                className="form-control mb-3"
                id="principleAmount"
                placeholder="Enter Principle Amount:"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                autoComplete="off"
              />
              <input
                type="number"
                className="form-control mb-3"
                id="time"
                placeholder={"Enter Number of " + timePeriodType}
                onChange={(e) => setTimeValue(e)}
                autoComplete="off"
              />
              <input
                type="number"
                className="form-control mb-3"
                id="interestAmount"
                placeholder={"Enter interest per thousand"}
                onChange={(e) => setIntrestValue(e)}
                autoComplete="off"
              />
            </div>
            <button
              className="btn btn-primary m-2"
              onClick={createAccount}
              disabled={!createWindowValidation() || creationInProgress}
            >
              {!creationInProgress && <div>Create</div>}
              {creationInProgress && <Loading />}
            </button>
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
          {accounts
            .filter((account) =>
              filterState ? account.is_active : !account.is_active
            )
            .map((account, index) => renderCard(account, index))}
        </div>
      </div>
    </div>
  );
}

export default Accounts;
