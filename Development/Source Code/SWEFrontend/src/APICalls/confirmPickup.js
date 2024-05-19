import url from '../jsondata/url.json';
import Swal from 'sweetalert2'

// Function to confirm the pickup of the current request
// @param None
// @returns Boolean
export default async function confirmPickup() {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('auth-token')
    };

    const response = await fetch(url.url + 'services/pickup', {
        method: 'POST',
        headers: headers
    });

    if (!response.ok) {
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