import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, Autocomplete, DirectionsRenderer } from "@react-google-maps/api";

// StartStopSearch component
// This component is used to display the map and provide input fields to enter the pickup and destination locations
// @param fromLocation - pickup location state
// @param setFromLocation - function to update the pickup location state
// @param toLocation - destination location state
// @param setToLocation - function to update the destination location state
// @param setMarkers - function to update the markers state
// @returns JSX
// The function uses the GoogleMap component from @react-google-maps/api to display the map
// The function uses the Autocomplete component from @react-google-maps/api to provide input fields to enter the pickup and destination locations
// The function calculates the route from the pickup location to the destination location using the DirectionsService from the Google Maps API
// The function updates the route when the pickup location or destination location changes
const StartStopSearch = ({ fromLocation, setFromLocation, toLocation, setToLocation, setMarkers }) => {
    const google = window.google;
    const [directions, setDirections] = useState(null);

    const handleSelect = (autocomplete, type) => {
        const place = autocomplete.getPlace();
        const location = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
            name: place.name,
        };

        if (type === 'start') {
            setFromLocation(location);
        } else if (type === 'end') {
            setToLocation(location);
        }

        // Update markers
        setMarkers(prevMarkers => {
            const newMarkers = { ...prevMarkers };
            if (type === 'start') {
                newMarkers.start = location;
            } else if (type === 'end') {
                newMarkers.end = location;
            }
            return newMarkers;
        });
    };

    const onLoad = useCallback((autocomplete, type) => {
        const singaporeBounds = { south: 1.15, west: 103.58, north: 1.47, east: 104.14 };
        autocomplete.setOptions({ componentRestrictions: { country: "SG" }, bounds: singaporeBounds });
        autocomplete.addListener("place_changed", () => handleSelect(autocomplete, type));
    }, [setFromLocation, setToLocation, setMarkers]);

    useEffect(() => {
        if (!fromLocation || !toLocation) return;

        const directionsService = new google.maps.DirectionsService();
        directionsService.route(
            {
                origin: fromLocation,
                destination: toLocation,
                travelMode: google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
                if (status === google.maps.DirectionsStatus.OK) {
                    setDirections(result);
                } else {
                    console.error(`error fetching directions ${result}`);
                }
            }
        );
    }, [fromLocation, toLocation]);

    return (
        <div style={{ position: 'relative', width: '100%', height: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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

            <div className="w-full bg-white flex items-center px-4 mr-10" style={{ position: 'absolute', top: 0, left: 0, zIndex: 1}}>
        
            <div className="w-10 flex flex-col mr-2 items-center gap-1">
                <img className="h-2.5" src="https://www.svgrepo.com/show/449675/circle.svg" alt="from destination"/>
                <img className="h-10 mr-0.5" src="https://www.svgrepo.com/show/371377/line-v.svg" alt="decoration vertical line" />
                <img className="h-2" src="https://www.svgrepo.com/show/114429/black-square-shape.svg" alt="to destination"/>
            </div>

            <div className="flex flex-col flex-1 pr-4" >
                <Autocomplete onLoad={(autocomplete) => onLoad(autocomplete, 'start')}>
                <input className="h-10 bg-gray-200 my-2 rounded-2 p-2 outline-none border-none w-full" placeholder='Enter pickup location' /> 
                </Autocomplete>
                <Autocomplete onLoad={(autocomplete) => onLoad(autocomplete, 'end')}>
                <input className="h-10 bg-gray-200 my-2 rounded-2 p-2 outline-none border-none w-full" placeholder='Where to?' /> 
                </Autocomplete>
            </div>

            </div>
        </div>
    );
};

export default StartStopSearch;