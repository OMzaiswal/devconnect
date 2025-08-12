'use client'

import { RootState } from '@/store/store';
import { House } from 'lucide-react';
import { Handshake } from 'lucide-react';
import { MessageSquareMore } from 'lucide-react';
import { BellRing } from 'lucide-react';
import { useState } from 'react';
import { useSelector } from 'react-redux';

export const Appbar = () => {

    const user = useSelector((state: RootState) => state.auth)

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
                <p className='font-semibold text-2xl'>{user.name}</p>
            ) : (
                <div className="flex pr-4 justify-between space-x-4 text-2xl">
                    <p>Join Now</p>
                    <p>Signin</p>
                </div>
            ) }
        </div>
        

    </div>
}