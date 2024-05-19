import React from "react";
import { Link, Navigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import url from "../jsondata/url.json"
import Cookie from "js-cookie";
import { useNavigate } from 'react-router-dom';
import tw from 'tailwind-styled-components';



import { useJsApiLoader, GoogleMap, MarkerF, Autocomplete, DirectionsRenderer } from "@react-google-maps/api"; 
//const google = window.google;



const RideSelector = ({shortestRoutes}) => {

    console.log("shot: ", shortestRoutes)
    console.log("shot length: ", shortestRoutes.length)
    console.log("shot hoho: ", shortestRoutes[0][1])
    return(
        <RideSelectorContainer>
            <Title>Choose a ride</Title>
            <CarList>
                {/* {shortestRoutes && shortestRoutes.length > 0 && <p>here: {shortestRoutes[0][1].serviceType}</p>} */}
                {shortestRoutes && shortestRoutes.length > 0 && (
                    <div>
                        {shortestRoutes.map(([request_id, route], index) => (
                            <Car key={request_id}>
                                <CarImage src="https://www.svgrepo.com/download/408291/car-white.svg"/>
                                <CarDetails>
                                    <Service>{route.serviceType}</Service>
                                    <Time>{route.durationMinutes} min</Time>
                                    <Distance>{route.distanceKm} km</Distance>
                                </CarDetails>
                                <Price>S$ {route.transaction_amount}</Price>
                            </Car>
                        ))}
                    </div>
)}
                
            </CarList>
 
        </RideSelectorContainer>
    )

}

export default RideSelector;

const Title = tw.div`flex p-4 items-center`

const RideSelectorContainer = tw.div`flex flex-col flex-1 overflow-y-scroll`

const Car = tw.div`flex p-4 items-center`

const CarList = tw.div`overflow-y-scroll`

const CarImage = tw.img`h-14 mr-4`

const CarDetails = tw.div`flex-1`

const Service = tw.div`font-medium`

const Time = tw.div`text-xs text-blue-500`

const Distance = tw.div`text-xs text-blue-500`

const Price = tw.div`text-sm mr-4`

