import React from 'react'
import { useState, useEffect } from "react";
import { format } from 'date-fns';
import HistoryModal from "../Components/HistoryModal"
import { Link } from "react-router-dom";
import car_icon from "../images/car_icon.png";
import motor_icon from "../images/motor_icon.svg";
import getServiceHistory from "../APICalls/getServiceHistory";

// History component is used to display the service history of the user
// The component fetches the service history of the user using the getServiceHistory function
// The component displays the service history of the user
// The component allows the user to view the history of requests and responses
// The history is displayed in a list format
// Each history item displays the service type, pickup location, destination location, transaction amount, and time completed
// On clicking a history item, the user can view the details of the service
// The component opens the history model to display the details of the service
export default function History() {
   const [history, setHistory] = useState(null);
   const [type, setType] = useState(0); // [0: requester, 1: responder]
   const [openModal, setOpenModal] = useState(false);
   const [modalValue, setModalValue] = useState({});

   useEffect(()=>{
       getServiceHistory().then(result=> setHistory(result))       
   }, []);

    useEffect(()=>{
        console.log("History: ", history)
    }, [history])

   return (
    <>
    <div className="flex flex-col pb-2 mx-auto w-full min-h-svh bg-violet-100 ">
        
        <div className="flex gap-5 mt-4 px-5 text-xl font-bold text-black whitespace-nowrap items-center">
            <Link to='/profile'>
                <img
                    loading="lazy"
                    src="https://cdn4.iconfinder.com/data/icons/wirecons-free-vector-icons/32/back-alt-64.png"
                    className="shrink-0 w-6 aspect-square stroke-black"
                    alt="Back"
                />
            </Link>
            <div className="text-center">History</div>
        </div>
        <div className="flex justify-evenly py-4 w-full">

            {
                type === 0 ? 
                <button className="linear rounded-[20px] bg-zinc-200 px-4 py-2 text-base font-medium text-blue-700 hover:bg-gray-300 " onClick = {()=> setType(0)}>
                    Requester
                </button> 
                :
                <button className="linear rounded-[20px] bg-zinc-100 px-4 py-2 text-base font-medium text-blue-700  hover:bg-gray-300 " onClick = {()=> setType(0)}>
                    Requester
                </button>
            }
            {
                type === 1?
                <button className= "linear rounded-[20px] bg-zinc-200 px-4 py-2 text-base font-medium text-blue-700 transition duration-200 hover:bg-gray-300" onClick = {()=> setType(1)}>
                    Responder
                </button>
                :
                <button className= "linear rounded-[20px] bg-zinc-100 px-4 py-2 text-base font-medium text-blue-700 transition duration-200 hover:bg-gray-300" onClick = {()=> setType(1)}>
                    Responder
                </button>
            }
            
      
        </div>

        <br/>
        
        {!history && <div className="flex justify-center items-center h-[50vh]">loading...</div>}

        {openModal && <HistoryModal openModal={setOpenModal} value={modalValue}/>}

        {history && history.length === 0 && <div className="flex justify-center items-center h-[50vh]">No history found</div>}

        {history && history.map((hist, index) => (
            hist.type === type &&(
            <div key={index} className="flex mx-4 mb-2 items-start justify-between rounded-md border-[1px] border-[transparent] dark:hover:border-white/20 bg-white px-3 py-[20px] transition-all duration-150 hover:border-gray-200 dark:!bg-navy-800 dark:hover:!bg-navy-700" onClick={()=> {setModalValue(hist); setOpenModal(true)}}>
                <div className="flex items-center gap-3">
                    <div class="flex h-16 w-24 items-center justify-center">
                        <img
                            class="h-3/5 rounded-xl"
                            src={hist.service_type === "delivery" ? motor_icon : car_icon}
                            alt=""
                        />
                    </div>
                    <div class="flex flex-col">
                        <h5 class="text-base font-bold text-navy-700">
                            {hist.service_type}
                        </h5>
                        <p class="mt-1 text-xs font-normal text-gray-600">
                            {hist.pickup_place_name} to {hist.end_place_name}
                        </p>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center text-navy-700  min-h-full pt-2">
                    <div class="ml-1 flex items-center text-sm font-bold text-navy-700">
                        <p>S$ {hist.transaction_amount}</p>
                    </div>
                    <div class="ml-2 flex items-center text-xs font-normal text-gray-600 ">
                        <p>{format(new Date(hist.time_completed), 'MMMM dd, yyyy hh:mm a')}</p>
                    </div>
                </div>
            </div>
        )))}

        
        
    </div>
</>
        )};

