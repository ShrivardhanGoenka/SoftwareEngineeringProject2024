import React from 'react'
import url from "../jsondata/url.json"
import { useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from "react";
import ProfileModal from "../Components/ProfileModal";
import getProfile from "../APICalls/getProfile";
import fetchRating from "../APICalls/fetchRating";

// Profile component is used to display the profile page of the user
// The component fetches the profile details of the user using the getProfile function
// The component fetches the rating of the user using the fetchRating function
// The component displays the profile details of the user
// The component displays the name, phone number, email, and address of the user
// The component displays the wallet balance of the user
// The component displays the rating of the user as a requester and responder
// The component allows the user to edit the profile details
// The component allows the user to navigate to the wallet, car details, and history pages
function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState('')
  const [rating, setRating] = useState('')
  const [openModal, setOpenModal] = useState(false);
  
  const onLogout = () => {
    fetch(url.url + "/accounts/logout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem("auth-token")
        }, 
    }).then(response=>{
      localStorage.removeItem("auth-token");
      navigate('/')
    })

  }

  useEffect(() => {
    getProfile().then(result => setProfile(result));
    fetchRating().then(result => setRating(result)); // Fetch the rating when component mounts
  }, []);


  useEffect(()=>{
    console.log("profile: ", profile)
 }, [profile]);



  return (
    <div className="flex flex-col pb-2 mx-auto w-auto min-h-screen bg-violet-100">
      <div className="flex gap-5 mt-4 px-5 text-xl font-bold text-black whitespace-nowrap">
        <Link to='/'>
            <img
                loading="lazy"
                src="https://cdn4.iconfinder.com/data/icons/wirecons-free-vector-icons/32/back-alt-64.png"
                className="shrink-0 w-6 aspect-square stroke-black"
                alt="Back"
            />
          </Link>
          <div className="text-centre justify-centre">
            Profile
          </div>
      </div>
      
      <div className="flex flex-col mt-4 mx-4 p-4 px-3 py-3 bg-white rounded shadow-md">
        <div className="text-centre mt-2 font-base text-black">
          <span className="font-bold">Name:</span> {profile.name}
        </div>
        <div className="text-centre mt-2 font-base text-black">
        <span className="font-bold">Phone number:</span> {profile.phone}
        </div>
        <div className="text-centre mt-2 font-base text-black">
        <span className="font-bold">Email:</span> {profile.email}
        </div>
        <div className="text-centre mt-2 font-base text-black">
        <span className="font-bold">Address:</span> {profile.address}
        </div>
        {/* Edit Button */}
        <button
          className='mt-8 py-2 px-4 text-blue-700 font-semibold hover:text-white bg-transparent hover:bg-indigo-500 border border-indigo-500 hover:border-transparent rounded'
          onClick={() => {
            setOpenModal(true);
          }}
        >
          Edit
        </button>
        {openModal && <ProfileModal profile={profile} openModal={setOpenModal} />}
      </div>
      <div className="flex flex-col">
        <Link to='/wallet' state={{profile: profile}}>
          <div className="flex gap-5 mt-4 mx-4 px-3 py-3 justify-between items-start text-lg font-semibold bg-white border-t border-b shadow-md">
            <div className="flex gap-3 mt-1 text-lg text-black">
              <img
                loading="lazy"
                src="https://www.svgrepo.com/show/508285/card.svg"
                className="shrink-0 my-auto w-9 aspect-square"
                alt="card"
              />
              <div className="my-auto">My Wallet</div>
            </div>
            <div className="justify-center px-3.5 py-3 text-base text-white whitespace-nowrap bg-indigo-500 rounded-3xl">
              S$ {parseFloat(profile.wallet).toFixed(2)}
            </div>
          </div>
        </Link>
        <Link to='/cardetails'>
        <div className="flex gap-5 mx-4 px-3 py-3 justify-between items-start text-lg font-semibold text-black bg-white border-b shadow-md">
          <div className="flex gap-3 ">
            <img
            loading="lazy"
            src="https://cdn3.iconfinder.com/data/icons/okku-delivery/32/Delivery_Okku_Expand-14-64.png"
            className="shrink-0 my-auto w-8 aspect-square"
            alt="delivery img"
          />
          <div className="my-auto">Car Details</div>
          </div>
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/93405e3fa04e373054dbd831b302f94cf988c1056076741fca3e1dba307e1719?"
            className="shrink-0 my-auto w-6 aspect-square"
            alt="car details"
          />
        </div>
        </Link>
        <Link to='/profile/history'>
          <div className="flex gap-5 mx-4 px-3 py-3 justify-between items-start text-lg font-semibold text-black bg-white border-b shadow-md">
            <div className="flex gap-3">
              <img
              loading="lazy"
              src="https://cdn4.iconfinder.com/data/icons/zake-miscellaneous-007/64/history_orders_recent_transaction-64.png"
              className="shrink-0 my-auto w-8 aspect-square"
              alt="history"
            />
            <div className="my-auto">History</div>
            </div>
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/93405e3fa04e373054dbd831b302f94cf988c1056076741fca3e1dba307e1719?"
              className="shrink-0 my-auto w-6 aspect-square"
              alt="history"
            />
          </div>
        </Link>
        <div className="flex gap-5 mx-4 px-3 py-3 justify-between items-start text-lg font-semibold text-black bg-white border-b shadow-md">
          <div className="flex gap-3">
            <img
              loading="lazy"
              src="https://cdn1.iconfinder.com/data/icons/christmas-flat-4/58/020_-_Star-512.png"
              className="shrink-0 my-auto w-8 aspect-square"
              alt="Star"
            />
            <div className="my-auto">Rating as Customer</div>
          </div>
          {/* Display the rating using colored stars */}
          <div>
            {Array.from({ length: 5 }, (_, index) => (
              <span key={index} className={`text-4xl ${index <= rating.ratingAsRequester-1 ? 'text-yellow-500' : 'text-gray-400'}`}>★</span>
            ))}
          </div>
        </div>
        <div className="flex gap-5 mx-4 px-3 py-3 justify-between items-start text-lg font-semibold text-black bg-white border-b shadow-md">
          <div className="flex gap-3">
            <img
              loading="lazy"
              src="https://cdn1.iconfinder.com/data/icons/christmas-flat-4/58/020_-_Star-512.png"
              className="shrink-0 my-auto w-8 aspect-square"
              alt="Star"
            />
            <div className="my-auto">Rating as Driver</div>
          </div>
          {/* Display the rating using colored stars */}
          <div>
            {Array.from({ length: 5 }, (_, index) => (
              <span key={index} className={`text-4xl ${index <= rating.ratingAsResponder-1 ? 'text-yellow-500' : 'text-gray-400'}`}>★</span>
            ))}
          </div>
        </div>
        <button onClick={onLogout} className='mt-4 mx-4 mb-6 text-blue-700 font-semibold hover:text-white py-2 px-4 bg-transparent hover:bg-indigo-500 border border-indigo-500 hover:border-transparent rounded shadow-md'>Log out</button>
      </div>
    </div>
  )
}

export default Profile