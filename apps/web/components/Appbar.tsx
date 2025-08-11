

export const Appbar = () => {

    return <div className="flex justify-between py-5 text-2xl bg-blue-500 text-white">
        <h1 className="pl-4 font-bold  text-4xl">devConnect</h1>
        <div className="flex justify-between space-x-4">
            <p>Home</p>
            <p>Invitations</p>
            <p>Messages</p>
            <p>Notifications</p>
        </div>
        <div className="flex pr-4 justify-between space-x-4">
            <p>Join Now</p>
            <p>Signin</p>
        </div>

    </div>
}