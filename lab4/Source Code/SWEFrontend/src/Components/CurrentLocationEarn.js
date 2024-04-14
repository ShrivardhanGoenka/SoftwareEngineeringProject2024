import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { Autocomplete } from "@react-google-maps/api";

import getStatusOfUser from '../APICalls/getStatus';

const CurrentLocationEarn = ({location, setLocation}) => {
    const [currentLocation, setCurrentLocation] = useState(null);

    const onLoad = useCallback((autocomplete) => {
        const singaporeBounds = { south: 1.15, west: 103.58, north: 1.47, east: 104.14 };
        autocomplete.setOptions({ componentRestrictions: { country: "SG" }, bounds: singaporeBounds });
        autocomplete.addListener("place_changed", () => handleSelect(autocomplete));
    }, [location, setLocation]);

    function getCurrentLocation(){
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setCurrentLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
                setLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            } , (error) => {
                setCurrentLocation(false);
            } );
        } else {
            setCurrentLocation(false);
        }
    };

    const handleSelect = (autocomplete) => {
        const place = autocomplete.getPlace();
        const location = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
            name: place.name,
        };
        setLocation(location);
    };

    useEffect(() =>{
        getCurrentLocation();
    }, [])

    return (
        <div>
            {currentLocation === null && <div>Loading</div>}
            
            {currentLocation === false && <div>
                <Autocomplete onLoad={onLoad}>
                    <input type="text" className="w-[75vw] py-2 ml-3" placeholder="Enter your location"/>
                </Autocomplete>
            </div>}
            
            {currentLocation && 
                <div className="flex w-full px-5"><div className="bg-white w-full py-2">Current Location</div></div>
            }
        </div>
    )
}

export default CurrentLocationEarn;