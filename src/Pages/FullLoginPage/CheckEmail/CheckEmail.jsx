import React, { useState } from 'react'

import axios from 'axios'

import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast'

import { PiUserCircle } from 'react-icons/pi';


// Default userInfo Structure
const defaultDataStructure = { email: "" }



const CheckEmail = () => {

    // react route for changing the page
    const navigate = useNavigate();


    // hooks
    // to storing up the data
    const [data, setData] = useState(defaultDataStructure)

    // Function to handle the onChange on the field of "Name"
    const handleOnChange = (e) => {
        const { name, value } = e.target;
        // console.log(value);

        setData(currentValue => {
            return ({ ...currentValue, [name]: value })
        })
    }


    // function to handle the form submit
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation()

        console.log(data);

        // mkaing the server and frontend connection...
        try {
            // request for storing the data for the backend 
            const res = await axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/api/email", data);
            console.log(res);


            // if we get response_of success = true
            if (res?.data?.success == 'true') {
                // showing the success message...
                toast.success(res?.data?.message)

                // reset the data to NORMAL 
                setData(defaultDataStructure);

                // navigate the user to signin-page..
                navigate('/password', {
                    state: res.data.user_info
                })
            } else {
                toast.error(res?.data?.message);
            }

        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message);
        }
    }






    return (
        <div className='mt-5'>

            <Toaster />

            <div className="bg-white w-full max-w-sm rounded overflow-hidden p-4 mx-auto">
                {/* User Logo */}
                <div className='mx-auto w-fit'>
                    <PiUserCircle size={80} />
                </div>

                <h1 className='text-center text-4xl font-gelasio capitalize'>
                    WELCOME BACK
                </h1>

                <form className='grid gap-3 mt-5' onSubmit={handleFormSubmit}>
                    {/* Email field */}
                    <div className='flex flex-col gap-1'>
                        <label htmlFor="email">
                            Email:&nbsp;
                        </label>
                        <input
                            type="email"
                            id='email'
                            name='email'
                            placeholder='Enter Your Email'
                            className='bg-slate-100 px-2 py-1 rounded-md focus:outline-primary'
                            value={data.email}
                            onChange={handleOnChange}
                            required
                        />
                    </div>

                    <button
                        className='bg-primary text-lg px-4 py-1 text-white font-medium hover:bg-secondary rounded mt-2 leading-relaxed tracking-wider'
                    >
                        Verify
                    </button>

                </form>


                <p className='text-center tracking-wider my-3'>
                    Don't have an account?&nbsp;&nbsp;
                    <Link
                        to={`/signup`}
                        className='underline hover:text-primary'
                    >
                        JOIN US TODAY
                    </Link>
                </p>

            </div>

        </div>
    )
}

export default CheckEmail
