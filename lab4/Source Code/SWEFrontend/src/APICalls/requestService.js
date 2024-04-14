import url from "../jsondata/url.json"

export default async function requestService(from, to, instructions, price, service) {

    const google = window.google;
    
    const directionsService = new google.maps.DirectionsService();

    const results = await directionsService.route({
        origin: from,
        destination: to,
        // eslint-disable-next-line no-undef
        travelMode: google.maps.TravelMode.DRIVING,
    })

    var distance = results.routes[0].legs[0].distance.value;
    var duration = results.routes[0].legs[0].duration.value;

    const body = {
        service_type: service,
        requester_text: instructions,
        pickup_latitude: from.lat,
        pickup_longitude: from.lng,
        pickup_place_name: from.name,
        end_latitude: to.lat,
        end_longitude: to.lng,
        end_place_name: to.name,
        distance: distance.toString(),
        duration: duration.toString(),
        transaction_amount: price.toString()
    }

    const response = await fetch(url.url + "services/request", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem("auth-token")
        },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        const res = await response.json();
        return {"status": 0, "error": res.error};
    }

    const res = await response.json();
    return {"status": 1, "data": res};

}