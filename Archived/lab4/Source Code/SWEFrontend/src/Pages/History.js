import React from 'react'
import { useState, useEffect } from "react";
import url from "../jsondata/url.json"
import { format } from 'date-fns';
import HistoryModal from "../Components/HistoryModal"
import { Link } from "react-router-dom";

export default function History() {


   const [history, setHistory] = useState(null);
   const [type, setType] = useState(0); // [0: requester, 1: responder]
   const [openModal, setOpenModal] = useState(false);
   const [modalValue, setModalValue] = useState({});

   // data=[]
   // for i in history:
   //     data.append({'requester':i.requester.username,'responder':i.responder.username,'requester_rating':i.requester_rating,'responder_rating':i.responder_rating,'feedback_to_driver':i.feedback_to_driver,'feedback_to_requester':i.feedback_to_requester,'transaction_amount':i.transaction_amount,'service_type':i.service_type,'time_started':i.time_started,'time_accepted':i.time_accepted,'time_pickup':i.time_pickup,'time_completed':i.time_completed,'time_finalised':i.time_finalised,'pickup_latitude':i.pickup_latitude,'pickup_longitude':i.pickup_longitude,'pickup_place_name':i.pickup_place_name,'end_latitude':i.end_latitude,'end_longitude':i.end_longitude,'end_place_name':i.end_place_name,'distance':i.distance,'duration':i.duration})
   // return JsonResponse(data,status=200, safe=False)
   useEffect(()=>{
       fetch(url.url + "accounts/servicehistory", {
           headers: {
               "Content-Type": "application/json",
               "Authorization": localStorage.getItem("auth-token")
           },
       })
       .then(response => {
           if(!response.ok){
               //alert("No response history found")
               throw new Error('No response history found');
           }
           return response;
       })
       .then(response => {
            return response.json()
        })
       .then(response => {
           setHistory(response);
       })
       .catch(error=>{
           console.log(error)
       })
       
       
   }, []);

    useEffect(()=>{
        console.log("History: ", history)
    }, [history])

   return (
    <>
    <div className="flex flex-col pb-2 mx-auto w-full h-dvh bg-violet-100 ">
        
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
            <button className="linear rounded-[20px] bg-zinc-100 px-4 py-2 text-base font-medium text-blue-700 transition duration-200 hover:bg-gray-300 active:bg-gray-300" onClick = {()=> setType(0)}>
                Requester
            </button>
            <button className="linear rounded-[20px] bg-zinc-100 px-4 py-2 text-base font-medium text-blue-700 transition duration-200 hover:bg-gray-300 active:bg-gray-300" onClick = {()=> setType(1)}>
                Responder
            </button>
      
        </div>

        <br/>
        
        {!history && <div className="flex justify-center items-center h-[50vh]">loading...</div>}

        {history && history.length === 0 && <div className="flex justify-center items-center h-[50vh]">No history found</div>}

        {history && history.map((hist, index) => (
            hist.type === type &&(
            <div key={index} className="flex mx-4 items-start justify-between rounded-md border-[1px] border-[transparent] dark:hover:border-white/20 bg-white px-3 py-[20px] transition-all duration-150 hover:border-gray-200 dark:!bg-navy-800 dark:hover:!bg-navy-700" onClick={()=> {setModalValue(hist); setOpenModal(true)}}>
            <div className="flex items-center gap-3">
                <div class="flex h-16 w-16 items-center justify-center">
                    <img
                        class="h-full w-full rounded-xl"
                        src="https://www.svgrepo.com/download/408291/car-white.svg"
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
            <div className="flex flex-col items-center justify-center text-navy-700  h-full">
                <div class="ml-1 flex items-center text-sm font-bold text-navy-700">
                    <p>S$ {hist.transaction_amount}</p>
                </div>
                <div class="ml-2 flex items-center text-xs font-normal text-gray-600 ">
                    <p>{format(new Date(hist.time_completed), 'MMMM dd, yyyy hh:mm a')}</p>
                </div>
            </div>
        </div>
        )))}

        {openModal && <HistoryModal openModal={setOpenModal} value={modalValue}/>}
        
    </div>
</>
        )};

