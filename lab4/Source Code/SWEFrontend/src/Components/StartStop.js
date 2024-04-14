import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, Autocomplete, DirectionsRenderer } from "@react-google-maps/api";

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
    
            <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Autocomplete onLoad={(autocomplete) => onLoad(autocomplete, 'start')}>
                    <input className='h-10 my-2 w-[90vw] py-3 px-4 border-1 border-gray-800 rounded-xl' placeholder='Enter pickup location'  />
                </Autocomplete>
    
                <Autocomplete onLoad={(autocomplete) => onLoad(autocomplete, 'end')}>
                    <input className='h-10 w-[90vw] my-2 py-3 px-4 border-1 border-gray-800 rounded-xl' placeholder='Where to?' />
                </Autocomplete>
            </div>
        </div>
    );
};

export default StartStopSearch;