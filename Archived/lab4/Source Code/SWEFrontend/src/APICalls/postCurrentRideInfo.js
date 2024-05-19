import url from '../jsondata/url.json';

export default async function postCurrentRideInfo(location) {

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('auth-token')
    };

    const body = {
        "driver_latitude": location.lat,
        "driver_longitude": location.lng
    }

    const response = await fetch(url.url + 'services/current_ride_info', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body)
    });

}

