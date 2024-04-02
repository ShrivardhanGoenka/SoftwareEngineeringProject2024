import React from "react";
import { Link, Navigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import url from "../jsondata/url.json"
import Cookie from "js-cookie";
import { useNavigate } from 'react-router-dom';
import tw from 'tailwind-styled-components';
import RideSelector from "../Components/RideSelector";


import { useJsApiLoader, GoogleMap, MarkerF, Autocomplete, DirectionsRenderer } from "@react-google-maps/api"; 
//const google = window.google;



const Earn = () => {
    const navigate = useNavigate();

    const [map, setMap] = useState(/** @type google.maps.Map */(null))
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [shortestRoutes, setShortestRoutes] = useState("");
    const [requestId, setRequestId] = useState(0)

    const [ableToPickup, setAbleToPickup] = useState(false);




    function getCurrentLocation(){
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLatitude(position.coords.latitude);
                setLongitude(position.coords.longitude);
                setAbleToPickup(true)
            },
            (error) => {
                console.error('Error getting geolocation:', error);
            }
        );

    }

    getCurrentLocation();

    useEffect(()=>{
        getCurrentLocation()
    }, [])

    useEffect(()=>{
        console.log(`current location at ${latitude}, ${longitude} `)
    }, [latitude, longitude])


    useEffect(()=>{
        alert("shortest route changes")
    }, [shortestRoutes])


    // async function searchNearby(){

    //     if (longitude =="" | latitude==""){
    //         alert("kosong")
    //         getCurrentLocation()
    //     }

    //     alert("latitude: ", latitude)
    //     console.log("latitude: ", latitude)
    //     const response = fetch(url.url+"services/drive", {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json",
    //             "Authorization": localStorage.getItem("auth-token")
    //         },
    //         body: JSON.stringify({location_latitude: latitude, location_longitude: longitude})
    //     }).then(response => {
    //         if (response.status === 200) {
    //             alert("success")
    //             const data = await response.json()
    //             setShortestRoutes(data)
    //             return response.json();
    //         }
    //         else{
    //             alert("request failed.")
    //         }
    //     })

    //         }


            const searchNearby = async () => {
                if (longitude =="" | latitude==""){
                    alert("kosong")
                    getCurrentLocation()
                }
        
                alert("latitude: ", latitude)
                try {
                  // Replace the URL with your actual endpoint
                  const response = await fetch(url.url+"services/drive", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": localStorage.getItem("auth-token")
                        },
                        body: JSON.stringify({location_latitude: latitude, location_longitude: longitude})
                    })
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    
                    const data = await response.json();
                     setShortestRoutes(data);
                } catch (error) {
                  console.error('Failed to fetch shortest routes:', error);
                }}
          

    function handleSelectRoute(request_id, index){
        const response = fetch(url.url + "services/accept", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("auth-token")
            },
            body: JSON.stringify({current_request_id: request_id})
        }).then(response => {
            if (!response.ok) {
                throw new Error('Failed to accept route');
            }
            else{
                alert("begin journey!")
                setRequestId(request_id)
                navigate('./pickup', {state: {activeRide: shortestRoutes[index][1], currentLocation: {lat: latitude, lng: longitude}}})
            }
        })
        .catch(error => {
            console.error('Error accepting route:', error);
            alert("Error accepting route: " + error);
        });
    }

       
    function onSubmit(){
        return null;
    }

    
        return (
            <DeliveryContainer>
                <MapContainer>
                <GoogleMap center={longitude ? {lat: latitude, lng:longitude} : { lat: 1.3483, lng: 103.6831 }} zoom={10.5} mapContainerStyle={{width:"100%", height:"50vh"}}
                onLoad={(map)=> setMap(map) }
                options={{
                    fullscreenControl: false, // Disable fullscreen control
                    streetViewControl: false, // Disable street view control
                    mapTypeControl: false, // Disable map type control
                    zoomControl: false // Disable zoom control
                    // Add more options as needed
                  }}
                >
                </GoogleMap>
                </MapContainer>
                <RideContainer>
                    <button className="btn" onClick={searchNearby}>Reload</button>
                    <RideSelector shortestRoutes={shortestRoutes}/>

                    <ConfirmButtonContainer>
                        <ConfirmButton onClick={onSubmit} disable={ableToPickup}>Confirm Pick Up</ConfirmButton>:
                    </ConfirmButtonContainer>
                </RideContainer>
        
            </DeliveryContainer>
        
          )
        }
        
        export default Earn;
        
        
        const DeliveryContainer = tw.div`flex flex-col h-screen`
        
        const MapContainer = tw.div`basis-0.5`
        
        const RideContainer = tw.div`basis-0.5 flex flex-col`
        

        
        const ConfirmButtonContainer = tw.div`border-t-2`
        
        const ConfirmButton = tw.div`bg-black my-4 mx-4 py-4 text-center text-xl text-white`
        
        // const Car = tw.div`flex p-4 items-center `

        // const RideDetails =tw.div`flex-1`
        
        // const Service = tw.div`font-medium mb-2`
        
        // const Time = tw.div`text-xs text-blue-500`
        
        // const Distance = tw.div`text-xs text-blue-500`
        
        // const Price = tw.div`text-sm`
        
        // const Loading = tw.div`flex align-items items-center  bg-gray-100 px-5 py-5`
        
        // const LoadingText = tw.div`flex-1`
        
        // const CancelButton = tw.button`bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded`