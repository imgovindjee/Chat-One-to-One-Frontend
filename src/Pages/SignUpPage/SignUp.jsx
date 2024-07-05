import React, { useState } from 'react'

import axios from 'axios'

import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast'

import { IoClose } from 'react-icons/io5'
import { IoMdImages } from "react-icons/io";

import uploadFiles from '../../Common/UploadFile/UploadProfile';



// Default userInfo Structure
const defaultDataStructure = {
    name: "",
    email: "",
    password: "",
    profile_img: ""
}




const SignUp = () => {

    // react route for changing the page
    const navigate = useNavigate();


    // hooks
    // to storing up the data
    const [data, setData] = useState(defaultDataStructure)

    // state hook for stroing the upload-profile-img
    const [uploadProfileImg, setUploadProfileImg] = useState("")


    // Function to handle the onChange on the field of "Name"
    const handleOnChange = (e) => {
        const { name, value } = e.target;
        // console.log(value);

        setData(currentValue => {
            return ({ ...currentValue, [name]: value })
        })
    }


    // function to handle the upload-profile..
    const handleOnChaneUploadProfile = async (e) => {
        const file = e.target.files[0];

        const uploadPhoto = await uploadFiles(file)
        console.log(uploadPhoto);

        setUploadProfileImg(file)

        // updating the URL to the data...
        setData((currentVal) => {
            return ({
                ...currentVal,
                profile_img: uploadPhoto?.url
            })
        })
    }


    // functio to handle the remove-uploaded-profile-image
    const handleRemoveUploadProfileImg = (e) => {
        e.preventDefault()
        e.stopPropagation()

        setUploadProfileImg("");
    }


    // function to handle the form submit
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation()

        console.log(data);

        // mkaing the server and frontend connection...
        try {
            // request for storing the data for the backend 
            const res = await axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/api/signup", data);
            console.log(res);

            
            // if we get response_of success = true
            if (res?.data?.success == 'true') {
                // showing the success message...
                toast.success(res?.data?.message)

                // reset the data to NORMAL 
                setData(defaultDataStructure);

                // navigate the user to signin-page..
                navigate('/email')
            } else{
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
                <h1 className='text-center text-4xl font-gelasio capitalize'>
                    WELCOME TO CHAT APP
                </h1>

                <form className='grid gap-3 mt-5' onSubmit={handleFormSubmit}>
                    {/* Name Field */}
                    <div className='flex flex-col gap-1'>
                        <label htmlFor="name">
                            Name:&nbsp;
                        </label>
                        <input
                            type="text"
                            id='name'
                            name='name'
                            placeholder='Enter Your name'
                            className='bg-slate-100 px-2 py-1 rounded-md focus:outline-primary'
                            value={data.name}
                            onChange={handleOnChange}
                            required
                        />
                    </div>

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

                    {/* Password field */}
                    <div className='flex flex-col gap-1'>
                        <label htmlFor="password">
                            Password:&nbsp;
                        </label>
                        <input
                            type="password"
                            id='password'
                            name='password'
                            placeholder='Enter Your password'
                            className='bg-slate-100 px-2 py-1 rounded-md focus:outline-primary'
                            value={data.password}
                            onChange={handleOnChange}
                            required
                        />
                    </div>

                    {/* profile_img upload.. */}
                    <div className="flex flex-col gap-1">
                        <label htmlFor="profile_img">
                            Photo:
                            <div className="h-14 bg-slate-200 flex justify-center items-center border rounded hover:border-primary cursor-pointer">
                                <p className="text-sm line-clamp-1 text-ellipsis max-w-[300px]">
                                    {
                                        uploadProfileImg.name ? (
                                            uploadProfileImg?.name
                                        ) : (
                                            `Upload Profile Image`
                                        )
                                    }
                                </p>

                                {/* some extra image styling... */}
                                {
                                    uploadProfileImg?.name ? (
                                        <button
                                            className='text-lg ml-2 hover:text-red-500'
                                            onClick={handleRemoveUploadProfileImg}
                                        >
                                            <IoClose />
                                        </button>
                                    ) : (
                                        <button className='text-lg ml-2 text-teal-800'>
                                            <IoMdImages />
                                        </button>
                                    )
                                }
                            </div>
                        </label>

                        <input
                            type="file"
                            id='profile_img'
                            name='profile_img'
                            className='hidden px-2 py-1 bg-slate-100'
                            onChange={handleOnChaneUploadProfile}
                        />
                    </div>


                    <button
                        className='bg-primary text-lg px-4 py-1 text-white font-medium hover:bg-secondary rounded mt-2 leading-relaxed tracking-wider'
                    >
                        Sign Up
                    </button>

                </form>


                <p className='text-center tracking-wider my-3'>
                    Already have account?&nbsp;&nbsp;
                    <Link
                        to={`/email`}
                        className='underline hover:text-primary'
                    >
                        Sign In
                    </Link>
                </p>

            </div>

        </div>
    )
}


export default SignUp