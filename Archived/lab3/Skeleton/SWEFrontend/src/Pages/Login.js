import React from "react";
import { Link, Navigate } from "react-router-dom";
import { useState } from "react";
import url from "../jsondata/url.json"
import Cookie from "js-cookie";

const Login = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");


    function onLogin() {
        if (username === "" || password === "") {
            setError("Please fill in all the fields");
            return;
        }
        setError("");
        // Add login functionality here
        var body = {
            username: username,
            password: password
        }
        fetch(url.url + "/accounts/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body),
        }).then(response => {
            if (response.status === 200) {
                setError("");
                response.json().then(data => {
                    localStorage.setItem("auth-token", data.token);
                    window.location.href = "/";
                });
            }
            else {
                setError("Invalid username or password");
            }
        }).catch(error => { console.log(error) });

        // If login is successful, redirect to home page

        // If login is unsuccessful, display error message

    }

    return (
        <div className="flex flex-row items-center justify-center h-screen">
            <div className="bg-[#D9D9D9] w-[350px] md:w-[500px] flex flex-col items-center justify-center rounded-lg h-screen" >
                <div className="font-chalkboard-bold text-4xl mt-7 md:mt-10">Login</div>
                <div className="w-full flex flex-col items-center mt-10">
                    <input type="text" placeholder="Username" className="w-[80%] h-10 my-5 rounded-xl border-none px-4" value={username} onChange={(e)=>{setUsername(e.target.value)}} />
                    <input type="password" placeholder="Password" className="w-[80%] h-10 mt-5 rounded-xl border-none px-4" value={password} onChange={(e)=>{setPassword(e.target.value)}} />
                    {/* Need to add forgot password page and link here */}
                    <div className="w-full text-right pr-14 mt-2">Forgot Password?</div>
                    <div className="w-full text-center text-red-500 min-h-7">{error}</div>
                </div>
                <button className={`w-[80%] h-10 bg-white rounded-xl mt-24 md:mt-44`} onClick={onLogin}>Login</button>
                <div className="mt-2">Don't have an account? <Link to="/signup" className="text-blue-500">Register</Link></div>
            </div>
        </div>
 
    )
}

export default Login;