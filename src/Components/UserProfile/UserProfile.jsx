import React from 'react'

import { useSelector } from 'react-redux'

import { PiUserCircle } from 'react-icons/pi'



const UserProfile = ({ name, profile_img, width, height, userId }) => {


    // extracting the dat of the onlineuser form the REDUX-STROE
    const onlineUser = useSelector(state => state?.user?.onlineUser);


    // making the PROFILE-IMG from username if not profile-img is not available
    const getName = () => {
        let _name = ""

        // if name exists..
        if (name) {
            const splitedArray = name.split(" ");

            // checking
            if (splitedArray.length > 1) {
                _name = splitedArray[0][0] + splitedArray[1][0]
            } else {
                _name = splitedArray[0][0]
            }
        }
        return _name.toUpperCase();
    }


    // background color
    const bgcolor = [
        "bg-voilet-200",
        "bg-orange-200",
        "bg-blue-200",
        "bg-teal-200",
        "bg-grey-200",
        "bg-pink-200",
        "bg-red-200",
        "bg-yellow-200",
        "bg-slate-200",
        "bg-sky-200",
        "bg-cyan-200"
    ]


    // is online-user
    const isOnline = onlineUser.includes(userId)

    return (
        <div
            style={{ width: width + "px", height: height + "px" }}
            className={`text-slate-800 relative rounded-full border text-xl font-mono`}
        >
            {
                profile_img ? (
                    <img
                        src={profile_img}
                        alt="PROFILE_IMG"
                        width={width}
                        height={height}
                        className='overflow-hidden rounded-full'
                    />
                ) : (
                    name ? (
                        <div
                            style={{ width: width + "px", height: height + "px" }}
                            className={`overflow-hidden rounded-full flex justify-center items-center text-2xl shadow border ${bgcolor[Math.floor(Math.random() * 11)]}`}
                        >
                            {getName()}
                        </div>
                    ) : (
                        <PiUserCircle size={width} />
                    )
                )
            }

            {/* showing the active symbol when user id online */}
            {
                isOnline && (
                    <div className="bg-green-600 p-1 absolute bottom-2 -right-0 z-10 rounded-full">

                    </div>
                )
            }
        </div>
    )
}

export default UserProfile
