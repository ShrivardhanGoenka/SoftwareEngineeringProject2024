import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import getCurrentRequestInfo from "../APICalls/getCurrentRequestInfo";
import getRequesterUpdates from "../APICalls/getRequesterUpdates";
import cancelRequest from "../APICalls/cancelRequest";
import Swal from 'sweetalert2'
import { GoogleMap, DirectionsRenderer } from "@react-google-maps/api";

function CurrentRequest() {
    const navigate = useNavigate();
    const [currentRequest, setCurrentRequest] = useState({});
    const [directions, setDirections] = useState(null);

    useEffect(() => {
        let isPollingAllowed = true; // Flag to control polling

        async function fetchData() {
            const data = await getCurrentRequestInfo();
            if (data.status === "success") {
                setCurrentRequest(data.data);

                // find directions
                const directionsService = new window.google.maps.DirectionsService();

                const origin = { lat: data.data.pickup_latitude, lng: data.data.pickup_longitude };
                const destination = { lat: data.data.end_latitude, lng: data.data.end_longitude };

                directionsService.route(
                    {
                        origin: origin,
                        destination: destination,
                        travelMode: window.google.maps.TravelMode.DRIVING,
                    },
                    (result, status) => {
                        if (status === window.google.maps.DirectionsStatus.OK) {
                            console.log(result);
                            setDirections(result);
                        } else {
                            console.error(`error fetching directions ${result}`);
                        }
                    }
                );

                startPolling();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: "You do not have any ongoing requests."
                });
                navigate("/");
            }
        }

        const startPolling = () => {
            const pollingInterval = setInterval(async () => {
                if (!isPollingAllowed) {
                    clearInterval(pollingInterval);
                    return;
                }

                let updates = await getRequesterUpdates();
                    updates = updates.status;
                    if (updates !== "Awaiting driver"){
                        Swal.fire({
                            title: "Driver Accepted",
                            icon: "success", 
                            title: "Driver has accepted your request."
                        });
                        navigate("/currentRide/requester");
                    }
            }, 5000);
        };

        fetchData();

        return () => {
            isPollingAllowed = false;
        };
    }, []);

    async function cancelRequestButton() {
        const response = await cancelRequest();
        if (response) {
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Request cancelled',
            });
            navigate("/");
        }
    }

    return (
        <div>

            <div style={{ position: 'relative', width: '100%', height: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <GoogleMap center={{ lat: 1.363366, lng: 103.824426 }} zoom={10.5} mapContainerStyle={{ width: "100%", height: "100%", borderRadius: '0 0'}}
                    options={{
                        fullscreenControl: false,
                        streetViewControl: false,
                        mapTypeControl: false,
                        zoomControl: false
                    }}
                >
                    {directions && <DirectionsRenderer directions={directions} />}
                </GoogleMap>
        
                <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', borderRadius: '1000px', padding: '7px' }}>
                    <Link to='/'>
                        <img
                            loading="lazy"
                            src="https://cdn4.iconfinder.com/data/icons/wirecons-free-vector-icons/32/back-alt-64.png"
                            className="shrink-0 w-6 aspect-square stroke-black"
                            alt="Back"
                        />
                    </Link>
                </div>
            </div>

            <div className="flex items-center w-full justify-center my-2 font-sans text-xl">Awaiting Acceptance</div>
            
            <div className="flex ml-3">
                <div className="font-bold mr-2">From: </div>
                <div>{currentRequest.pickup_place_name}</div>
            </div>

            <div className="flex ml-3">
                <div className="font-bold mr-2">To: </div>
                <div>{currentRequest.end_place_name}</div>
            </div>

            <div className="flex ml-3">
                <div className="font-bold mr-2">Price: </div>
                <div>${currentRequest.transaction_amount}</div>
            </div>

            <div className="flex ml-3">
                <div className="font-bold mr-2">Service Type: </div>
                <div>{currentRequest.service_type}</div>
            </div>

            <div className="flex ml-3">
                <div className="font-bold mr-2">Instructions: </div>
                <div>{currentRequest.requester_text}</div>
            </div>

            <div className="flex ml-3">
                <div className="font-bold mr-2">Distance: </div>
                <div>{currentRequest.distance} km</div>
            </div>

            <div className="flex ml-3">
                <div className="font-bold mr-2">Duration: </div>
                <div>{currentRequest.duration} mins</div>
            </div>

            <div className="flex justify-center mt-4 mb-6">
                <button className="py-3 px-4 bg-red-600 text-white rounded-3xl" onClick={cancelRequestButton}>Cancel Request</button>
            </div>
        </div>
    );
}

export default CurrentRequest;