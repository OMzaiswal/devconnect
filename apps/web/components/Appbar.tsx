'use client'

import { persistor, RootState } from '@/store/store';
import { House } from 'lucide-react';
import { Handshake } from 'lucide-react';
import { MessageSquareMore } from 'lucide-react';
import { BellRing } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { User } from 'lucide-react';
import { Button } from './ui/button';
import { logout } from '@/features/auth/authSlice';
import { signOut } from 'next-auth/react';
import { useState } from 'react';
import { Loader } from 'lucide-react';


export const Appbar = () => {

    const user = useSelector((state: RootState) => state.auth);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const handleLogout = async () => {
        dispatch(logout());
        await persistor.purge();
        signOut({ callbackUrl: '/login' });

    }

    return <div className="flex justify-around py-5 text-gray-600">
        <h1 className="pl-4 font-bold  text-2xl">devConnect</h1>
        {user.email && <div className="flex justify-between space-x-6 text-sm">
            <div className='flex flex-col justify-center items-center'>
                <House />
                <p>Home</p>
            </div>
            <div className='flex flex-col justify-center items-center'>
                <Handshake/>
                <p>Invitations</p>
            </div>
            <div className='flex flex-col justify-center items-center'>
                <MessageSquareMore />
                <p>Messages</p>
            </div>
            <div className='flex flex-col justify-center items-center'>
                <BellRing />
                <p>Notifications</p>
            </div>   
        </div>}
        <div>
            { user.email ? (
                <div className='flex space-x-8'>
                    <div className='flex flex-col justify-center items-center'>
                        <User />
                        <p>{user.name}</p>
                    </div>
                    <Button
                        className='bg-red-100 text-red-600 hover:bg-red-400 hover:text-white'
                        onClick={handleLogout}
                        >{loading ? <Loader /> : 'Logout'}
                    </Button>
                </div>
            ) : (
                <div className="flex pr-4 justify-between space-x-4 text-2xl">
                    <p>Join Now</p>
                    <p>Signin</p>
                </div>
            ) }
        </div>
        

    </div>
}