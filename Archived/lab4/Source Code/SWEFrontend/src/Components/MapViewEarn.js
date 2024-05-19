import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import CurrentLocationEarn from "./CurrentLocationEarn";

import { useJsApiLoader, GoogleMap, MarkerF, Autocomplete, DirectionsRenderer } from "@react-google-maps/api"; 

function MapViewEarn({location, setLocation, pickupLocation, toLocation}){

    const [showRoute, setShowRoute] = useState(false);
    const [directions, setDirections] = useState(null);

    function calculateRoute(){
        const directionsService = new window.google.maps.DirectionsService();

        const origin = { lat: pickupLocation.lat, lng: pickupLocation.lng };
        const destination = { lat: toLocation.lat, lng: toLocation.lng };

        directionsService.route(
            {
                origin: origin,
                destination: destination,
                travelMode: window.google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
                if (status === window.google.maps.DirectionsStatus.OK) {
                    setDirections(result);
                } else {
                    console.error(`error fetching directions ${result}`);
                }
            }
        );
    }

    useEffect(() => {
        
        if(pickupLocation && toLocation ){
            setShowRoute(true);
            calculateRoute();
        }
        else{
            setShowRoute(false);
        }


    }, [location, pickupLocation, toLocation]);

    return(
        <div className="w-[100vw]">
            <div style={{ position: 'relative', width: '100vw', height: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <GoogleMap center={{ lat: 1.363366, lng: 103.824426 }} zoom={10.5} mapContainerStyle={{ width: "100%", height: "100%", borderRadius: '0 0'}}
                    options={{
                        fullscreenControl: false,
                        streetViewControl: false,
                        mapTypeControl: false,
                        zoomControl: false
                    }}
                >
                    {location != null && location!=false && <MarkerF position={location} />}
                    {showRoute && <DirectionsRenderer directions={directions} />}
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
                        <CurrentLocationEarn location={location} setLocation={setLocation} />
                    </div>
                </div>

                <div style={{position: 'absolute', top:17, left: 50, zIndex:1}}>
                    
                </div>
            </div>

        </div>
    )
}

export default MapViewEarn;