import React, { useEffect } from "react";
import hamburger from "../images/hamburger.png"
import { Link, useActionData } from "react-router-dom";
import url from "../jsondata/url.json"

const Navbar = () => {

    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    useEffect(() => {
        const token = localStorage.getItem("auth-token");
        if (token) {
            setIsLoggedIn(true);
        }
    } ,[]);

    const onLogout = () => {
        fetch(url.url + "/accounts/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("auth-token")
            }, 
        });
        localStorage.removeItem("auth-token");
        setIsLoggedIn(false);
    }

    return (
        <>
            <div className="sm:block md:hidden">
                <div className="min-w-screen bg-[#D9D9D9] h-[10vh] flex flex-row items-center">
                    <img src={hamburger} alt="hamburger" className="w-10 h-10 cursor-pointer ml-[10vw]" />
                    <div className="font-chalkboard-bold text-3xl ">PROFIT PATH</div>
                </div>
            </div>
            <div className="hidden md:block">
                <div className="min-w-screen bg-[#D9D9D9] h-[10vh] flex flex-row items-center justify-between">
                    <Link to={'/'} className="font-chalkboard-bold text-3xl ml-10">PROFIT PATH</Link>
                    {isLoggedIn && 
                        <div className="flex flex-row font-chalkboard-bold text-2xl p-10">
                            <Link to={"/earn"} className="mx-5 tracking-tighter">Earn!</Link>
                            <Link to={"/ride"} className="mx-5 tracking-tighter">Hail a ride</Link>
                            <Link to={"/delivery"} className="mx-5 tracking-tigher">Request a delivery</Link>
                            <Link to={"/profile"} className="mx-5 tracking-tighter">Profile</Link>
                            <Link to={"/"} className="mx-5 tracking-tighter" onClick={onLogout}>Logout</Link>
                        </div>
                    }
                    {!isLoggedIn && (
                        <div className="flex flex-row font-chalkboard-bold text-2xl p-10">
                            <Link to="/login" className="mx-5 tracking-tighter">Login</Link>
                            <Link to="/signup" className="mx-5 tracking-tighter">Register</Link>
                        </div>
                    )}                   

                </div>
            </div>
        </>

    )
}

export default Navbar;