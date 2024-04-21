import React from 'react'
import tw from 'tailwind-styled-components';
import { Link } from "react-router-dom";
import { useEffect, useState } from 'react';
import car_icon from "../images/car_icon.png";
import motor_icon from "../images/motor_icon.svg";
import money_icon from "../images/money_icon.svg";
import getStatusOfUser from '../APICalls/getStatus';
import getProfile from '../APICalls/getProfile';
// Home component is used to display the home page of the user
// The component displays the company name and the user profile
// The component displays the action buttons for delivery, ride, and earn
// The component allows the user to navigate to the delivery, ride, and earn pages
// If the user has a current request or is currently on a ride, the component displays the active delivery/ride request at the top
// The component allows the user to navigate to the current request page if the user has an active delivery/ride request
function Home() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [name, setName] = useState("");
    const [active, setActive] = useState(null);
    const [link, setLink] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("auth-token");
        if (token) {
            setIsLoggedIn(true);
            
            getStatusOfUser().then((data)=>{
                console.log(data)
                if(data.status === 'request'){
                    setLink("/currentRequest")
                    setActive("Active delivery/ride request.")
                }
                else if (data.status === 'active_requester'){
                    setLink("/currentRide/requester")
                    setActive("Active ride")
                }
                else if (data.status === 'active_responder'){
                    setLink("/currentRide/responder")
                    setActive("Active ride")
                }
                else{
                    setActive(null)
                }
            })

        }

    } ,[]);

    useEffect(()=>{
        if(isLoggedIn===true){
            getProfile().then(result=>setName(result.name));
        }
    }, [isLoggedIn])

  return (
    <HomeContainer>

        {/* <Banner src="/home.jpg"/> */}
        <ActionItems >
            <Header>
                <Company>ProfitPath</Company>
                <Profile>
                <Link className="flex items-center" to='/profile'>
                    <Name>{name? name: "Login"} </Name>
                    
                    {/* <UserImage src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=2960&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"></UserImage> */}
                    <UserImage src="https://cdn-icons-png.flaticon.com/128/666/666201.png"/>
                    </Link>
                </Profile>
            </Header>

            <ActionButtons>
                {active && 
                <Link to={link}>
                    <div class="bg-violet-100 text-center py-4 lg:px-4">
                        <div class="p-2 bg-violet-600 items-center text-indigo-100 lg:w-full leading-none rounded-full flex lg:inline-flex" role="alert">
                            <span class="flex rounded-full bg-violet-900 uppercase px-2 py-1 text-xs font-bold mr-3">On going</span>
                            <span class="font-semibold mr-2 text-left flex-auto">{active}</span>
                            <svg class="fill-current opacity-75 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z"/></svg>
                        </div>
                    </div>
                </Link>
                }

                <Link to='/delivery'>
                <ActionButton>
                    <ActionButtonImg src={motor_icon}/>
                    Delivery
                </ActionButton>
                </Link>

                <Link to='/ride' >
                <ActionButton>
                    <ActionButtonImg src={car_icon} />
                    Ride
                </ActionButton>
                </Link>

                <Link to={'/earn'}>
                <ActionButton>
                    <ActionButtonImg src={money_icon}/>
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

const Name = tw.div`mr-2 text-s text-right`

const UserImage = tw.img`w-12 h-12 rounded-full border-grey-200 p-px transform hover:scale-105`

const ActionButtons = tw.div`flex flex-col pt-10`

const ActionButton = tw.div`flex flex-col bg-white mb-5 h-24 items-center justify-center rounded-lg transform hover:scale-105 transition`

const ActionButtonImg = tw.img`h-3/5`

