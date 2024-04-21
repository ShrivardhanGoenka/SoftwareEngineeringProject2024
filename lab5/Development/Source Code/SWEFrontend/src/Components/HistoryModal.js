import React from 'react'
import { format } from 'date-fns';

// HistoryModal component is used to display the details of a ride history
// The modal will be opened when the user clicks on a history item in the history page
// The modal will be closed when the user clicks on the "Close" button in the modal
// The modal will display the details of the ride history
// The details include the service type, transaction amount, pickup location, end location, responder, requester, responder rating, requester rating, accepted time, picked up time, completed time, distance, and duration
export default function HistoryModal({openModal, value}) {

    return(
        <div class="relative z-10 " aria-labelledby="modal-title" role="dialog" aria-modal="true">

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