import React, { useState , useEffect } from 'react';
import url from "../jsondata/url.json";

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
        <div className="flex flex-row justify-center ">
            <div className="bg-[#D9D9D9] w-[350px] md:w-[500px] flex flex-col items-center rounded-lg my-10 p-10">
                <div className="font-chalkboard-bold text-4xl mt-7 md:mt-10 mb-4">Sign Up</div>

                    <input className='w-[80%] my-3 rounded-2xl py-2 px-4' placeholder="Username" name="username" onChange={handleChange} />
                    <input className='w-[80%] my-3 rounded-2xl py-2 px-4' placeholder="Email" name="email" type="email" onChange={handleChange} />
                    <input className='w-[80%] my-3 rounded-2xl py-2 px-4' placeholder="Password" name="password" type="password" onChange={handleChange} />
                    <input className='w-[80%] my-3 rounded-2xl py-2 px-4' placeholder="Confirm Password" name="confirmPassword" type="password" onChange={handleChange} />
                    <input className='w-[80%] my-3 rounded-2xl py-2 px-4' placeholder="Name" name="name" onChange={handleChange} />
                    <input className='w-[80%] my-3 rounded-2xl py-2 px-4' placeholder="Phone" name="phone" onChange={handleChange} />
                    <input className='w-[80%] my-3 rounded-2xl py-2 px-4' placeholder="Address" name="address" onChange={handleChange} />

                    <div className='w-full flex justify-center'>
                        <input className='mr-2' type="checkbox" id="hasCar" name="hasCar" onChange={handleCheckBox} />
                        <label htmlFor="hasCar">I have a car</label>
                    </div>
                    {state.hasCar && (
                        <>
                            <input className='w-[80%] my-3 rounded-2xl py-2 px-4' placeholder="licence Plate" name="licencePlate" onChange={handleChange} />
                            <input className='w-[80%] my-3 rounded-2xl py-2 px-4' placeholder="Model" name="model" onChange={handleChange} />
                            <input className='w-[80%] my-3 rounded-2xl py-2 px-4' placeholder="Color" name="color" onChange={handleChange} />
                        </>
                    )}
                    <div className="w-full text-center text-red-500 min-h-7">{errors}</div>
                    <button className='w-[80%] mt-10 py-2 px-6 bg-white rounded-full' onClick={handleSubmit}>Submit</button>
            </div>
        </div>
    );
}

export default SignUp;