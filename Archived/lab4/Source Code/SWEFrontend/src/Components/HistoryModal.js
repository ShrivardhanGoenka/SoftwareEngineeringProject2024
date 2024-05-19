import React from 'react'
import { useState, useEffect } from "react";
import url from "../jsondata/url.json"
import { format } from 'date-fns';

export default function HistoryModal({openModal, value}) {

    return(
        <div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">

  <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

  <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
    <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">

      <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
        <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
      
            <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
              <h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">History Details</h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500"><span className="font-semibold">Service Type:</span> {value.service_type}</p>
                <p class="text-sm text-gray-500"><span className="font-semibold">Transaction Amount:</span> S$ {value.transaction_amount}</p>
                <p class="text-sm text-gray-500"><span className="font-semibold">From:</span> {value.pickup_place_name}</p>
                <p class="text-sm text-gray-500"><span className="font-semibold">To:</span> {value.end_place_name}</p>
                <p class="text-sm text-gray-500"><span className="font-semibold">Responder:</span> {value.responder}</p>
                <p class="text-sm text-gray-500"><span className="font-semibold">Requester:</span> {value.requester}</p>
                <p class="text-sm text-gray-500"><span className="font-semibold">Responder rating:</span> {value.responder_rating}</p>
                <p class="text-sm text-gray-500"><span className="font-semibold">Requester rating:</span> {value.requester_rating}</p>
                <p class="text-sm text-gray-500"><span className="font-semibold">Accepted time:</span> {format(new Date(value.time_accepted), 'MMMM dd, yyyy hh:mm a')}</p>
                <p class="text-sm text-gray-500"><span className="font-semibold">Picked Up time:</span> {format(new Date(value.time_pickup), 'MMMM dd, yyyy hh:mm a')}</p>
                <p class="text-sm text-gray-500"><span className="font-semibold">Completed time:</span> {format(new Date(value.time_completed), 'MMMM dd, yyyy hh:mm a')}</p>
                <p class="text-sm text-gray-500"><span className="font-semibold">Distance</span> {value.distance} km</p>
                <p class="text-sm text-gray-500"><span className="font-semibold">Duration:</span> {value.duration} min</p>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
          <button type="button" class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto" onClick={()=> openModal(false)}>Close</button>
        </div>
      </div>
    </div>
  </div>
</div>
    )
}

//data.append({'requester':i.requester.username,'responder':i.responder.username,'requester_rating':i.requester_rating,'responder_rating':i.responder_rating,'feedback_to_driver':i.feedback_to_driver,'feedback_to_requester':i.feedback_to_requester,'transaction_amount':i.transaction_amount,'service_type':i.service_type,'time_started':i.time_started,'time_accepted':i.time_accepted,'time_pickup':i.time_pickup,'time_completed':i.time_completed,'time_finalised':i.time_finalised,'pickup_latitude':i.pickup_latitude,'pickup_longitude':i.pickup_longitude,'pickup_place_name':i.pickup_place_name,'end_latitude':i.end_latitude,'end_longitude':i.end_longitude,'end_place_name':i.end_place_name,'distance':i.distance,'duration':i.duration})