import url from '../jsondata/url.json'
import Swal from 'sweetalert2'

// Function to confirm the ride
// @param String, Object
// @returns Boolean
export default async function confirmRide(rideId, location){
    const body = {
        current_request_id: rideId,
        driver_latitude: location.lat,
        driver_longitude: location.lng
    }

    const response = await fetch(url.url + "services/accept", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem("auth-token")
        },
        body: JSON.stringify(body)
    })

    if (response.ok){
        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Ride confirmed',
        });
        return true;
    }
    else{
        const res = await response.json();
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: res.error,
        });
        return false;
    }

}