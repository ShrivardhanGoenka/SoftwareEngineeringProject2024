import React from 'react'
import { useState } from "react";
import postProfile from "../APICalls/postProfile"

// Modal to allow the users to update their profile details.
// The modal will be opened when the user clicks on the "Update Profile" button in the profile page.
// The modal will be closed when the user clicks on the "Update" button in the modal.
// The modal will display the current profile details of the user.
// The user can update the profile details and click on the "Update" button to save the changes.
// The user will be redirected to the profile page after the changes are saved.
// The user will be shown a success message if the changes are saved successfully.
// The user will be shown an error message if the changes are not saved successfully.
// @params profile - the current profile details of the user
// @params openModal - function to open or close the modal
// @returns JSX
export default function ProfileModal({profile, openModal}) {
    const [name, setName] = useState(profile.name);
    const [phone, setPhone] = useState(profile.phone);
    const [address, setAddress] = useState(profile.address);

    async function updateProfile(){
        if (!name | !phone | !address){
            alert("Need to fill in all entries to update")
            return null;
        }
        const body = {
            name: name,
            phone: phone,
            address: address,
            email: profile.email,
            licence: profile.carLicense,
            carModel: profile.carModel,
            carColor: profile.carColor,
            hasCar: profile.hasCar,
        }
        await postProfile(body);
        openModal(false);
        window.location.reload();
    }

    return(
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-80">
        <div className="bg-white dark:bg-gray-800">
        <div class="relative w-full max-w-2xl h-full md:h-auto">
       
        <div class="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
          
            <div class="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                    Update Profile Details
                </h3>
                <button onClick={()=> openModal(false)}type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="updateProductModal">
                    <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                    <span class="sr-only">Close modal</span>
                </button>
            </div>
            
            <form >
                <div class="grid gap-4 mb-4 sm:grid-cols-2">
                    <div>
                        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                        <input type="text" name="name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" value={name} onChange={(event)=> setName(event.target.value)}/>
                    </div>
                    <div>
                        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone</label>
                        <input type="text" name="phone" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" value={phone} onChange={(event)=> setPhone(event.target.value)}/>
                    </div>
              
                    <div>
                        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Address</label>
                        <input type="text" name="address" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" value={address} onChange={(event)=> setAddress(event.target.value)}/>
                    </div>
                </div>
                <div class="flex items-center space-x-4">
            
                    <button onClick={updateProfile} type="button" class="text-red-600 inline-flex items-center hover:text-white border border-red-600 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900">
                        Update
                    </button>
                </div>
            </form>
            </div>
    </div>
    </div>
    </div>
    )
}