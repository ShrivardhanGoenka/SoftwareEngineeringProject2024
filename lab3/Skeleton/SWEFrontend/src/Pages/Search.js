import React from 'react';
import tw from 'tailwind-styled-components';
import { Link, useActionData } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import { useJsApiLoader, GoogleMap, MarkerF, Autocomplete, DirectionsRenderer } from "@react-google-maps/api"; 

const Search = () => {
    const google = window.google;
    const location = useLocation();
    const service = location.state.service;

    const [from, setFrom] = useState("");
    const [to, setTo] = useState("") ;


    return (
    <SearchContainer>
        
        <ButtonContainer>
            <Link to={"/"}>
            <BackButton src="https://www.svgrepo.com/show/500472/back.svg"></BackButton>
            </Link>
        </ButtonContainer>
        
        <InputContainer>
            <FromToIcon>
                <Circle src="https://www.svgrepo.com/show/449675/circle.svg"/>
                <Line src="https://www.svgrepo.com/show/371377/line-v.svg" className="mr-0.5"/>
                <Square src="https://www.svgrepo.com/show/114429/black-square-shape.svg"/>
            </FromToIcon>

            <InputBoxes>
                <Autocomplete >
                    <Input placeholder='Enter pickup location' onChange={(event)=>{setFrom(event.target.value)}}/> 
                </Autocomplete>
                <Autocomplete>
                    <Input placeholder='Where to?' onChange={(event)=>{setTo(event.target.value)}}/> 
                </Autocomplete>
            </InputBoxes>

        </InputContainer>

        <Link to={"/"+service} state={{service: service, from: from, to:to}}>
        <ConfirmContainer>
            Confirm Location
        </ConfirmContainer>
        </Link>
 


    </SearchContainer>
  );
};

export default Search;


const SearchContainer = tw.div`bg-gray-200 h-screen`

const ButtonContainer = tw.div`bg-white px-4`

const BackButton = tw.img`h-12 cursor-pointer`

const InputContainer = tw.div`bg-white flex items-center px-4`

const FromToIcon = tw.div`w-10 flex flex-col mr-2 items-center gap-1`

const Circle = tw.img`h-2.5`

const Line = tw.img`h-10`

const Square = tw.img`h-2`

const InputBoxes = tw.div`flex flex-col flex-1 pr-4` 

const Input = tw.input`h-10 bg-gray-200 my-2 rounded-2 p-2 outline-none border-none w-full` 

const ConfirmContainer = tw.div`bg-black text-white text-center mt-4 mx-4 px-4 py-3 text-base cursor-pointer cursor-pointer`