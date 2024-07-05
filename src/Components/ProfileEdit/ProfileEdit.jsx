import React, { useEffect, useRef, useState } from 'react'

import axios from 'axios'

import { useDispatch } from 'react-redux'
import toast, { Toaster } from 'react-hot-toast'

import { setUser } from '../../Redux/userSlice'
import UserProfile from '../UserProfile/UserProfile'
import uploadFiles from '../../Common/UploadFile/UploadProfile'





const ProfileEdit = ({ onClose, user }) => {
    // Default Data-Structure for storing the value..
    const defaultDataStructure = {
        name: user?.name,
        profile_img: user?.profile_img
    }
    // console.log(user)

    // targating the HTML elemt using "useRef"
    const uploadImageRef = useRef()

    // updating the data to the resdux store...
    const dispatch = useDispatch();


    // hooks for the setting of the data..
    const [data, setData] = useState(defaultDataStructure)

    // setting up the real time data value...
    useEffect(() => {
        setData(currentVal => {
            return ({
                ...currentVal, ...user
            })
        })
    }, [user])


    // function to handle the onchange event
    const handleOnChange = (e) => {
        const { name, value } = e.target

        setData(currentVal => {
            return ({
                ...currentVal, [name]: value
            })
        })
    }


    // function to handle the profile upload
    const handleUploadImage = (e) => {
        e.preventDefault();
        e.stopPropagation()

        uploadImageRef.current.click()
    }


    // function to handle the profile image change
    const handleUploadProfileImage = async (e) => {
        const file = e.target.files[0];

        const uploadPhoto = await uploadFiles(file)
        console.log(uploadPhoto);

        // updating the URL to the data...
        setData((currentVal) => {
            return ({
                ...currentVal,
                profile_img: uploadPhoto?.url
            })
        })
    }


    // function to handle the form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation()

        try {
            console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
            const URL = import.meta.env.VITE_SERVER_DOMAIN + "/api/update-user";

            const replacer = (key, value) => {
                if (typeof value === 'object' && value !== null) {
                  if (value.io !== undefined) delete value.io;
                  if (value.nsps !== undefined) delete value.nsps;
                }
                return value;
              };
            // console.log(JSON.parse(JSON.stringify(data, replacer)));
            // const _data_format = JSON.parse(JSON.stringify(data, replacer))

            const res = await axios({
                method: 'post',
                url: URL,
                data: JSON.parse(JSON.stringify(data, replacer)),
                withCredentials: true
            })
            console.log(res)
            toast.success(res?.data?.message);

            if (res?.data?.success == 'true') {
                dispatch(setUser(res?.data?.user_info))
                onClose()
            }

        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message);
        }
    }





    return (
        <div className='fixed top-0 bottom-0 left-0 right-0 bg-gray-700 bg-opacity-40 flex justify-center items-center z-10'>
            <div className="bg-white p-4 m-1 rounded w-full max-w-sm">

                <h2 className='font-medium text-2xl text-center'>
                    PROFILE DETAILS
                </h2>
                <p className="text-sm text-center underline text-grey" style={{ letterSpacing: 1 }}>
                    Edit User Details
                </p>


                <Toaster />
                <form className='grid gap-3 mt-3' onSubmit={handleSubmit}>

                    {/* user prfoile image */}
                    <div className='flex flex-col justify-center items-center'>
                        <div className='my-1'>
                            <UserProfile
                                width={70}
                                height={70}
                                profile_img={data?.profile_img}
                                name={data?.name}
                            />
                        </div>
                        <label htmlFor="profile_img">
                            <button
                                onClick={handleUploadImage}
                                className='bg-gray-200 p-1 rounded-full px-2 mt-2 font-semibold hover:bg-gray-300'
                            >
                                Upload Photo
                            </button>
                            <input
                                ref={uploadImageRef}
                                type="file"
                                id='profile_img'
                                className='hidden'
                                onChange={handleUploadProfileImage}
                            />
                        </label>
                    </div>

                    {/* UserName */}
                    <div className='flex flex-col gap-1'>
                        <label htmlFor="name">
                            Name: &nbsp;
                        </label>
                        <input
                            type="name"
                            name='name'
                            id='name'
                            value={data.name}
                            onChange={handleOnChange}
                            className='w-full py-1 px-2 focus:outline-primary border-0.5 bg-gray-100 rounded'
                        />
                    </div>

                    {/* Email */}
                    <div className='flex flex-col gap-1'>
                        <label htmlFor="Email">
                            Email: &nbsp;
                        </label>
                        <input
                            type="email"
                            name='email'
                            id='email'
                            value={data.email}
                            className='w-full py-1 px-2 focus:outline-primary border-0.5 bg-gray-300 rounded cursor-not-allowed'
                            disabled
                        />
                    </div>


                    <div className='flex gap-2 w-fit ml-auto mt-3'>
                        <button onSubmit={handleSubmit} className='border-primary border text-primary px-4 py-1 rounded hover:bg-slate-100'>
                            Save
                        </button>
                        <button onClick={onClose} className='border-primary bg-primary text-white border px-4 py-1 rounded hover:bg-secondary'>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ProfileEdit