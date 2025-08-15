"use client"

import React, { useEffect, useState } from "react"
import { SignInSchema, SignInInput } from '@my-monorepo/common';
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent,  CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "@/features/auth/authSlice";
import { RootState } from "@/store/store";
import { Loader } from 'lucide-react';

export const LoginComponent = () => {
    const [formData, setFormData] = useState<SignInInput>({
        email: "",
        password: ""
    })
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter()

    const dispatch = useDispatch()


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev, [e.target.name]: e.target.value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            SignInSchema.parse(formData);
        } catch (err: any) {
            setError(err.errors?.[0]?.message || "Invalid Input");
            return
        }
        const result = await signIn('credentials', {
            redirect: false,
            email: formData.email,
            password: formData.password
        });

        if (result?.error) {
            setError(result.error);
        } else if (result?.ok) {
            const session = await fetch('/api/auth/session').then(res => res.json());
            dispatch(setCredentials({
                id: session.user.id,
                email: session.user.email,
                name: session.user.name,
                username: session.user.username
            }))
            router.push('/')
        }
    }


    // return (
    //     <div className="flex flex-col justify-center h-screen items-center bg-black">
    //         <div className="border rounded-4xl px-8 py-10 bg-white">
    //             <h1 className="text-xl font-semibold text-center">Login</h1>
    //             <form onSubmit={handleSubmit}>
    //                 <input 
    //                     type="email" 
    //                     placeholder="Email"
    //                     name="email"
    //                     value={formData.email}
    //                     onChange={handleChange}
    //                     required
    //                     className="p-2 my-2 border border-gray-400 rounded-md text-gray-800 text-lg"
    //                 />
    //                 <br />
    //                 <input 
                        // type="password" 
                        // placeholder="Password"
                        // name="password"
                        // value={formData.password}
                        // onChange={handleChange}
                        // required
    //                     className="p-2 my-2 border border-gray-400 rounded-md text-gray-800 text-lg"
    //                 />
    //                 <br />
    //                 <button type="submit"
    //                     className="bg-blue-400 text-white py-2 w-full border-0 rounded-lg text-lg mt-2"
    //                 >Login</button>
    //                 {error && <p>{error}</p>}
    //             </form>
    //         </div>
    //     </div>
    // )

    const user = useSelector((state: RootState) => state.auth)

    useEffect(() => {
        if (user.email) {
            router.push('/');
        }
    }, [user.email, router])

    return (
        <div className="flex justify-center items-center pt-50">
            <Card className="w-full max-w-sm shadow-lg pb-20">
                <CardHeader>
                    <CardTitle className="font-semibold text-2xl text-center">Login</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input 
                            type="email" 
                            placeholder="Email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <Input 
                            type="password" 
                            placeholder="Password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <Button 
                            type="submit"
                            variant="default" 
                            className="w-full p-2 bg-blue-500 hover:bg-blue-600"
                            >{loading ? <Loader /> : 'Login'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}