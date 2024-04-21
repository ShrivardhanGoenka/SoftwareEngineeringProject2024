import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

import getProfile from "../APICalls/getProfile";
import CarDetailsModal from "../Components/CarDetailsModal"

// CarDetails component is used to display the car details of the user
// The component fetches the car details of the user using the getProfile function
// The component displays the car details of the user
// The component allows the user to edit the car details by clicking on the "Edit" button
// The component opens a modal when the user clicks on the "Edit" button
// The modal allows the user to update the car details
// The modal will be closed when the user clicks on the "Update" button in the modal
// The modal will display the current car details of the user
// The user can update the car details and click on the "Update" button to save the changes
// The user will be redirected to the profile page after the changes are saved
const CarDetails = () => {
    const [profile, setProfile] = useState({});
    const [openModal, setOpenModal] = useState(false);

    useEffect(()=>{
        getProfile().then(result => setProfile(result))
    }, [])

    return (
        <div className="flex flex-col pb-2 mx-auto w-full h-dvh bg-violet-100">
            <div className="flex gap-5 mt-4 px-5 text-xl font-bold text-black whitespace-nowrap items-center">
                <Link to='/profile'>
                    <img
                        loading="lazy"
                        src="https://cdn4.iconfinder.com/data/icons/wirecons-free-vector-icons/32/back-alt-64.png"
                        className="shrink-0 w-6 aspect-square stroke-black"
                        alt="Back"
                    />
                </Link>
                <div className="text-center">Car Details</div>
            </div>
            <div className="flex flex-col mt-4 mx-4 p-4 px-3 py-3">
                <div className="text-left mt-8 px-3 py-3 font-base text-black bg-white rounded shadow-md">
                    <span className="font-bold">Car Licence:</span> {profile.carLicense ? profile.carLicense: "No licence plate"}
                </div>
                <div className="text-left mt-8 px-3 py-3 font-base text-black bg-white rounded shadow-md">
                    <span className="font-bold">Model:</span> {profile.carModel ? profile.carModel: "No car model"}
                </div>
                <div className="text-left mt-8 px-3 py-3 font-base text-black bg-white rounded shadow-md">
                    <span className="font-bold">Colour:</span> {profile.carColor ? profile.carColor: "No car color"}
                </div>
                {/* Edit Button */}
                <button
                    className='mt-8 py-2 px-4 text-blue-700 font-semibold hover:text-white bg-transparent hover:bg-indigo-500 border border-indigo-500 hover:border-transparent rounded'
                    onClick={() => {setOpenModal(true)}}
                >
                    Edit
                </button>
            </div>

                    
            {openModal && <CarDetailsModal profile={profile} openModal={setOpenModal}/>}

         </div>
    
    )
}

export default CarDetails;