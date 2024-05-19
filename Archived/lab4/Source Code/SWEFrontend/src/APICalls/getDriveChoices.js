import url from "../jsondata/url.json"
import Swal from 'sweetalert2'

export default async function getDriveChoices(latitude, longitude){
    const response = await fetch(url.url+"services/drive", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem("auth-token")
        },
        body: JSON.stringify({location_latitude: latitude, location_longitude: longitude})
    })
    if (!response.ok) {
        const res = await response.json();
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: res.error,
        });
    }
    
    const data = await response.json();
    return data;
}