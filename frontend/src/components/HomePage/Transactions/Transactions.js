import React, { useState, useEffect } from "react";
import { DoorClosed, DoorOpen } from "react-bootstrap-icons";
import Loading from "../../Loading";
import CreateButton from "../CreateButton";
import RecordFilter from "../RecordFilter";
import Select from "react-select";
import "./Transactions.css";
import getServerUrl from "../../../Constants"

function Transactions({ triggerError, cust_id, group_id, acct_id }) {
  const [inProgess, setInProgess] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [isCreateWindowOpen, setCreateWindowOpen] = useState(false);
  const [creationInProgress, setCreationInProgress] = useState(false);
  const [transactionDate, setTransactionDate] = useState(getDateTimeNow(new Date()));
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    async function getTransactions() {
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
          getServerUrl() + "finance/get_transactions_list/" +
            group_id +
            "/" +
            cust_id +
            "/" +
            acct_id +
            "/",
          requestOptions
        );
        if (response.ok) {
          const data = await response.json();
          setTransactions(data);
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
    getTransactions();
  }, []);

  async function createTransaction() {
    setCreationInProgress(true);
    const postData = {
      transaction_date: transactionDate,
      account: acct_id,
      amount: amount,
    };
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        business_group: group_id,
        customer: cust_id,
        transaction_data: postData,
      }),
    };
    try {
      const response = await fetch(
        getServerUrl() + "finance/transaction/",
        requestOptions
      );
      if (response.ok) {
        const data = await response.json();
        setTransactions(transactions.concat(data));
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
    setTransactionDate(getDateTimeNow(new Date()));
    setAmount(0);
  }

  function createWindowValidation() {
    return transactionDate.length > 0 && amount>0;
  }

  function getWeekDay(date) {
    const dayOfWeekValue = date.getDay();
    var dayOfWeek;

    if (dayOfWeekValue === 0) dayOfWeek = "SUN";
    else if (dayOfWeekValue === 1) dayOfWeek = "MON";
    else if (dayOfWeekValue === 2) dayOfWeek = "TUE";
    else if (dayOfWeekValue === 3) dayOfWeek = "WED";
    else if (dayOfWeekValue === 4) dayOfWeek = "THU";
    else if (dayOfWeekValue === 5) dayOfWeek = "FRI";
    else dayOfWeek = "SAT";

    return dayOfWeek;
  }

  function getDateTimeNow(date) {
    const year = date.getFullYear();

    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : "0" + month;

    var day = date.getDate().toString();
    day = day.length > 1 ? day : "0" + day;

    var hour = date.getHours().toString();
    hour = hour.length > 1 ? hour : "0" + hour;

    var minutes = date.getMinutes().toString();
    minutes = minutes.length > 1 ? minutes : "0" + minutes;

    var seconds = date.getSeconds().toString();
    seconds = seconds.length > 1 ? seconds : "0" + seconds;

    return year + "-" + month + "-" + day + "T" + hour + ":" + minutes + ":" + seconds;
  }

  function getFormattedDate(date) {
    const year = date.getFullYear();

    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : "0" + month;

    var day = date.getDate().toString();
    day = day.length > 1 ? day : "0" + day;

    var hour = date.getHours().toString();
    hour = hour.length > 1 ? hour : "0" + hour;

    var minutes = date.getMinutes().toString();
    minutes = minutes.length > 1 ? minutes : "0" + minutes;

    return year + "-" + month + "-" + day + " " + hour + ":" + minutes;
  }

  function compare(a, b) {
    const dateA = new Date(a.transaction_date);
    const dateB = new Date(b.transaction_date);

    let comparison = 0;
    if (dateA > dateB) {
      comparison = -1;
    } else if (dateA < dateB) {
      comparison = 1;
    }
    return comparison;
  }

  return (
    <div>
      <CreateButton
        isCreateWindowOpen={isCreateWindowOpen}
        setCreateWindowOpen={setCreateWindowOpen}
      />

      {isCreateWindowOpen && (
        <div
          style={{ zIndex: 1, position: "fixed", width: "100%", top: "20%" }}
        >
          <div className="m-3 bg-light p-3 border border-dark ">
            <div className="form-group">
              <input
                type="number"
                className="form-control mb-3"
                id="transactionAmount"
                placeholder="Enter Transaction Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                autoComplete="off"
              />
              <input
                type="datetime-local"
                className="form-control mb-3"
                id="transactionDate"
                value={transactionDate}
                onChange={(e) => setTransactionDate(e.target.value)}
                required
                autoComplete="off"
              />
            </div>
            <button
              className="btn btn-primary m-2"
              onClick={createTransaction}
              disabled={!createWindowValidation() || creationInProgress}
            >
              {!creationInProgress && <div>Create</div>}
              {creationInProgress && <Loading />}
            </button>
          </div>
        </div>
      )}

      <div
        style={{
          zIndex: 1,
          position: "fixed",
          width: "95%",
          top: "50px",
          marginLeft: "2%",
          marginRight: "2%",
        }}
      >
        <table className="table">
          <thead className="thead-dark">
            <tr>
              <th>Date</th>
              <th>Amount</th>
            </tr>
          </thead>
        </table>
      </div>

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
          height: "110px",
        }}
      />
      <div style={{ marginTop: "110px" }}>
        <div className="container">
          <table className="table">
            <tbody>
              {transactions.sort(compare).map((transaction, index) => (
                <tr key={transaction.transaction_id}>
                  <td>
                    {getFormattedDate(new Date(transaction.transaction_date))}{" "}
                    <br />
                    {getWeekDay(new Date(transaction.transaction_date))}
                  </td>
                  <td>{transaction.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Transactions;
