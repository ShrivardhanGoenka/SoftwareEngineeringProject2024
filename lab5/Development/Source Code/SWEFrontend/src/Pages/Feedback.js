import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react';
import Swal from 'sweetalert2'

import submitRating from '../APICalls/submitRating';

// Feedback component is used to submit feedback for a ride
// The component allows the user to submit a rating and review for the ride
// On successful submission of the feedback, the user will be redirected to the home page
function Feedback() {
    const location = useLocation();
    const navigate = useNavigate();
    const ride_id = location.state.ride_id;
    const [rating, setRating] = useState(1);
    const [review, setReview] = useState('');

    const handleRatingChange = (event) => {
        setRating(parseInt(event.target.value));
    };

    function handleSubmit() {
        if (review === '') {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Please enter a review',
            });
            return;
        }

        submitRating(ride_id, rating, review).then((response) => {
            if (response) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Feedback submitted successfully',
                });
                navigate('/');
            }
        });
    }

    return (
        <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4'>
            <div className='w-full max-w-md p-5 bg-white rounded-lg shadow'>
                <h1 className='text-xl font-semibold text-gray-800'>Please give feedback about your ride</h1>
                
                <div className='mt-4'>
                    <label htmlFor="rating" className='block text-sm font-medium text-gray-700'>Your Rating</label>
                    <select id="rating" className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm' value={rating} onChange={handleRatingChange}>
                        <option value="" disabled>Select Rating</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </select>
                </div>
    
                <div className='mt-4'>
                    <label htmlFor="review" className='block text-sm font-medium text-gray-700'>Review</label>
                    <textarea id="review" className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm' value={review} onChange={(event) => setReview(event.target.value)} placeholder='Share your experience...' />
                </div>
    
                <button className='mt-4 w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500' onClick={handleSubmit}>
                    Submit
                </button>
            </div>
        </div>
    )
}

export default Feedback;