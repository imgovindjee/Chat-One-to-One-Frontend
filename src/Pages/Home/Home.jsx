import React, { useEffect } from 'react'

import axios from 'axios'

import { Outlet, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import toast, { Toaster } from 'react-hot-toast'
import { useLocation } from 'react-router-dom'

import { logout, setOnlineUser, setSocketConnection, setUser } from '../../Redux/userSlice'

import SideBar from '../../Components/SideBar/SideBar'
import logo from '../../assets/Images/logo.png'
import io from 'socket.io-client'
import logo1 from '../../assets/Images/logo1.png'





const Home = () => {

    // getting the use for the setting of thr redux-store data
    const dispatch = useDispatch()

    // router changing access control..
    const navigate = useNavigate()

    // geteting the URL pathlocation
    const location = useLocation();
    console.log(location)
    const _pathname = location.pathname === '/';

    // checking the default data for the redux-store..
    const user = useSelector(state => state.user)
    console.log(user);


    // fetching the user details fonr the cookie...
    const fetchuserDetails = async () => {
        try {
            // making the data request
            const res = await axios({
                url: import.meta.env.VITE_SERVER_DOMAIN + "/api/user-details",
                withCredentials: true
            })
            console.log(res)
            // setting up the user_info to the redux-store
            dispatch(setUser(res.data.user_info))

            // if token is not available then...
            if (res.data.logout) {
                dispatch(logout())

                toast.error("Session Expires, Please Login again")
                // navigating the user to the login page
                // for login again
                navigate('/email');
            }
        } catch (error) {
            console.log(error)
        }
    }

    // Real time fetching the data... 
    useEffect(() => {
        fetchuserDetails();
    })



    // SOCKET CONNECTIONS...
    useEffect(() => {
        let socketConnection;

        try {
            socketConnection = io('http://localhost:3500',
                // { transports: ['websocket'] },
                {
                    auth: {
                        token: localStorage.getItem('token')
                    },
                }
            )

            // receving the data send from th backend
            // online-users details...
            socketConnection.on("onlineUser", (data) => {
                console.log(data);
                dispatch(setOnlineUser(data));
            })

            // setting-up the socket-connection for the whole system 
            // using redux-store
            dispatch(setSocketConnection(socketConnection))
        } catch (error) {
            console.log(error)
        }
        return () => {
            if (socketConnection) {
                socketConnection.disconnect();
            }
        }
    }, [])



    return (
        <div className='grid lg:grid-cols-[300px,1fr] h-screen max-h-screen'>

            {/* sidebar section */}
            <section className={`bg-white ${!_pathname ? "hidden" : ""} lg:block`}>
                <SideBar />
            </section>


            {/* Message section */}
            <section className={`${_pathname ? "hidden" : ""}`}>
                <Outlet />
            </section>

            <div className={`justify-center items-center flex-col gap-2 hidden ${!_pathname ? "hidden" : "flex"}`}>
                <div>
                    <img
                        src={logo1}
                        alt="LOGO"
                        width={250}
                    />
                </div>
                <p className='text-lg mt-2 text-slate-600'>
                    Select a user and start a Converasation
                </p>
            </div>

        </div>
    )
}

export default Home
