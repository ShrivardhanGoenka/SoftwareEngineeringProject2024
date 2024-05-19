import React from 'react';
import tw from 'tailwind-styled-components';
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";

import getStatusOfUser from '../APICalls/getStatus';
import requestService from '../APICalls/requestService';
import StartStopSearch from '../Components/StartStop';

import TopBackButton from '../UIComponents/TopBackButton';

import Swal from 'sweetalert2';

const Delivery = () => {

    const [fromLocation, setFromLocation] = useState(null);
    const [toLocation, setToLocation] = useState(null);
    const [markers, setMarkers] = useState([]);

    const [instructions, setInstructions] = useState('');
    const [price, setPrice] = useState(0);

    const navigate = useNavigate();

    useEffect(()=>{
        getStatusOfUser().then((data)=>{
            console.log(data)
            if(data.status === 'request'){
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'You have an ongoing request.',
                });
                navigate("/currentRequest")
            }
            else if (data.status === 'active_requester'){
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'You are currently on a ride.',
                });
                navigate("/currentRide/requester")
            }
            else if (data.status === 'active_responder'){
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'You are currently on a ride.',
                });
                navigate("/currentRide/responder")
            }
        })
    }, []);

    function onSubmit(){
        if(!fromLocation || !toLocation){
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Please enter both start and destination locations.',
              });
            return;
        }

        if(!instructions){
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Please enter instructions.',
              });
            return;
        }

        if(price <= 0){
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Please enter a valid price.',
              });
            return;
        }

        requestService(fromLocation, toLocation, instructions, price, "delivery").then((data)=>{
            if(data.status === 1){
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Request submitted successfully.',
                  });
                navigate("/currentRequest")
            }else{
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: data.error,
                  });
            }
        });
    }

    return (
        <div>
            <TopBackButton header='Delivery' />

            <StartStopSearch 
                fromLocation={fromLocation}
                setFromLocation={setFromLocation}
                toLocation={toLocation}
                setToLocation={setToLocation}
                markers={markers}
                setMarkers={setMarkers}
            />

            <div className='w-full px-3'>
                <input 
                    type='number' 
                    className='w-full rounded-lg p-2 my-2 border-2 border-gray-300' 
                    placeholder='Enter Price' 
                    onChange={(e)=>setPrice(e.target.value)}
                />

                <textarea 
                    className='w-full rounded-lg p-2 my-2 border-2 border-gray-300' 
                    placeholder='Enter Instructions' 
                    onChange={(e)=>setInstructions(e.target.value)}
                />
            </div>
            
            <div className='w-full flex justify-center'><button className='bg-green-500 py-3 px-9 rounded-full' onClick={onSubmit} >Request</button></div>
        </div>
    );


}

export default Delivery;