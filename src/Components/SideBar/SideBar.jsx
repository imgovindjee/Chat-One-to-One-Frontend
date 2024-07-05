import react, { useState, useEffect } from 'react'

import { NavLink, useNavigate } from 'react-router-dom'

import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../Redux/userSlice'

import { BiLogOut } from 'react-icons/bi'
import { FaImage, FaUserPlus, FaVideo } from 'react-icons/fa'
import { IoChatbubbleEllipses } from 'react-icons/io5'
import { FiArrowUpLeft } from 'react-icons/fi'

import UserProfile from '../UserProfile/UserProfile'
import ProfileEdit from '../ProfileEdit/ProfileEdit'
import Mixer from '../MIxer/Mixer'
import SearchUsers from '../SearchUsers/SearchUsers'
import moment from 'moment'





const SideBar = () => {

    // page changing in the real-time
    const navigate = useNavigate()

    // accessing the resux items...
    const dispatch = useDispatch()

    // accessing the user details fonr the resux-store
    const user = useSelector(state => state.user)

    // accesssing the socketConnection form the reduc store
    const socketConnection = useSelector(state => state?.user?.socketConnection)

    // hooks
    // for the editing the profile details
    const [profileEdit, setProfileEdit] = useState(false);

    // USER-FRIEND CHATS OR GROUP
    const [allUser, setAllUser] = useState([]);

    // making the search-user[make-friend-zone]
    const [searchUsers, setSearchUsers] = useState(false);


    // function to handle the logOut
    const handleLogOut = () => {
        try {
            dispatch(logout());

            navigate('/email')
            localStorage.clear();
        } catch (error) {
            console.log(error);
        }
    }




    // Fetching the chatted user.. previously
    useEffect(() => {
        try {
            if (socketConnection) {
                socketConnection.emit("sidebar", user?._id);


                // receiving the data from the backend in real-time using SOCKET and DB
                socketConnection.on('latest-conversation', (data) => {
                    console.log("latest: ", data)

                    // structuring the data
                    const latestConversation = data.map((u, i) => {

                        // if you are chatting with self...
                        if (u.sender?._id === u.receiver?._id) {
                            return {
                                ...u,
                                user_info: u.sender
                            }
                        }

                        // chatting with others...
                        else if (u.receiver?._id !== user._id) {
                            return {
                                ...u,
                                user_info: u.receiver
                            }
                        } else {
                            return {
                                ...u,
                                user_info: u.sender
                            }
                        }
                    })

                    // setting all the latest-cnversation of the user
                    setAllUser(latestConversation)
                    console.log(allUser);
                })
            }
        } catch (error) {
            console.log(error)
        }

    }, [socketConnection, user])





    return (
        <div className='w-full h-full grid grid-cols-[48px,1fr] bg-white'>

            <div className="bg-slate-100 w-12 h-full rounded-tr-lg rounded-br-lg py-5 text-slate-600 flex flex-col justify-between">
                <div>
                    {/* icons */}
                    <NavLink className={({ isActive }) => `w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 hover:rounded ${isActive && `bg-slate-200`}`} title='Messages'>
                        <IoChatbubbleEllipses size={20} />
                    </NavLink>

                    <div
                        className='w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 hover:rounded mt-1'
                        title='Add Friends'
                        onClick={() => setSearchUsers(true)}
                    >
                        <FaUserPlus size={20} />
                    </div>
                </div>

                <div className='flex flex-col items-center'>
                    <button
                        className='mx-auto mb-3 cursor-pointer'
                        title={user.name}
                        onClick={() => setProfileEdit(true)}
                    >
                        <UserProfile
                            width={35}
                            height={35}
                            name={user?.name}
                            profile_img={user?.profile_img}
                            userId={user?._id}
                        />
                    </button>
                    <button
                        className='w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 hover:rounded'
                        title='LogOut'
                        onClick={handleLogOut}
                    >
                        <span className='-ml-2'>
                            <BiLogOut size={20} />
                        </span>
                    </button>
                </div>
            </div>


            <div className="w-full">
                <div className="flex item-center h-12">
                    <h2 className='text-xl font-bold p-3 pl-4 text-slate-700'>
                        Message
                    </h2>
                </div>
                <Mixer />

                {/* Message section */}
                <div className='h-[calc(100vh-65px)] overflow-x-hidden overflow-y-auto scrollbar'>
                    {
                        !allUser.length && (
                            <div className='mt-14'>
                                <div className="flex justify-center item-center my-4 text-slate-500">
                                    <FiArrowUpLeft size={50} />
                                </div>
                                <p className='text-lg text-center text-slate-500'>
                                    Explore By making Friends, To start a Conversation
                                </p>
                            </div>
                        )
                    }

                    {
                        allUser.map((latestConversation, index) => {
                            return (
                                <NavLink
                                    to={"/" + latestConversation?.user_info?._id}
                                    key={latestConversation?._id}
                                    id={index}
                                    className="flex items-center gap-2 py-3 px-2 border-b hover:bg-slate-100 cursor-pointer justify-between"
                                >
                                    <div className='flex gap-2'>
                                        <div>
                                            <UserProfile
                                                profile_img={latestConversation?.user_info?.profile_img}
                                                name={latestConversation?.user_info?.name}
                                                width={40}
                                                height={40}
                                            />
                                        </div>

                                        <div>
                                            <h3 className='line-clamp-1 text-ellipsis text-base font-semibold'>
                                                {latestConversation?.user_info?.name}
                                            </h3>
                                            <div className='text-xs text-slate-400 line-clamp-1 flex items-center gap-1'>
                                                <div className='flex items-center gap-1'>
                                                    {
                                                        latestConversation?.lastMessage?.imageURL && (
                                                            <div className="flex items-center gap-1">
                                                                <span>
                                                                    <FaImage />
                                                                </span>
                                                                {
                                                                    !latestConversation?.lastMessage?.text && (
                                                                        <span>Image</span>
                                                                    )
                                                                }
                                                            </div>
                                                        )
                                                    }
                                                    {
                                                        latestConversation?.lastMessage?.videoURL && (
                                                            <div className="flex items-center gap-1">
                                                                <span>
                                                                    <FaVideo />
                                                                </span>
                                                                {
                                                                    !latestConversation?.lastMessage?.text && (
                                                                        <span>Video</span>
                                                                    )
                                                                }
                                                            </div>
                                                        )
                                                    }
                                                </div>
                                                <p className='text-xs text-slate-400 line-clamp-1 text-ellipsis'>
                                                    {latestConversation?.lastMessage?.text}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        {
                                            latestConversation?.lastMessage?.createdAt && (
                                                <p className='text-xs ml-auto mr-3 p-2 font-xs text-slate-400 rounded-full h-6 w-6 flex items-center justify-center'>
                                                    {moment(latestConversation?.lastMessage?.createdAt).format("hh:mm")}
                                                </p>
                                            )
                                        }
                                        {
                                            latestConversation?.unseen_message > 0 && (
                                                <p className='text-xs ml-auto mr-3 p-2 bg-teal-400 text-white font-semibold rounded-full h-6 w-6 flex items-center justify-center'>
                                                    {latestConversation?.unseen_message}
                                                </p>
                                            )
                                        }
                                    </div>
                                </NavLink>
                            )
                        })
                    }
                </div>
            </div>



            {/* Editing the user Details */}
            {
                profileEdit && (
                    <ProfileEdit onClose={() => setProfileEdit(false)} user={user} />
                )
            }


            {/* search model.. */}
            {
                searchUsers && (
                    <SearchUsers onClose={() => setSearchUsers(false)} />
                )
            }

        </div>
    )
}

export default SideBar