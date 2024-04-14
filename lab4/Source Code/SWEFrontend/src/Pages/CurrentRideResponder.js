import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import getResponderUpdates from "../APICalls/getResponderUpdates";

import PickupDriver from "../Components/PickupDriver";
import OnRouteDriver from "../Components/OnRouteDriver";
import Chat from "../Components/Chat";
import Swal from 'sweetalert2'

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