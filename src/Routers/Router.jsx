import { createBrowserRouter } from 'react-router-dom'


import App from '../App'
import CheckEmail from '../Pages/FullLoginPage/CheckEmail/CheckEmail'
import CheckPassword from '../Pages/FullLoginPage/CheckPassword/CheckPassword'
import Home from '../Pages/Home/Home'
import Message from '../Components/MessageComponet/Message'
import LayOut from '../Components/LayOut/LayOut'
import SignUp from '../Pages/SignUpPage/SignUp'
import ChangePassword from '../Pages/ChangePassword/ChangePassword'



const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: "signup",
                element: (
                    <LayOut>
                        <SignUp />
                    </LayOut>
                )
            },
            {
                path: "email",
                element: (
                    <LayOut>
                        <CheckEmail />
                    </LayOut>
                )
            },
            {
                path: "password",
                element: (
                    <LayOut>
                        <CheckPassword />
                    </LayOut>
                )
            },
            {
                path: "change-password",
                element: (
                    <LayOut>
                        <ChangePassword />
                    </LayOut>
                )
            },
            {
                path: "",
                element: <Home />,
                children: [
                    {
                        path: ':userId',
                        element: <Message />
                    }
                ]
            }
        ]
    }
])


export default router