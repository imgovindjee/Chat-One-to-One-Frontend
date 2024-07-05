const URL = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/auto/upload`


const uploadFiles = async (file) => {

    const formData = new FormData()
    formData.append('file', file)
    formData.append("upload_preset", "chat-application");

    const response = await fetch(URL, {
        method: 'post',
        body: formData
    })
    const responseData = await response.json()
    return responseData
}

export default uploadFiles