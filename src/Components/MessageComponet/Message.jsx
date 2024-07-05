import React, { useEffect, useState, useRef } from 'react'

import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import moment from 'moment'

import { HiDotsVertical } from 'react-icons/hi';
import { FaAngleLeft, FaImage, FaVideo } from 'react-icons/fa6';
import { IoAttach } from "react-icons/io5";
import { IoClose } from 'react-icons/io5';
import { IoMdSend } from 'react-icons/io';

import uploadFiles from '../../Common/UploadFile/UploadProfile';
import UserProfile from "../../Components/UserProfile/UserProfile"
import Loader from '../Loader/Loader';
import chatBackground from '../../assets/Images/wallpaper.jpeg'
import chat_bg from '../../assets/Images/background2.jpg'




// Normailaization fo the data...
const defaultDataStructure = {
    _id: "",
    name: "",
    email: "",
    profile_img: "",
    online: false
}


// Normalization of the message
const defaultMessageStructure = {
    text: "",
    imageURL: "",
    videoURL: ""
}




const Message = () => {

    // retriving the userIf from the {useParams}
    const params = useParams()
    console.log(params.userId);

    // getting the user details for the real-time data change
    const user = useSelector(state => state?.user)

    // reference hook for targeting the particular element
    const currentMessage = useRef();


    // hooks
    // for setting up the data of the user..
    const [userData, setUserData] = useState(defaultDataStructure)

    // LOG-IN user sending message to the other USER
    const [message, setMessage] = useState(defaultMessageStructure)
    const [allMessages, setAllMessages] = useState([]);

    // attactment-data
    const [attachment, setAttachment] = useState(false);

    // state to handle the loading animantion
    const [loading, setLoading] = useState(false);

    // retriving the socket connections.. from the redux
    const socketConnection = useSelector(state => state?.user?.socketConnection);
    console.log(socketConnection)


    // SOCKET CONNECTION WAY TO RETRIVE REAL TIME DATA
    useEffect(() => {
        try {
            if (socketConnection) {
                socketConnection.emit("message-page", params.userId);


                // seen-unseen message changes....
                socketConnection.emit("seen-unseen", params.userId)


                // reciving the response from the server about the [USRE-details]
                socketConnection.on("message-user", (data) => {
                    console.log(data);

                    // setting up the user-click-data
                    setUserData(data);
                })

                socketConnection.on('message', (data) => {
                    console.log("messages", data);

                    // setting all the messages...
                    setAllMessages(data);
                })
            }
        } catch (error) {
            console.log(error);
        }
    }, [user, socketConnection, params?.userId])


    // CHAT DISPALYING IN REAL-TIME
    useEffect(() => {
        if (currentMessage.current) {
            currentMessage.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
        }
    }, [allMessages])



    // function to handle the attachment
    const handleAttachment = (e) => {

        setAttachment(currentVal => !currentVal)
    }


    // function to handle the image-upload
    const handleUploadImage = async (e) => {
        const file = e.target.files[0];

        setLoading(true)

        const uploadPhoto = await uploadFiles(file)
        console.log(uploadPhoto);

        setLoading(false)
        setAttachment(false)

        // updating the URL to the MESSGAE{CHAT}...
        setMessage((currentVal) => {
            return ({
                ...currentVal,
                imageURL: uploadPhoto?.url
            })
        })
    }


    // function to handle the image-upload remove
    const handleClearUploadImage = async (e) => {
        // updating the URL to the MESSGAE{CHAT}...
        setMessage((currentVal) => {
            return ({
                ...currentVal,
                imageURL: ""
            })
        })
    }


    // function to handle the video-upload
    const handleUploadVideo = async (e) => {
        const file = e.target.files[0];

        setLoading(true);

        const uploadPhoto = await uploadFiles(file)
        console.log(uploadPhoto);

        setLoading(false)
        setAttachment(false)

        // updating the URL to the MESSGAE{CHAT}...
        setMessage((currentVal) => {
            return ({
                ...currentVal,
                videoURL: uploadPhoto?.url
            })
        })
    }


    // function to handle the clear-upload-video
    const handleClearUploadVideo = (e) => {
        // updating the URL to the MESSGAE{CHAT}...
        setMessage((currentVal) => {
            return ({
                ...currentVal,
                videoURL: ""
            })
        })
    }


    // function to handle the message-text
    const handleMessageText = (e) => {
        const { name, value } = e.target;

        setMessage((currentVal) => {
            return ({
                ...currentVal,
                text: value
            })
        })
    }



    // function to hadnle the send message button
    const handleSendMessage = (e) => {
        e.preventDefault();

        try {
            // sending message to the server-side
            if (message.text || message.imageURL || message.videoURL) {
                if (socketConnection) {
                    socketConnection.emit('new-message', {
                        sender: user?._id,
                        receiver: params.userId,
                        text: message.text,
                        imageURL: message.imageURL,
                        videoURL: message.videoURL,
                        msgByUserId: user?._id
                    })

                    // setting the message field as default
                    setMessage(defaultMessageStructure)
                }
            }
        } catch (error) {
            console.log(error);
        }
    }



    return (
        <div style={{ backgroundImage: `url(${chat_bg})` }} className='bg-no-repeat bg-cover'>

            {/* Header section... */}
            <header className='sticky top-0 h-16 bg-white flex justify-between items-center'>

                <div className='flex items-center gap-5'>
                    <Link to={'/'} className='ml-2 lg:hidden'>
                        <FaAngleLeft size={20} />
                    </Link>

                    <div className='lg:ml-5'>
                        <UserProfile
                            width={60}
                            height={60}
                            profile_img={userData?.profile_img}
                            name={userData?.name}
                            userId={userData?._id}
                        />
                    </div>

                    <div>
                        <h3 className='captialize font-semibold text-lg my-0 text-ellipsis line-clamp-1'>
                            {userData?.name}
                        </h3>
                        <p className="-my-2 text-sm">
                            {
                                userData?.online ? (
                                    <span className='text-green-500'>
                                        online
                                    </span>
                                ) : (
                                    <span className="text-slate-500">
                                        offline
                                    </span>
                                )
                            }
                        </p>
                    </div>

                </div>


                <div>
                    <button className='cursor-pointer mr-4 hover:text-gray-600'>
                        <HiDotsVertical />
                    </button>
                </div>
            </header>



            {/* Message/Char section */}
            <section className='relative h-[calc(100vh-128px)] scrollbar overflow-x-hidden overflow-y-scroll bg-slate-200 bg-opacity-60'>

                {/* showing all the CHATS/Messgaes */}
                <div className='flex flex-col gap-1' ref={currentMessage}>
                    {
                        allMessages.map((msg, index) => {
                            return (
                                <div
                                    className={`m-2 mt-1 p-1 py-1 rounded w-fit max-w-[280px] md:max-w-sm lg:max-w-md ${user?._id === msg.msgByUserId ? "ml-auto bg-teal-50" : "bg-white"}`}
                                    key={index}
                                    id={index}
                                >
                                    {/* showing the image and video */}
                                    <div className='w-full'>
                                        {/* image */}
                                        {
                                            msg?.imageURL && (
                                                <img
                                                    src={msg?.imageURL}
                                                    className='w-full h-full object-scale-down'
                                                />
                                            )
                                        }

                                        {/* video */}
                                        {
                                            msg?.videoURL && (
                                                <video
                                                    src={msg?.videoURL}
                                                    controls
                                                    className='w-full h-full object-scale-down'
                                                />
                                            )
                                        }
                                    </div>

                                    {/* showing the text message */}
                                    <p className="px-2">
                                        {msg.text}
                                    </p>
                                    <p className='text-xs ml-auto w-fit text-slate-400'>
                                        {moment(msg.createdAt).format('hh:mm')}
                                    </p>
                                </div>
                            )
                        })
                    }
                </div>


                {/* upload image display */}
                {
                    message?.imageURL && (
                        <div className="w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center overflow-hidden">
                            <div
                                className='w-fit p-2 absolute top-0 right-0 hover:text-gray-700 cursor-pointer'
                                onClick={handleClearUploadImage}
                            >
                                <IoClose size={30} />
                            </div>

                            <div className="bg-white p-3">
                                <img
                                    src={message?.imageURL}
                                    className='aspect-square m-2 w-full h-full max-w-sm object-scale-down'
                                    alt='uploadImage'
                                />
                            </div>
                        </div>
                    )
                }

                {/* upload video display */}
                {
                    message?.videoURL && (
                        <div className="w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center overflow-hidden">
                            <div
                                className='w-fit p-2 absolute top-0 right-0 hover:text-gray-700 cursor-pointer'
                                onClick={handleClearUploadVideo}
                            >
                                <IoClose size={30} />
                            </div>

                            <div className="bg-white p-3">
                                <video
                                    src={message?.videoURL}
                                    className='aspect-video m-4 w-full h-full max-w-sm object-scale-down'
                                    alt='uploadVideo'
                                    controls
                                    muted
                                    autoPlay
                                />
                            </div>
                        </div>
                    )
                }

                {/* loading animation */}
                {
                    loading && (
                        <div className='w-full h-full sticky bottom-0 flex justify-center items-center'>
                            <Loader />
                        </div>
                    )
                }
            </section>



            {/* sending massages.. */}
            <section className='h-16 bg-white flex items-center px-4 pl-2 pb-2'>
                <div className='relative'>

                    <button
                        onClick={handleAttachment}
                        className='flex justify-center items-center rounded-full w-10 h-10 hover:bg-slate-200'
                    >
                        <IoAttach size={20} />
                    </button>


                    {/* onCLick what to display */}
                    {/* DISPLAY:- IMAGE and VIDEO */}
                    {
                        attachment && (
                            <div className='bg-white shadow rounded absolute bottom-14 p-1 w-36'>
                                <form>
                                    <label
                                        htmlFor='uploadImage'
                                        className='flex items-center p-2 gap-3 px-3 cursor-pointer hover:bg-slate-100 rounded'
                                    >
                                        <div className='text-primary'>
                                            <FaImage />
                                        </div>
                                        <p>
                                            Image
                                        </p>
                                    </label>
                                    <input
                                        type="file"
                                        id='uploadImage'
                                        onChange={handleUploadImage}
                                        className='hidden'
                                    />


                                    <label
                                        htmlFor='uploadVideo'
                                        className='flex items-center p-2 gap-3 px-3 cursor-pointer hover:bg-slate-100 rounded'
                                    >
                                        <div className='text-purple-500'>
                                            <FaVideo />
                                        </div>
                                        <p>
                                            Video
                                        </p>
                                    </label>
                                    <input
                                        type="file"
                                        id='uploadVideo'
                                        onChange={handleUploadVideo}
                                        className='hidden'
                                    />
                                </form>
                            </div>
                        )
                    }

                </div>


                <form className='w-full h-full p-3 flex gap-2' onSubmit={handleSendMessage}>
                    <input
                        type="text"
                        placeholder="Type Your message...."
                        className='outline-none w-full h-full py-1 px-4 pl-4 bg-slate-100 rounded-full'
                        value={message.text}
                        onChange={handleMessageText}
                    />

                    <button>
                        <IoMdSend size={28} />
                    </button>

                </form>

            </section>
        </div>
    )
}

export default Message
