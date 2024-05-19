import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import getProfile from "../APICalls/getProfile";
import CarDetailsModal from "../Components/CarDetailsModal"
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
                    Car License: {profile.carLicense ? profile.carLicense: "No license plate"}
                </div>
                <div className="text-left mt-8 px-3 py-3 font-base text-black bg-white rounded shadow-md">
                    Model: {profile.carModel ? profile.carModel: "No car model"}
                </div>
                <div className="text-left mt-8 px-3 py-3 font-base text-black bg-white rounded shadow-md">
                    Colour: {profile.carColor ? profile.carColor: "No car color"}
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