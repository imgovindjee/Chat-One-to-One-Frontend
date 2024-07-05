import React from 'react'

import logo from '../../assets/Images/logo.png'
import logo1 from '../../assets/Images/logo1.png'

const LayOut = ({ children }) => {
    return (
        <>
            <header className='flex justify-center items-center py-4 h-20 shadow-md bg-white'>
                <img
                    src={logo1}
                    alt="LOGO"
                    width={100}
                    height={80}
                />
            </header>

            {children}
        </>
    )
}


export default LayOut