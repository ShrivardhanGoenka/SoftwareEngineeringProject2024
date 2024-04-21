import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import getResponderUpdates from "../APICalls/getResponderUpdates";

import PickupDriver from "../Components/PickupDriver";
import OnRouteDriver from "../Components/OnRouteDriver";
import Chat from "../Components/Chat";
import Swal from 'sweetalert2'

// CurrentRideResponder component is used to display the current ride details of the responder
// The component fetches the current ride details of the responder using the getResponderUpdates function
// The component displays the current ride details of the responder
// The component displays the status of the ride
// The component displays the pickup location, destination, service type, transaction amount, and requester name of the ride
// The component shows the chat component to allow the responder to chat with the requester
// The component will show the Pickup component if the status of the ride is "Awaiting pickup"
// The component will show the OnRoute component if the status of the ride is "On Route"
function CurrentRideResponder() {
  const navigate = useNavigate();
  const [status, setStatus] = useState(null);

  useEffect(() => {
    let isPollingAllowed = true; // Flag to control polling

    //print date time
    const dateTime = new Date();
    //add 8 hours
    dateTime.setHours(dateTime.getHours() + 8);
    console.log(dateTime.toISOString());

    const checkUserStatusAndRideInfo = async () => {
      const updates = await getResponderUpdates();
      if (updates.status !== "none") {
        setStatus(updates.status);
      }
      else{
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'You do not have any ongoing rides.',
        });
        navigate("/");
      }
    };

    const startPolling = () => {
      const pollingInterval = setInterval(async () => {
        if (!isPollingAllowed) {
          clearInterval(pollingInterval);
          return;
        }

        checkUserStatusAndRideInfo();
      }, 5000);
    };

    checkUserStatusAndRideInfo();
    startPolling();

    return () => {
      isPollingAllowed = false;
    };
  }, []);

  return (
    <div>

      {status === "Awaiting pickup" && <PickupDriver />}

      {status === "On Route" && <OnRouteDriver />}

      <Chat role="responder" />

    </div>
  );
}

export default CurrentRideResponder;