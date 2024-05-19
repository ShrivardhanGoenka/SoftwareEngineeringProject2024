import { useState, useEffect } from "react";
import getStatusOfUser from "../APICalls/getStatus";
import getCurrentRideInfo from "../APICalls/getCurrentRideInfo";
import getRequesterUpdates from "../APICalls/getRequesterUpdates";
import getServiceIdByTimeStarted from "../APICalls/getServiceIdByTimeStarted";
import Chat from "../Components/Chat";
import { useNavigate, Link } from "react-router-dom";
import { GoogleMap, DirectionsRenderer } from "@react-google-maps/api";
import Swal from 'sweetalert2'

function CurrentRideRequester() {
  const navigate = useNavigate();
  const [currentRide, setCurrentRide] = useState();
  const [status, setStatus] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [directions, setDirections] = useState(null);

  useEffect(() => {

    const checkUserStatusAndRideInfo = async () => {
      const statusData = await getStatusOfUser();
      switch (statusData.status) {
        case 'request':
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'You have an ongoing request.',
          });
          navigate("/currentRequest");
          break;
        case 'active_responder':
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'You are currently on a ride.',
          });
          navigate("/currentRide/responder");
          break;
        case 'none':
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'You do not have any ongoing rides.',
          });
          navigate("/");
          break;
        default:
          const rideInfo = await getCurrentRideInfo();
          if (rideInfo.status === "success") {
            setCurrentRide(rideInfo.data);
            const updates = await getRequesterUpdates();
            if (updates.status !== "none") {
              setStatus(updates.status);
              setDriverLocation({ "lat": updates.driver_latitude, "lng": updates.driver_longitude });
            }

          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: rideInfo.error,
            });
            navigate("/");
          }
          break;
      }
    };

    checkUserStatusAndRideInfo();
  }, []);

  useEffect(() => {
    let isPollingAllowed = true; // Flag to control polling
    let pollingInterval;

    const updateData = async () => {
          if (!isPollingAllowed) {
            clearInterval(pollingInterval);
            return;
          }
          const updates = await getRequesterUpdates();
          if (updates.status === "none") {
            Swal.fire({
              title: "Ride Completed",
              icon: "success",
              title: "Ride has been completed."
            });
            clearInterval(pollingInterval);
            console.log(currentRide.time_started);
            console.log(currentRide);
            const result = await getServiceIdByTimeStarted(currentRide.time_started);
            if(result == null){
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Service ID not found.',
              });
              navigate("/");
            }
            else{
              navigate("/feedback", { state: { ride_id: result.ServiceHistoryID } });
            }
          } else {
            setStatus(updates.status);
            setDriverLocation({ "lat": updates.driver_latitude, "lng": updates.driver_longitude });
            const origin= { lat: updates.driver_latitude, lng: updates.driver_longitude }
            const destination= updates.status === "Awaiting pickup" ? { lat: currentRide.pickup_latitude, lng: currentRide.pickup_longitude } : { lat: currentRide.end_latitude, lng: currentRide.end_longitude }

            const directionsService = new window.google.maps.DirectionsService();

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

          }
    }


    const startPolling = () => {
      pollingInterval = setInterval(updateData , 5000);
    };

    if (currentRide) {
      updateData();
      startPolling();
    }

    return () => {
      isPollingAllowed = false; // Prevent further polling when the component unmounts
    };
  }, [currentRide]);

  return (
      <div>

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
                    {directions && <DirectionsRenderer directions={directions} />}
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

        </div>
        
        <div className="flex flex-col items-center justify-center my-2 font-sans text-xl">
    <div className="font-bold">{status}</div>

    <div className="mt-4 w-full max-w-md bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4">
            <div className="text-xl font-bold mb-2">Ride Details</div>
            <div className="mb-2">
                <span className="font-semibold">From:</span> {currentRide && currentRide.pickup_place_name}
            </div>
            <div className="mb-2">
                <span className="font-semibold">To:</span> {currentRide && currentRide.end_place_name}
            </div>
            <div className="mb-2">
                <span className="font-semibold">Service:</span> {currentRide && currentRide.service_type}
            </div>
            <div className="mb-2">
                <span className="font-semibold">Transaction Amount:</span> ${currentRide && currentRide.transaction_amount}
            </div>
            <div className="mb-2">
                <span className="font-semibold">Driver Name:</span> {currentRide && currentRide.responder_name}
            </div>
        </div>

        <div className="px-6 py-4 bg-gray-100">
            <div className="text-xl font-bold mb-2">Car Details</div>
            <div className="mb-2">
                <span className="font-semibold">Car Model:</span> {currentRide && currentRide.car_details.carmodel}
            </div>
            <div className="mb-2">
                <span className="font-semibold">Car Plate:</span> {currentRide && currentRide.car_details.licence}
            </div>
            <div className="mb-2">
                <span className="font-semibold">Car Colour:</span> {currentRide && currentRide.car_details.color}
            </div>
        </div>
    </div>
</div>

        <Chat role="requester" />
      </div>
  );
}

export default CurrentRideRequester;