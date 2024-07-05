import React, { useEffect, useState } from 'react'

import axios from 'axios';

import { IoSearchOutline } from 'react-icons/io5'
import { IoClose } from 'react-icons/io5'

import toast, { Toaster } from 'react-hot-toast';

import Loader from '../Loader/Loader';
import SearchUserCard from '../SearchUserCard/SearchUserCard';




const SearchUsers = ({ onClose }) => {

    // hooks
    // to set the data of the search user
    const [searchUsers, setSearchUsers] = useState([]);

    // to setup the loading animation...
    const [loading, setLoading] = useState(false)

    // settig of the serach field data..
    const [searchData, setSearchData] = useState("");



    // funtion to find the search fron the DB
    const handleSearchUsers = async () => {
        try {

            // showing the loading animation during the search-behaviour
            setLoading(true);

            const res = await axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/api/search-users", { searchData })
            console.log(res);

            // removing the loading animation once the data is found..
            setLoading(false);

            setSearchUsers(res?.data?.user_info)

        } catch (error) {
            console.log(error)
            toast.error(error?.response?.data?.message)
        }
    }

    // real time fetching of the data from the server
    useEffect(() => {
        handleSearchUsers()
    }, [searchData])
    // console.log(searchUsers);




    return (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-slate-700 bg-opacity-40 p-2 z-10">
            <div className="w-full max-w-lg mx-auto mt-10">
                <Toaster />

                {/* displaying the search-box */}
                <div className='bg-white rounded overflow-hidden flex h-10'>
                    <input
                        type="text"
                        placeholder='Search User'
                        className='w-full outline-none py-1 h-full px-4'
                        value={searchData}
                        onChange={(e) => setSearchData(e.target.value)}
                    />

                    <div className='h-10 w-10 flex justify-center items-center cursor-pointer'>
                        <IoSearchOutline size={20} />
                    </div>
                </div>


                {/* displaying the search-user */}
                <div className='bg-white mt-2 w-full p-4 rounded'>
                    {/* showing the no user is found */}
                    {
                        searchUsers.length === 0 && !loading && (
                            <p className='text-center bg-slate-200 p-1 rounded' style={{ letterSpacing: 1 }}>
                                No User Found
                            </p>
                        )
                    }

                    {/* showing the loading animations.. */}
                    {
                        loading && (
                            <Loader />
                        )
                    }

                    {/* if user exists */}
                    {
                        searchUsers.length !== 0 && !loading && (
                            searchUsers.map((user, index) => {
                                return (
                                    <SearchUserCard
                                        onClose={onClose}
                                        user={user}
                                        index={index}
                                        userId={user?._id}
                                    />
                                )
                            })
                        )
                    }
                </div>

            </div>

            <div
                onClick={onClose}
                className="absolute top-0 right-0 text-2xl p-2 lg:text-4xl text-slate-700 hover:text-slate-500 cursor-pointer"
            >
                <button>
                    <IoClose size={25} />
                </button>
            </div>

        </div>
    )
}

export default SearchUsers
