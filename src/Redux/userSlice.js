import { createSlice } from "@reduxjs/toolkit"


const initialState = {
    name: "",
    email: "",
    profile_img: "",
    token: "",
    _id: "",
    onlineUser: [],
    socketConnection: null
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state._id = action.payload._id
            state.name = action.payload.name
            state.email = action.payload.email
            state.profile_img = action.payload.profile_img
        },
        setToken: (state, action) => {
            state.token = action.payload
        },
        logout: (state, action) => {
            state._id = ""
            state.name = ""
            state.email = ""
            state.profile_img = ""
            state.token = ""
            state.socketConnection = null
        },
        setOnlineUser: (state, action) => {
            state.onlineUser = action.payload
        },
        setSocketConnection: (state, action) => {
            state.socketConnection = action.payload
        }
    },
})


export const { setUser, logout, setToken, setOnlineUser, setSocketConnection } = userSlice.actions


export default userSlice.reducer