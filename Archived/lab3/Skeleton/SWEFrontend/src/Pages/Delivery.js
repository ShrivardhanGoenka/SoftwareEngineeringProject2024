import React from 'react'
import tw from 'tailwind-styled-components';
import { useLocation } from 'react-router-dom';
import {useState, useRef, useEffect} from "react";
import { useJsApiLoader, GoogleMap, MarkerF, Autocomplete, DirectionsRenderer } from "@react-google-maps/api"; 
import url from "../jsondata/url.json"

function Delivery() {
    const google = window.google;

    const location = useLocation();

    
    const [from, setFrom] = useState("");  //text form of from
    const [to, setTo] = useState("") ;

    const [directionsResponse, setDirectionsResponse] = useState(null)
    const [map, setMap] = useState(/** @type google.maps.Map */(null))
    const [distance, setDistance] = useState('')
    const [duration, setDuration] = useState('')
    const [price, setPrice] = useState('')

    const [startLocation, setStartLocation] = useState({})
    const [endLocation, setEndLocation] = useState({});

    const [status, setStatus] = useState("beforeSubmit");
    const isPollingRef = useRef(false);

    const n = useRef(0)




    useEffect(()=>{
        if(location && location.state){
            console.log(location)
            setFrom(location.state.from);
            setTo(location.state.to);
            if(n.current == 0){
                calculateRoute(location.state.from,location.state.to)
                n.current=1
            }
        }
    }, [location])


    async function calculateRoute(from, to) {

        /* eslint-disable no-undef */
        const directionsService = new google.maps.DirectionsService();

        const results = await directionsService.route({
          origin: from,
          destination: to,
          // eslint-disable-next-line no-undef
          travelMode: google.maps.TravelMode.DRIVING,
        })

        setDirectionsResponse(results)
        setDistance(results.routes[0].legs[0].distance.value)
        setDuration(results.routes[0].legs[0].duration.value)
        // Base fee ($1) + distanceCost ($0.5 per km) + timeCost ($0.2 per minute)
        alert("route calculated")
        
        const startLocationData = results.routes[0].legs[0].start_location;
        const endLocationData = results.routes[0].legs[0].end_location;

        setStartLocation({
            latitude: startLocationData.lat(),
            longitude: startLocationData.lng(),
            placeName: results.routes[0].legs[0].start_address
        });

        setEndLocation({
            latitude: endLocationData.lat(),
            longitude: endLocationData.lng(),
            placeName: results.routes[0].legs[0].end_address
        })
        
      }

      async function onSubmit(){

        const body = {
            service_type: "delivery",
            requester_text: "hey first one",
            pickup_latitude: startLocation.latitude,
            pickup_longitude: startLocation.longitude,
            pickup_place_name: startLocation.placeName,
            end_latitude: endLocation.latitude,
            end_longitude: endLocation.longitude,
            end_place_name: endLocation.placeName,
            distance: distance.toString(),
            duration: duration.toString(),
            transaction_amount: price.toString()
        }

        console.log("body = ", body)

        const response = await fetch(url.url + "/services/request", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("auth-token")
            },
            body: JSON.stringify(body)
        })
        
        
        if (response.status == 200){
            alert("requested submitted 200")
            setStatus("requesting")
            polling();
        
        }
        else{
            const res = await response.json()
            alert(res.error)
            setStatus('beforeSubmit');
        }
        
        
        
    }



    async function fetchUpdate(){
        console.log("polling")
        try {
            const response = await fetch(url.url + "/services/requesterupdates", {headers: {"Content-Type": "application/json","Authorization": localStorage.getItem("auth-token")}});
            const result = await response.json();

            if (response.ok && result.Accepted === 'Awaiting pickup') {
                setStatus("accepted");
                navigate('./waitpickup', {state:{}})
            }
            
        } catch (error) {
            console.error("Fetching data failed", error);
        }
    }


    function polling(){
        const intervalID = setInterval(fetchUpdate, 5000)
        setTimeout(cancelRequest, 0.5*60*1000, intervalID) // cancel after 5 mins
    }

    async function cancelRequest(intervalId = 0){
        clearInterval(intervalId) // sync 

        if (status!="accepted"){
            try {
                const response = await fetch(url.url + "/services/cancel", {method:"DELETE", headers:{"Content-Type": "application/json","Authorization": localStorage.getItem("auth-token")}});
                if (!response.ok) {
                  const res = await response.json()
                  alert(res.error);
                }

                const res = await response.json(); 
                alert("cancellation successful. ", res.response)
                setStatus("beforeSubmit"); 
          
              } catch (error) {
                alert("Error during cancellation:", error.message);
                setStatus("beforeSubmit");
              }
        }
        else{
            alert("Driver has accepted, too late to cancel")
        }
    }
    

  return (
    <DeliveryContainer>
        <MapContainer>
        <GoogleMap center={startLocation && Object.keys(startLocation).length > 0 ? {lat: startLocation.latitide, lng:startLocation.longitude} : { lat: 1.3483, lng: 103.6831 }} zoom={10.5} mapContainerStyle={{width:"100%", height:"65vh"}}
        onLoad={(map)=> setMap(map) }
        options={{
            fullscreenControl: false, // Disable fullscreen control
            streetViewControl: false, // Disable street view control
            mapTypeControl: false, // Disable map type control
            zoomControl: false // Disable zoom control
            // Add more options as needed
          }}
        >
            {directionsResponse && (<DirectionsRenderer directions={directionsResponse} />)}
        </GoogleMap>
        </MapContainer>
        <RideContainer>
            <RideSelector>
                <Instruction>Confirm to Pickup</Instruction>
                <RideDetailsContainer>
                    <CarImage src="https://www.svgrepo.com/download/408291/car-white.svg"/>
                    <RideDetails>
                        <Service>{location.state.service}</Service>
                        <Time>{(duration/60).toFixed(2)} mins</Time>
                        <Distance>{(distance/1000).toFixed(2)} km</Distance>
                        
                    </RideDetails>
                    <Price>
                        <PriceLable>Price</PriceLable>
                        <Input placeholder={"S$ "} onChange={(event)=>{setPrice(event.target.value)}}/>
                    </Price>

                </RideDetailsContainer>
            </RideSelector>
            <ConfirmButtonContainer>
                {isPollingRef?
                <ConfirmButton onClick={onSubmit} disable={isPollingRef}>Confirm Pick Up</ConfirmButton>:
                <Loading>
                    <LoadingText>Waiting for driver...</LoadingText>
                    <CancelButton onClick={handleCancel}>Cancel</CancelButton>
                </Loading>
                }
            </ConfirmButtonContainer>
        </RideContainer>

    </DeliveryContainer>

  )
}

export default Delivery;


const DeliveryContainer = tw.div`flex flex-col h-screen`

const MapContainer = tw.div`basis-0.65`

const RideContainer = tw.div`basis-0.35 flex flex-col`

const Instruction = tw.div`text-gray-500 text-center text-xs py-1 border-b`

const RideSelector = tw.div``

const RideDetailsContainer = tw.div`flex p-4 items-center`

const CarImage = tw.img`h-32 mr-2`

const ConfirmButtonContainer = tw.div`border-t-2`

const ConfirmButton = tw.div`bg-black my-4 mx-4 py-4 text-center text-xl text-white`


const RideDetails =tw.div`flex-1`

const Service = tw.div`font-medium mb-2`

const Time = tw.div`text-xs text-blue-500`

const Distance = tw.div`text-xs text-blue-500`

const PriceLable = tw.div`text-xs font-bold mb-1`

const Price = tw.div`text-sm text-center `

const Input = tw.input`h-8 bg-gray-200 rounded-2 p-2 outline-none border-none w-20`

const Loading = tw.div`flex align-items items-center  bg-gray-100 px-5 py-5`

const LoadingText = tw.div`flex-1`

const CancelButton = tw.button`bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded`

