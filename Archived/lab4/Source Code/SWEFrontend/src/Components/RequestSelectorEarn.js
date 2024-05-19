import { useState, useEffect } from "react";

import getDriveChoices from "../APICalls/getDriveChoices";

function RequestSelectorEarn({location, setPickupLocation, setToLocation, optionSelected, setOptionSelected}){
    
    const [shortestRides, setShortestRides] = useState([]);

    useEffect(()=>{
        console.log("shortestRides: ", shortestRides)
    },[shortestRides])
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!location) return;
                if (location.lat === null || location.lng === null) return;
                const data = await getDriveChoices(location.lat, location.lng);
                var flag = false;
                for (let i=0; i<data.length; i++){
                    console.log(data[i][0]);
                    if (data[i][0] === optionSelected){
                        flag = true;
                        break;
                    }
                }
                if (!flag){
                    setOptionSelected(-1);
                    setPickupLocation(null);
                    setToLocation(null);
                }
                setShortestRides(data);

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
    
        fetchData(); 
    
        let pollingInterval = setInterval(fetchData, 10000); 
    
        return () => clearInterval(pollingInterval);
    }, [location]); 

    function optionSelectedFunction(rideId, ride){
        setOptionSelected(rideId);
        console.log(rideId);
        setPickupLocation({
            lat: ride.pickupLatitude,
            lng: ride.pickupLongitude
        });
        setToLocation({
            lat: ride.endLatitude,
            lng: ride.endLongitude
        });
    }

    return(
        <div className="flex flex-col flex-1 overflow-y-scroll no-scroll-bar mt-1">
                <div className="overflow-y-scroll basis-0.7 no-scroll-bar">
                    {shortestRides && shortestRides.length > 0 && (
                        <>
                            {shortestRides.map(([request_id, route], index) => (
                                <div key={request_id} onClick={() => optionSelectedFunction(request_id, route)} className={`flex p-4 items-center cursor-pointer bg-white my-1 mx-[1px] ${request_id === optionSelected ? 'border-[4px] border-blue-500' : 'border-[2px] border-black'} flex-1`}>
                                    <img src="https://www.svgrepo.com/download/408291/car-white.svg" className="h-12 mr-4" />
                                    <div className="flex items-center justify-between flex-1">
                                        <div className="w-[230px]">
                                            <div className="font-medium">Service: {route.serviceType}</div>
                                            <div>From: {route.pickupPlaceName}</div>
                                            <div>To: {route.endPlaceName}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm mr-4 font-medium">S$ {route.transactionAmount}</div>
                                            <div className="text-xs text-blue-500">{route.durationMinutes} min</div>
                                            <div className="text-xs text-blue-500">{route.distanceKm} km</div>
                                            <div className="text-xs text-blue-500">{route.userRating}/5 rating</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}

                    {shortestRides && shortestRides.length === 0 && (
                        <div className="flex justify-center items-center h-[20vh]">
                            <div className="text-center">
                                <div className="text-2xl font-bold">No requests available</div>
                                <div className="text-sm">Please try again later</div>
                            </div>
                        </div>
                    )}
                </div>
        </div>
    )
}

export default RequestSelectorEarn;