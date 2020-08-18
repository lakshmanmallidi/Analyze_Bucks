import React, { useState, useEffect } from "react";
import { DoorClosed, DoorOpen } from "react-bootstrap-icons";
import Loading from "../../Loading";
import CreateButton from "../CreateButton";
import RecordFilter from "../RecordFilter";
import Select from "react-select";
import getServerUrl from "../../../Constants"

function Customers({
  triggerError,
  group_id,
  setViewType,
  setCustId
}) {
  const [inProgess, setInProgess] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [isCreateWindowOpen, setCreateWindowOpen] = useState(false);
  const [creationInProgress, setCreationInProgress] = useState(false);
  const [custName, setCustName] = useState("");
  const [custAddr, setCustAddr] = useState(null);
  const [custIdentifier, setCustIdentifier] = useState("");
  const [refCust, setRefCust] = useState({label:"None",value:null});
  const [filterState, toggleFilterState] = useState(true);
  const [Error400, setError400] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");
  useEffect(() => {
    async function getCustomers() {
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
          getServerUrl() + "finance/get_customers_list/" + group_id + "/",
          requestOptions
        );
        if (response.ok) {
          const data = await response.json();
          setCustomers(data);
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
    getCustomers();
  }, []);

  async function createCustomer() {
    setCreationInProgress(true);
    const postData = {
      name: custName,
      address: custAddr,
      identifier: custIdentifier,
      ref_cust: refCust.value,
      business_group: group_id,
    };

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + localStorage.getItem("token"),
      },
      body: JSON.stringify(postData),
    };
    try {
      const response = await fetch(
        getServerUrl() + "finance/customer/",
        requestOptions
      );
      if (response.ok) {
        const data = await response.json();
        setCustomers(customers.concat(data));
        setCreationInProgress(false);
        resetCreateForm();
        setError400(false)
        setCreateWindowOpen(false);
      } else if (response.status === 400) {
        setCreationInProgress(false);
        resetCreateForm();
        setError400(true);
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

  async function closeCustomer(cust_id) {
    setInProgess(true);
    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + localStorage.getItem("token"),
      },
      body: JSON.stringify({ business_group: group_id, operation: "CLOSE" }),
    };
    try {
      const response = await fetch(
        getServerUrl() + "finance/customer/" + cust_id + "/",
        requestOptions
      );
      if (response.ok) {
        const data = await response.json();
        customers.map((customer) => {
          if (customer.cust_id === cust_id) {
            customer.is_active = data.is_active;
          }
          return customer;
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

  async function activateCustomer(cust_id) {
    setInProgess(true);
    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + localStorage.getItem("token"),
      },
      body: JSON.stringify({ business_group: group_id, operation: "ACTIVE" }),
    };
    try {
      const response = await fetch(
        getServerUrl() + "finance/customer/" + cust_id + "/",
        requestOptions
      );
      if (response.ok) {
        const data = await response.json();
        customers.map((customer) => {
          if (customer.cust_id === cust_id) {
            customer.is_active = data.is_active;
          }
          return customer;
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

  function resetCreateForm() {
    setCustName("");
    setCustIdentifier("");
    setCustAddr(null);
    setRefCust({label:"None",value:null});
  }

  function createWindowValidation() {
    return custName.length > 0 && custIdentifier.length > 0;
  }

  function setAddrValue(e) {
    if (e.target.value.length > 0) setCustAddr(e.target.value);
    else setCustAddr(null);
  }

  function openCustomer(cust_id) {
    setViewType(3);
    setCustId(cust_id);
  }

  function renderCard(customer, index) {
    return (
      <div className="card border border-dark m-2" key={customer.cust_id}>
        <div className="float-left">
          <div
            style={{
              width: "85%",
              float: "left",
              marginLeft: "5px",
              marginTop: "auto",
              marginBottom: "auto",
            }}
          >
            <button
              className="btn btn-link p-0"
              onClick={(e) => openCustomer(customer.cust_id)}
            >
              <b>{customer.name.toUpperCase()}</b>
            </button>
            {" | " + customer.identifier.toUpperCase()}
          </div>
          <div style={{ width: "10%", float: "right" }}>
            {customer.is_active && (
              <button
                className="btn p-0 m-1 float-right"
                onClick={(e) => closeCustomer(customer.cust_id)}
              >
                <DoorClosed color="black" />
              </button>
            )}
            {!customer.is_active && (
              <button
                className="btn p-0 m-1 float-right"
                onClick={(e) => activateCustomer(customer.cust_id)}
              >
                <DoorOpen color="black" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  function compare(a, b) {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();

    let comparison = 0;
    if (nameA > nameB) {
      comparison = 1;
    } else if (nameA < nameB) {
      comparison = -1;
    }
    return comparison;
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

      <div
        style={{
          zIndex: 1,
          position: "fixed",
          width: "80%",
          top: "60px",
          marginLeft: "10%",
          marginRight: "10%",
        }}
      >
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            id="custSearch"
            placeholder="Search..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            autoComplete="off"
          />
        </div>
      </div>

      {isCreateWindowOpen && (
        <div
          style={{ zIndex: 1, position: "fixed", width: "100%", top: "20%" }}
        >
          <div className="m-3 bg-light p-3 border border-dark ">
            <div className="form-group">
              <input
                type="text"
                className="form-control mb-2"
                id="custName"
                placeholder="Enter New Customer Name"
                value={custName}
                onChange={(e) => setCustName(e.target.value)}
                required
                autoComplete="off"
              />
              <input
                type="text"
                className="form-control mb-2"
                id="custIdentifier"
                placeholder="Enter Identifier (Ex:-Village)"
                value={custIdentifier}
                onChange={(e) => setCustIdentifier(e.target.value)}
                required
                autoComplete="off"
              />
              <input
                type="text"
                className="form-control mb-2"
                id="custAddr"
                placeholder="Enter New Customer Address"
                onChange={(e) => setAddrValue(e)}
                autoComplete="off"
              />
              <Select
                placeholder="Select Reference Customer"
                value={refCust}
                options={[{ label: "None", value: null }].concat(
                  customers.map((customer) => {
                    return {
                      label: customer.name + " | " + customer.identifier,
                      value: customer.cust_id,
                    };
                  })
                )}
                onChange={obj => setRefCust(obj)}
              />
            </div>
            
            {Error400 && (
              <div style={{ color: "red", textSize: "smaller" }}>
                *combination of customer and identifier exists!
              </div>
            )}
            <button
              className="btn btn-primary m-2"
              onClick={createCustomer}
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
          height: "110px",
        }}
      />
      
      <div style={{ marginTop: "110px" }}>
        <div className="container">
          {customers
            .filter((customer) =>
              filterState ? customer.is_active : !customer.is_active
            )
            .filter((customer) =>
              customer.name.toLowerCase().startsWith(searchFilter.toLowerCase())
            )
            .sort(compare)
            .map((customer, index) => renderCard(customer, index))}
        </div>
      </div>
    </div>
  );
}

export default Customers;
