import React from 'react';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import getStatusOfUser from '../APICalls/getStatus';
import requestService from '../APICalls/requestService';
import StartStopSearch from '../Components/StartStop';
import PriceInstruction from '../Components/PriceInstruction';

import TopBackButton from '../UIComponents/TopBackButton';
import Swal from 'sweetalert2';

// Delivery component is used to request a delivery service
// The component allows the user to enter the start and destination locations
// The component allows the user to enter the instructions for the delivery
// The component allows the user to enter the price for the delivery
// The component allows the user to submit the delivery request
// The component will show an error message if the user does not enter the start and destination locations
// The component will show an error message if the user does not enter the instructions
// On successful submission of the delivery request, the user will be redirected to the current request page
const Delivery = () => {

    const [fromLocation, setFromLocation] = useState(null);
    const [toLocation, setToLocation] = useState(null);
    const [markers, setMarkers] = useState([]);

    const [instructions, setInstructions] = useState('');
    const [price, setPrice] = useState(0);

    const navigate = useNavigate();

    useEffect(()=>{
        getStatusOfUser().then((data)=>{
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
        <div className="">
            <TopBackButton header='Delivery' />

            <StartStopSearch 
                fromLocation={fromLocation}
                setFromLocation={setFromLocation}
                toLocation={toLocation}
                setToLocation={setToLocation}
                markers={markers}
                setMarkers={setMarkers}
            />

            <PriceInstruction setPrice={setPrice} setInstructions={setInstructions}/>

            <div className='w-full flex justify-center mt-2 mb-5'><button className='bg-green-500 py-3 px-9 rounded-full' onClick={onSubmit} >Request</button></div>
        </div>
    );


}

export default Delivery;