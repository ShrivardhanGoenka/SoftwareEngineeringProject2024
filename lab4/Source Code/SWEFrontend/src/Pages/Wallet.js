import React from "react";
import url from "../jsondata/url.json";
import {
  Link,
  useActionData,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useState, useEffect } from "react";
import getWalletHistory from "../APICalls/getWalletHistory";
import { format } from 'date-fns';

const Wallet = () => {
  const location = useLocation();
  const [profile, setProfile] = useState("");
  const [action, setAction] = useState("");
  const [changeAmount, setChangeAmount] = useState(0);
  const [history, setHistory] = useState([]);
  useEffect(() => {
    getWalletHistory().then(result => setHistory(result));
  }, []);

  useEffect(() => {
    console.log("History: ", history);
  }, [history]);

  useEffect(() => {
    getProfile();
  }, []);

  async function getProfile() {
    const response = await fetch(url.url + "accounts/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("auth-token"),
      },
    });

    if (!response.ok) {
      const res = response.json();
      alert(response.error);
    }

    const res = await response.json();
    console.log("res: ", res);
    setProfile(res);
  }

  useEffect(() => {
    if (location.state && location.state.profile) {
      setProfile(location.state.profile);
      console.log(location.state.profile);
    }
  }, [location.state]);

  async function changeBalance() {
    if (action == "") {
      alert("Select Top up or Withdraw");
      return null;
    }

    if (Number.isNaN(Number(changeAmount))) {
      alert("Input is not a number");
      return null;
    }

    const body = {
      amount: changeAmount,
      action: action,
    };

    try {
      const response = await fetch(url.url + "accounts/wallet/action", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("auth-token"),
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const res = await response.json();
        alert(res.json());
        return null;
      }

      const res = await response.json();
      alert(res.success);
      getProfile();
      getWalletHistory().then(result => setHistory(result));
    } catch (err) {
      alert("unexpected topup failed");
      alert(err);
    }
  }

  return (
    <div className="flex flex-col pb-2 mx-auto w-full h-dvh bg-violet-100">

      <div className="flex gap-5 mt-4 px-5 text-xl font-bold text-black whitespace-nowrap items-center">
        <Link to="/profile">
          <img
            loading="lazy"
            src="https://cdn4.iconfinder.com/data/icons/wirecons-free-vector-icons/32/back-alt-64.png"
            className="shrink-0 w-6 aspect-square stroke-black"
            alt="Back"
          />
        </Link>
        <div className="text-center">Wallet</div>
      </div>
      <div className="flex flex-col items-center mt-8 px-5 font-medium text-black">
        <div className="text-base">Available Balance</div>
        <div className="mt-5 text-xl">
          Amount: ${parseFloat(profile.wallet).toFixed(2)}
        </div>
      </div>
      <div className="flex gap-5 justify-center mt-8 text-lg font-semibold whitespace-nowrap">
        <Button
          onClick={() => {
            setAction("topup");
          }}
          action={action}
          type="add"
        />
        <Button
          onClick={() => setAction("withdraw")}
          action={action}
          type="withdraw"
        />
      </div>
      <div className="flex sm:flex-row gap-5 justify-between px-3 pt-3.5 pb-6 mt-10 w-full text-sm text-black bg-white border-t border-b border-black border-solid">
        <div className="flex flex-col flex-1 justify-center">
          <div>Details of Transaction</div>
        </div>
        <div className="text-right">
          <p className="pr-2 font-medium">Amount </p>
          <input
            onChange={(event) => {
              setChangeAmount(event.target.value);
            }}
            placeholder="S$"
            className="h-10 bg-gray-200 my-2 rounded-2 p-2 outline-none border-none w-2/5"
          />
        </div>
      </div>

      <div className="mt-4 p-4 w-full flex items-center justify-center">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-3/5"
          onClick={changeBalance}
        >
          {" "}
          Confirm{" "}
        </button>
      </div>
      {history && history.map((hist, index) => (
  <div
    key={index}
    className="flex mx-4 items-start justify-between rounded-md border-[1px] border-[transparent] dark:hover:border-white/20 bg-white px-3 py-[20px] transition-all duration-150 hover:border-gray-200 dark:!bg-navy-800 dark:hover:!bg-navy-700"
  >

    <div className="flex flex-1 items-center gap-3">
      <div className="flex h-16 w-16 items-center justify-center">
        <img
          className="h-full w-full rounded-xl"
          src="https://www.svgrepo.com/show/520850/money-bag.svg"
          alt=""
        />
      </div>
      <div className="flex flex-col flex-1">
        <p className="text-xs text-gray-600 font-bold">
          {hist.action === "topup" 
  ? "Top Up" 
  : (
      hist.action === "withdraw"
        ? "Withdraw" 
        : (
            hist.action === "deduction"
              ? "Deduction" 
              : (
                  hist.action === "addition"
                    ? "Addition" 
                    : "unknown"
                )
          )
    )
}
        </p>
        <p className="text-xs font-normal text-gray-600">
            {format(new Date(hist.date), 'MMMM dd, yyyy hh:mm a')}
        </p>
      </div>
      <div className="flex items-center justify-center text-navy-700 dark:text-black">
      <p className="text-sm font-bold">
        S$ {hist.amount}
      </p>
    </div>
    </div>



  </div>
))}
    </div>

  );
};

export default Wallet;

const Button = ({ onClick, action, type }) => {
  return (
    <>
      {type == "add" && (
        <button
          className={`px-8 py-4 text-white bg-indigo-500 rounded-md shadow-md ${
            action == "topup" ? "border border-green-500 border-4" : ""
          }`}
          onClick={onClick}
        >
          Add
        </button>
      )}
      {type == "withdraw" && (
        <button
          className={`px-8 py-4 text-white bg-indigo-500 rounded-md shadow-md ${
            action == "withdraw" ? "border border-red-500 border-4" : ""
          }`}
          onClick={onClick}
        >
          Withdraw
        </button>
      )}
    </>
  );
};
