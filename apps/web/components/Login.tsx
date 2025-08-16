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
                            className="w-full p-2"
                            >{loading ? <Loader /> : 'Login'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}