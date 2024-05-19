import url from '../jsondata/url.json'
import Swal from 'sweetalert2'

// Function to submit a rating for a ride
// @param ride_id, rating, review
// @returns Boolean
export default async function submitRating(ride_id, rating, review){

    const data = {
        ride_id: ride_id,
        rating: rating,
        rating_text: review
    }

    const response = await fetch(url.url + "services/rating", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem("auth-token")
        },
        body: JSON.stringify(data)
    });

    if (!response.ok){
        const res = await response.json();
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: res.error,
        });
        return null;
    }

    return true;
}