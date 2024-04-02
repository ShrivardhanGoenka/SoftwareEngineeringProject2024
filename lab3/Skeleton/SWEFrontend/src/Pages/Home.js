import React from 'react'
import tw from 'tailwind-styled-components';
import { Link, useActionData } from "react-router-dom";
import { useEffect } from 'react';

function Home() {
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    useEffect(() => {
        const token = localStorage.getItem("auth-token");
        if (token) {
            setIsLoggedIn(true);
        }
    } ,[]);


  return (
    <HomeContainer>

        {/* <Banner src="/home.jpg"/> */}
        <ActionItems >
            <Header>
                <Company>ProfitPath</Company>
                <Profile>
                    <Name>{isLoggedIn?"Matthew":"Not Sign In"} </Name>
                    <Link to='/profile'>
                    <UserImage src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=2960&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"></UserImage>
                    </Link>
                </Profile>
            </Header>


            <ActionButtons>
                <Link to='/search' state={{service: "delivery"}}>
                <ActionButton>
                    <ActionButtonImg src="https://www.svgrepo.com/show/397534/motor-scooter.svg"/>
                    Delivery
                </ActionButton>
                </Link>

                <Link to='/search' state={{service: "ride"}}>
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

const HomeContainer = tw.div`flex flex-col h-screen`

const ActionItems = tw.div`basis-2/3 flex-col p-4`

const Header = tw.div`flex justify-between items-center pt-3`

const Company = tw.div`text-4xl`

const Profile = tw.div`flex items-center`

const Name = tw.div`mr-4 w-20 text-sm`

const UserImage = tw.img`w-12 h-12 rounded-full border-grey-200 p-px transform hover:scale-105`

const ActionButtons = tw.div`flex flex-col pt-10`

const ActionButton = tw.div`flex flex-col bg-gray-200  mb-5 h-24 items-center justify-center rounded-lg transform hover:scale-105 transition`

const ActionButtonImg = tw.img`h-3/5`