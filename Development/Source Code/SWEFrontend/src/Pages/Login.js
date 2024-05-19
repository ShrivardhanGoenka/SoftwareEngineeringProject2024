import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import url from "../jsondata/url.json"

// Login component is used to allow the user to login
// The component allows the user to enter the username and password
// The component allows the user to login
// The component will show an error message if the user does not enter the correct username or password
// On successful login, the user will be redirected to the home page
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
                setError("Invalid username or password. Username is case sensitive.");
            }
        }).catch(error => { console.log(error) });
    }

    return (
        <div className="flex flex-col items-center  bg-violet-100 h-screen">
            <div className="mt-[20%]">
                <div className="font-semibold text-4xl md-10">Login</div>
            </div>
                <div className="w-full flex flex-col items-center mt-10">
                    <input type="text" placeholder="Username" className="w-[80%] h-10 my-5 rounded-xl border-none px-4 shadow-md" value={username} onChange={(e)=>{setUsername(e.target.value)}} />
                    <input type="password" placeholder="Password" className="w-[80%] h-10 mt-5 rounded-xl border-none px-4 shadow-md" value={password} onChange={(e)=>{setPassword(e.target.value)}} />
                    <div className="w-full text-center text-red-500 min-h-7">{error}</div>
                </div>
                <button className={`w-[80%] h-10 font-semibold hover:text-white bg-white hover:bg-indigo-500 border border-indigo-500 hover:border-transparent rounded-xl mt-10 shadow-md`} onClick={onLogin}>Login</button>
                <div className="mt-2">Don't have an account? <Link to="/signup" className="text-blue-500">Register</Link></div>
        </div>
 
    )
}

export default Login;


