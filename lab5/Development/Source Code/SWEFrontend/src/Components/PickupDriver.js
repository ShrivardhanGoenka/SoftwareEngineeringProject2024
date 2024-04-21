import { useState,useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from 'sweetalert2'

import getCurrentRideInfo from "../APICalls/getCurrentRideInfo";
import postCurrentRideInfo from "../APICalls/postCurrentRideInfo";
import confirmPickup from "../APICalls/confirmPickup";

import { GoogleMap, DirectionsRenderer, MarkerF } from "@react-google-maps/api";

// This component is used to display the map view for the driver to see the route from the current location to the pickup location
// @returns JSX
// The function uses the GoogleMap component from @react-google-maps/api to display the map. It also uses the MarkerF component to display markers and the DirectionsRenderer component to display the route
// The function fetches the current ride information using the getCurrentRideInfo function
// The function updates the driver's location and the route when the current ride information is available
// If the current location is not available, it displays the pickup location marker
// The function provides a button to confirm the pickup
// The function reloads the page when the pickup is confirmed to load the onRouteDriver component
function PickupDriver(){
    const [rideDetails, setRideDetails] = useState(null);
    const [directions, setDirections] = useState(null);
    const [isLocationAvailable, setIsLocationAvailable] = useState(false);

    useEffect(() => {
        getCurrentRideInfo().then((data)=>{
            if(data.status === "success"){
                setRideDetails(data.data);
            }
        });
    }, []);

    useEffect(() => {
        let isPollingAllowed = true; 

        function getCurrentLocation () {
            if (!rideDetails) return;
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    setIsLocationAvailable(true);
                    const location = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    postCurrentRideInfo(location);
                    const directionsService = new window.google.maps.DirectionsService();
                    directionsService.route(
                        {
                            origin: location,
                            destination: { lat: rideDetails.pickup_latitude, lng: rideDetails.pickup_longitude },
                            travelMode: window.google.maps.TravelMode.DRIVING,
                        },
                        (result, status) => {
                            if (status === window.google.maps.DirectionsStatus.OK) {
                                setDirections(result);
                            } else {
                                console.error(`error fetching directions ${result}`);
                            }
                        }
                    );

                }, (error) => {
                    setIsLocationAvailable(false);
                });
            } else {
                setIsLocationAvailable(false);
            }
        }

        const startPolling = () => {
            const pollingInterval = setInterval(async () => {
                if (!isPollingAllowed) {
                    clearInterval(pollingInterval);
                    return;
                }
                getCurrentLocation();
            }, 5000);
        };

        startPolling();
        getCurrentLocation();

        return () => {
            isPollingAllowed = false;
        };

    }, [rideDetails]);

    function confirmPickupHandler(){
        confirmPickup().then((data)=>{
            if(data === true){
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Pickup confirmed',
                });
                window.location.reload();
            }
        });
    }

    return (
        <div className="w-[100vw]">
            <div style={{ position: 'relative', width: '100vw', height: '70vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <GoogleMap center={{ lat: 1.363366, lng: 103.824426 }} zoom={10.5} mapContainerStyle={{ width: "100%", height: "100%", borderRadius: '0 0'}}
                    options={{
                        fullscreenControl: false,
                        streetViewControl: false,
                        mapTypeControl: false,
                        zoomControl: false
                    }}
                >
                    {isLocationAvailable && <DirectionsRenderer directions={directions} />}
                    {!isLocationAvailable && rideDetails && <MarkerF position={{ lat: rideDetails.pickup_latitude, lng: rideDetails.pickup_longitude }} />}
                </GoogleMap>
                

                <div style={{ position: 'absolute', top: 20, left: 10, zIndex: 1, display: 'flex', padding: '3px', width:'100%' }}>
                    <div className="flex flex-row w-[93vw] bg-white items-center rounded-3xl border-[2px]">
                        <Link to='/' className="ml-3">
                            <img
                                loading="lazy"
                                src="https://cdn4.iconfinder.com/data/icons/wirecons-free-vector-icons/32/back-alt-64.png"
                                className="shrink-0 w-6 aspect-square stroke-black"
                                alt="Back"
                            />
                        </Link>
                        <div className="text-black py-2 ml-3 text-xl">Current Ride</div>
                    </div>
                </div>
            </div>

            <div className="flex justify-center w-full mt-3">
                <button onClick={confirmPickupHandler} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Confirm Pickup</button>
            </div>
            
            <div className="mx-3">
                <div className="mt-4 w-full max-w-md bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="px-6 py-4">
                        <div className="text-xl font-bold mb-2">Ride Details</div>
                        <div className="mb-2">
                            <span className="font-semibold">From:</span> {rideDetails && rideDetails.pickup_place_name}
                        </div>
                        <div className="mb-2">
                            <span className="font-semibold">To:</span> {rideDetails && rideDetails.end_place_name}
                        </div>
                        <div className="mb-2">
                            <span className="font-semibold">Service:</span> {rideDetails && rideDetails.service_type}
                        </div>
                        <div className="mb-2">
                            <span className="font-semibold">Transaction Amount:</span> ${rideDetails && rideDetails.transaction_amount}
                        </div>
                        <div className="mb-2">
                            <span className="font-semibold">Customer Name:</span> {rideDetails && rideDetails.requster_name}
                        </div>
                        <div className="mb-2">
                            <span className="font-semibold">Instructions:</span> {rideDetails && rideDetails.requester_text}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default PickupDriver;