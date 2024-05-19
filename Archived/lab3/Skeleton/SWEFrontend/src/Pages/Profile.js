import React from 'react'
import url from "../jsondata/url.json"
import { useNavigate } from 'react-router-dom';


function Profile() {
  const navigate = useNavigate();

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
  return (
    <>
    <h1>Here is Profile</h1>
    <button onClick={onLogout} className='bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded'>log out</button>
    </>
  )
}

export default Profile