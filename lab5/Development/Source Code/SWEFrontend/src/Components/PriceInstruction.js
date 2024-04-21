import React from 'react';

// PriceInstruction component is used to display the price and instructions input fields
// The component is used in the Delivery and Ride pages to get the price and instructions from the user
// @param setPrice - function to update the price state
// @param setInstructions - function to update the instructions state
// @returns JSX
const PriceInstruction = ({ setPrice, setInstructions}) => {
    return (
        <div className="w-full bg-white flex items-center px-4 ">
            <div className="w-10 flex flex-col mr-2 items-center gap-5">
                <img className="h-8" src="https://www.svgrepo.com/show/41024/cash.svg" alt="cash"/>
                <img className="h-8" src="https://www.svgrepo.com/show/337500/instruction.svg" alt="instructions"/>
            </div>
            <div className="flex flex-col flex-1 px-4 py-2" >
                <input 
                    type='number' 
                    className='h-10 bg-gray-200 my-2 rounded-2 p-2 outline-none border-none w-full' 
                    placeholder='Enter Price' 
                    onChange={(e)=>setPrice(e.target.value)}
                />
                <textarea 
                    className="h-10 bg-gray-200 my-2 rounded-2 p-2 outline-none border-none w-full"
                    placeholder='Enter Instructions' 
                    onChange={(e)=>setInstructions(e.target.value)}
                />
            </div>
        </div>
    );
};

export default PriceInstruction;