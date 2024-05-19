import React, { useState } from 'react';
import url from "../jsondata/url.json";

// SignUp component is used to allow the user to sign up
// The component allows the user to enter the username, email, password, confirm password, name, phone, and address
// The component allows the user to enter the car details if the user has a car
// The component allows the user to sign up
// The component will show an error message if the user does not enter the correct details
// On successful sign up, the user will be redirected to the home page
const SignUp = () => {

    const [state, setState] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        phone: '',
        address: '',
        hasCar: false,
        licencePlate: '',
        model: '',
        color: '',
    });

    const [errors, setErrors] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setState(prevState => ({
          ...prevState,
          [name]: value
        }));
    };

    const handleCheckBox = (e) => {
        setState(prevState => ({
            ...prevState,
            hasCar: e.target.checked
        }));
    };

    const validateForm = () => {
        setErrors('');
        let formIsValid = true;

        if (!state.username || !state.email || !state.password || !state.confirmPassword || !state.name || !state.phone || !state.address) {
            formIsValid = false;
            setErrors("All fields are required");
        }

        if (state.email && !/\S+@\S+\.\S+/.test(state.email)) {
            formIsValid = false;
            setErrors("Email is invalid");
        }

        if (state.phone && !/^\d{8}$/.test(state.phone)) {
            formIsValid = false;
            setErrors("Phone number is invalid");
        }

        if (state.username && state.username.length < 5) {
            formIsValid = false;
            setErrors("Username should be minimum 5 characters");
        }

        if (state.username && /\s/.test(state.username)) {
            formIsValid = false;
            setErrors("Username should not contain spaces");
        }

        if (state.password && state.password.length < 8) {
            formIsValid = false;
            setErrors("Password should be minimum 8 characters");
        }

        if (state.password !== state.confirmPassword) {
            formIsValid = false;
            setErrors("Password and confirm password should match");
        }

        if (state.hasCar && (!state.licencePlate || !state.model || !state.color)) {
            formIsValid = false;
            setErrors("All car details should be provided");
        }
        return formIsValid;
    }

  
    const handleSubmit = () => {
        if(validateForm()) {
            const body = {
                username: state.username,
                email: state.email,
                password: state.password,
                name: state.name,
                phone: state.phone,
                address: state.address,
                hasCar: state.hasCar,
                licencePlate: state.licencePlate,
                model: state.model,
                color: state.color
            }

            fetch(url.url + "/accounts/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body),
            }).then(response => {
                if (response.status === 200) {
                    alert("User created successfully");
                    response.json().then(data => {
                        localStorage.setItem("auth-token", data.token);
                        window.location.href = "/";
                    });
                }
                else {
                    response.json().then(data => {
                        setErrors(data.error);
                    });
                }
            }).catch(error => { console.log(error) });
        }
    }

    return (
        <div className="flex flex-col items-center justify-center bg-violet-100 min-h-svh ">
                <div className="font-semibold text-4xl mt-7 md:mt-10 mb-4">Sign Up</div>

                    <input className='w-[80%] my-3 rounded-2xl py-2 px-4 shadow-md' placeholder="Username" name="username" onChange={handleChange} />
                    <input className='w-[80%] my-3 rounded-2xl py-2 px-4 shadow-md' placeholder="Email" name="email" type="email" onChange={handleChange} />
                    <input className='w-[80%] my-3 rounded-2xl py-2 px-4 shadow-md' placeholder="Password" name="password" type="password" onChange={handleChange} />
                    <input className='w-[80%] my-3 rounded-2xl py-2 px-4 shadow-md' placeholder="Confirm Password" name="confirmPassword" type="password" onChange={handleChange} />
                    <input className='w-[80%] my-3 rounded-2xl py-2 px-4 shadow-md' placeholder="Name" name="name" onChange={handleChange} />
                    <input className='w-[80%] my-3 rounded-2xl py-2 px-4 shadow-md' placeholder="Phone" name="phone" onChange={handleChange} />
                    <input className='w-[80%] my-3 rounded-2xl py-2 px-4 shadow-md' placeholder="Address" name="address" onChange={handleChange} />

                    <div className='w-full flex justify-center'>
                        <input className='mr-2' type="checkbox" id="hasCar" name="hasCar" onChange={handleCheckBox} />
                        <label htmlFor="hasCar">I have a car</label>
                    </div>
                    {state.hasCar && (
                        <>
                            <input className='w-[80%] my-3 rounded-2xl py-2 px-4 shadow-md' placeholder="Licence Plate" name="licencePlate" onChange={handleChange} />
                            <input className='w-[80%] my-3 rounded-2xl py-2 px-4 shadow-md' placeholder="Model" name="model" onChange={handleChange} />
                            <input className='w-[80%] my-3 rounded-2xl py-2 px-4 shadow-md' placeholder="Color" name="color" onChange={handleChange} />
                        </>
                    )}
                    <div className="w-full text-center text-red-500 min-h-7">{errors}</div>
                    <button className='w-[80%] mb-8 mt-10 py-2 px-6 font-semibold hover:text-white bg-white hover:bg-indigo-500 border border-indigo-500 hover:border-transparent rounded-full shadow-md' onClick={handleSubmit}>Submit</button>
        </div>
    );
}

export default SignUp;