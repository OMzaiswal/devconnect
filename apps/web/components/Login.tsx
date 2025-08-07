"use client"

import React, { useState } from "react"
import { SignInSchema, SignInInput } from '@my-monorepo/common';
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export const LoginComponent = () => {
    const [formData, setFormData] = useState<SignInInput>({
        email: "",
        password: ""
    })
    const [error, setError] = useState("");
    const router = useRouter()


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev, [e.target.name]: e.target.value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
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
            router.push('/')
        }
    }


    return (
        <div className="flex flex-col justify-center h-screen items-center bg-black">
            <div className="border rounded-4xl px-8 py-10 bg-white">
                <h1 className="text-xl font-semibold text-center">Login</h1>
                <form onSubmit={handleSubmit}>
                    <input 
                        type="email" 
                        placeholder="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="p-2 my-2 border border-gray-400 rounded-md text-gray-800 text-lg"
                    />
                    <br />
                    <input 
                        type="password" 
                        placeholder="Password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="p-2 my-2 border border-gray-400 rounded-md text-gray-800 text-lg"
                    />
                    <br />
                    <button type="submit"
                        className="bg-blue-400 text-white py-2 w-full border-0 rounded-lg text-lg mt-2"
                    >Login</button>
                    {error && <p>{error}</p>}
                </form>
            </div>
        </div>
    )

}