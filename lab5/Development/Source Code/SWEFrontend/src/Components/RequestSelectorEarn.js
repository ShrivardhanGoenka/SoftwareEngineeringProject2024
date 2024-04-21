import { useState, useEffect } from "react";

import getDriveChoices from "../APICalls/getDriveChoices";
import car_icon from "../images/car_icon.png";
import motor_icon from "../images/motor_icon.svg";

// Component to display the available requests for the driver to choose from
// The component fetches the available requests using the getDriveChoices function
// The component also sets up a polling mechanism to fetch the available requests every 10 seconds
// The component displays the available requests as a list of cards
// The component allows the driver to select a request by clicking on the card
// The component highlights the selected card
// The component updates the pickupLocation and toLocation states when a request is selected
// The component updates the optionSelected state when a request is selected
// The component updates the pickupLocation and toLocation states to null when a request is deselected
// The component updates the optionSelected state to -1 when a request is deselected
// @param location - location state
// @param setPickupLocation - function to update the pickupLocation state
// @param setToLocation - function to update the toLocation state
// @param optionSelected - optionSelected state
// @param setOptionSelected - function to update the optionSelected state
// @returns JSX
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
                                    <img src={route.serviceType === "delivery" ? motor_icon : car_icon} className="h-12 mr-4" alt="motot_icon" />
                                    <div className="flex items-center justify-between flex-1">
                                        <div className="w-[250px]">
                                            <div className="font-base"><span className="font-semibold">Service:</span> {route.serviceType}</div>
                                            <div className="text-base"><span className="font-semibold">From:</span> {route.pickupPlaceName}</div>
                                            <div className="text-base"><span className="font-semibold">To:</span> {route.endPlaceName}</div>
                                            
                                            <div className="flex justify-between items-center w-full">
                                                <div className="text-sm font-medium">S$ {route.transactionAmount}</div>
                                                <div className="text-sm text-blue-500">{route.durationMinutes} min</div>
                                                <div className="text-sm text-blue-500">{route.distanceKm} km</div>
                                                <div className="text-sm text-blue-500">{route.userRating}/5</div>
                                            </div>
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