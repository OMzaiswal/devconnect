'use client';

import { useState } from "react";
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"


export const AddPost = () => {
    const [text, setText] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [loader, setLoader] = useState(false);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = () => {}

    return <div className="">
        <div className="border border-md rounded-md w-full max-w-lg p-4 flex flex-col gap-4">
            <Textarea 
                placeholder="What's on your mind?"
                value={text}
                onChange={e => setText(e.target.value)}
            />
            <Input 
                type="file"
                accept="image/*"
                onChange={handleImageChange}
            />
            <Button onClick={handleSubmit} disabled={loader}>
                {loader ? 'Posting...' : 'Post'}
            </Button>
        </div>
    </div>
}