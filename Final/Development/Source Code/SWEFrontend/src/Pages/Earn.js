import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'

import MapViewEarn from "../Components/MapViewEarn";
import RequestSelectorEarn from "../Components/RequestSelectorEarn";

import getStatusOfUser from '../APICalls/getStatus';
import confirmRide from "../APICalls/confirmRide";

// Earn component is used to confirm a ride request
// The component allows the user to select a ride request
// The component allows the user to confirm the ride request
// The component shows the map with the pickup location and destination location
// The component shows the options to select the ride request
// There is a polling mechanism to update the ride request status
// The component will show an error message if the user has an ongoing request
// The component will show an error message if the user is currently on a ride
// The component will redirect the user to the current request page if the user has an ongoing request
function Earn() {
    const navigate = useNavigate();
    const [location, setLocation] = useState(null);
    const [pickupLocation, setPickupLocation] = useState(null);
    const [toLocation, setToLocation] = useState(null);
    const [optionSelected, setOptionSelected] = useState(-1);

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

    useEffect(() => {
        console.log("Location changed")
        console.log(location);
    }, [location]);

    function submit(){
        if(optionSelected === -1){
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Please select an option.',
            });
            return;
        }

        confirmRide(optionSelected, location).then((data)=>{
            if(data){
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Ride confirmed',
                });
                navigate("/currentRide/responder");
            }
        });
    }

    return (
        <div>
            <MapViewEarn location={location} pickupLocation={pickupLocation} toLocation={toLocation} setLocation={setLocation}/>
            <RequestSelectorEarn location={location} setPickupLocation={setPickupLocation} setToLocation={setToLocation} optionSelected={optionSelected} setOptionSelected={setOptionSelected}/>
            {optionSelected!==-1 && <div className="flex justify-center w-full mt-3"><button onClick={submit} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Choose</button></div>}
        </div>
    );
}

export default Earn;