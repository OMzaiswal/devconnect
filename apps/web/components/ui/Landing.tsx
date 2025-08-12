"use client"
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";


export const Landing = () => {
    const user = useSelector((state: RootState) => state.auth);
    return <div>
        {user.username && <p>Welcome back , {user.username}</p>}
    </div>
}