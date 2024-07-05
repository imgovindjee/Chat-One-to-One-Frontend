import React from 'react'

import {Link} from 'react-router-dom' 

import UserProfile from '../UserProfile/UserProfile'



const SearchUserCard = ({ user, index, userId, onClose }) => {
    return (
        <Link
            to={"/"+user?._id}
            onClick={onClose}
            className="flex items-center gap-4 p-2 border border-transparent border-b-slate-200 hover:bg-gray-100 cursor-pointer rounded"
            id={index}
        >

            <div>
                <UserProfile
                    width={50}                                                                                                           
                    height={50}
                    name={user?.name}
                    profile_img={user?.profile_img}
                    userId={userId}
                />
            </div>

            <div>
                <div className='font-semibold line-clamp-1 text-ellipsis'>
                    {user?.name}
                </div>
                <p className='text-sm text-gray-500 line-clamp-1 text-ellipsis'>
                    {user?.email}
                </p>
            </div>

        </Link>
    )
}

export default SearchUserCard