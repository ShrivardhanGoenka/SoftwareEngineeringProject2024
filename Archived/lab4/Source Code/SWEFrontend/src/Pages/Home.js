import React from 'react'
import tw from 'tailwind-styled-components';
import { Link, useActionData } from "react-router-dom";
import { useEffect, useState } from 'react';
import url from "../jsondata/url.json"


function Home() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [name, setName] = useState("not signed in");

    useEffect(() => {
        const token = localStorage.getItem("auth-token");
        if (token) {
            setIsLoggedIn(true);
        }
    } ,[]);

    useEffect(()=>{
        if(isLoggedIn==true){

            async function getProfile(){
                const response = await fetch(url.url + "accounts/profile", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": localStorage.getItem("auth-token")
                    },
                })

                if (!response.ok){
                    const res = response.json()
                    alert(response.error)
                }

                const res = await response.json()
                console.log("res: ", res);
                setName(res.name);
            
            }

            getProfile();
        }
    }, [isLoggedIn])

  return (
    <HomeContainer>

        {/* <Banner src="/home.jpg"/> */}
        <ActionItems >
            <Header>
                <Company>ProfitPath</Company>
                <Profile>
                    <Name>{name} </Name>
                    <Link to='/profile'>
                    {/* <UserImage src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=2960&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"></UserImage> */}
                    <UserImage src="https://cdn-icons-png.flaticon.com/128/666/666201.png"/>
                    </Link>
                </Profile>
            </Header>


            <ActionButtons>
                <Link to='/delivery'>
                <ActionButton>
                    <ActionButtonImg src="https://www.svgrepo.com/show/397534/motor-scooter.svg"/>
                    Delivery
                </ActionButton>
                </Link>

                <Link to='/ride' >
                <ActionButton>
                    <ActionButtonImg src="https://www.svgrepo.com/download/408291/car-white.svg"/>
                    Ride
                </ActionButton>
                </Link>

                <Link to={'/earn'}>
                <ActionButton>
                    <ActionButtonImg src="https://www.svgrepo.com/show/395619/money.svg"/>
                    Earn
                </ActionButton>
                </Link>
                
            </ActionButtons>

           

        </ActionItems>
        
    </HomeContainer>
  )
}

export default Home;

const HomeContainer = tw.div`flex flex-col h-screen bg-violet-100`

const ActionItems = tw.div`basis-2/3 flex-col p-4`

const Header = tw.div`flex justify-between items-center pt-3`

const Company = tw.div`text-4xl`

const Profile = tw.div`flex items-center`

const Name = tw.div`mr-5 w-20 text-sm text-right`

const UserImage = tw.img`w-12 h-12 rounded-full border-grey-200 p-px transform hover:scale-105`

const ActionButtons = tw.div`flex flex-col pt-10`

const ActionButton = tw.div`flex flex-col bg-white mb-5 h-24 items-center justify-center rounded-lg transform hover:scale-105 transition`

const ActionButtonImg = tw.img`h-3/5`