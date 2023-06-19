import {create} from "zustand";

export const useAuthStore = create((set) => ({
    auth:{
        username:"",
    },
    setUsername:(name) => set((state) => ({auth:{...state.auth,username:name}})),
    setAuth:(data) => set((state) => {
        return ({...state,auth:data})
    })
}))


export const useLayoutStore = create((set) => ({
    loading:false,
    setLoading:(value) => set((state) => {
        return {...state,loading:value}
    })
}))