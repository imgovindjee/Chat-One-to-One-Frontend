import React, { useState, useEffect } from 'react'

import axios from 'axios'

import { Link, useLocation, useNavigate } from 'react-router-dom';
import {useDispatch} from 'react-redux'
import toast, { Toaster } from 'react-hot-toast'

import { setToken, setUser } from '../../../Redux/userSlice';
import { PiUserCircle } from 'react-icons/pi';

import UserProfile from '../../../Components/UserProfile/UserProfile';



// Default userInfo Structure
const defaultDataStructure = { password: "" }



const CheckPassword = () => {

    // accessing the redux-store for setting up the data
    const dispatch = useDispatch()

    // react route for changing the page
    const navigate = useNavigate();

    // getting the location form the page
    const location = useLocation()

    // REAL TIME HANDLEING OF THE DTA...
    useEffect(() => {
        if (!location?.state?.name) {
            navigate('/email');
        }
    }, [])

    // destructuring the data getting from the loaction while resdirecting the page
    // const { state: { name, profile_img } } = location
    // console.log(name)
    // console.log(profile_img)
    // console.log(location)


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
            const res = await axios({
                method: 'post',
                url: import.meta.env.VITE_SERVER_DOMAIN + "/api/password",
                data: {
                    userId: location?.state?._id,
                    password: data.password
                },
                withCredentials: true
            });
            console.log(res);


            // if we get response_of success = true
            if (res?.data?.success == 'true') {
                // showing the success message...
                toast.success("Loged in Successfully")

                // setting up the data[user_info] to the redux-store 
                dispatch(setToken(res?.data?.token))

                // setting up the token to the localstorage...
                localStorage.setItem('token', res?.data?.token)
                

                // reset the data to NORMAL and 
                // navigate the user to signin-page..
                setData(defaultDataStructure)
                navigate('/');                
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


            <div className="bg-white w-full max-w-sm rounded overflow-hidden p-4 mx-auto">
                <Toaster />

                {/* User name and image */}
                <div className='mx-auto w-fit flex flex-col items-center justify-center'>
                    {/* profile image of the user */}
                    <UserProfile
                        name={location?.state?.name}
                        profile_img={location?.state?.profile_img}
                        width={70}
                        height={70}
                    />

                    {/* name of the user */}
                    <h2 className='pt-1 text-lg font-semibold'>
                        {location?.state?.name}
                    </h2>
                </div>

                <form className='grid gap-3 mt-5' onSubmit={handleFormSubmit}>
                    {/* Password field */}
                    <div className='flex flex-col gap-1'>
                        <label htmlFor="password">
                            Password:&nbsp;
                        </label>
                        <input
                            type="password"
                            id='password'
                            name='password'
                            placeholder='Enter Your Password'
                            className='bg-slate-100 px-2 py-1 rounded-md focus:outline-primary'
                            value={data.password}
                            onChange={handleOnChange}
                            required
                        />
                    </div>

                    <button
                        className='bg-primary text-lg px-4 py-1 text-white font-medium hover:bg-secondary rounded mt-2 leading-relaxed tracking-wider'
                    >
                        Login
                    </button>

                </form>


                <p className='text-center tracking-wider my-3'>
                    <Link
                        to={`/change-password`}
                        className='underline hover:text-primary'
                    >
                        Forgot Password
                    </Link>
                </p>

            </div>

        </div>
    )
}

export default CheckPassword
