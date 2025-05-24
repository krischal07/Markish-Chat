import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

export const useChatStore = create((set,get)=>({
    messages:[],
    users:[],
    selectedUser: null,
    isUsersLoading:false,
    isMessageLoading:false,

    getUsers: async()=>{
        set({isUsersLoading:true});
        try {
            const res = await axiosInstance.get("/message/users")
            set({users:res.data})
            // toast.success("Users Loaded...")
        } catch (error) {
            toast.error(error.response.data.message)
            
        }finally{
        set({isUsersLoading:false});

        }
    },


    getMessages: async(userId) =>{
        set({isMessageLoading: true})
        try {
            const res = await axiosInstance.get(`/message/${userId}`)
            set({messages: res.data})
        } catch (error) {
            toast.error(error.response.data.message)
            
        }finally{
        set({isMessageLoading: false})

        }
    },

    setSelectedUser: (selectedUser) =>set({selectedUser}),
    
    sendMessage: async(messageData)=>{
        const{selectedUser, messages} = get()
        try {
           const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, messageData)
           set({message:[...messages, res.data]})
        } catch (error) {
            toast.error(error.response.data.message)
        }

    }

}))
