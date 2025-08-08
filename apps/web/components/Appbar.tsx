

export const Appbar = () => {

    return <div className="flex justify-between">
        <h1 className="pl-4 font-bold text-red-500">devConnect</h1>
        <div className="flex justify-between space-x-4">
            <p>Home</p>
            <p>Invitations</p>
        </div>
        <div className="flex pr-4 justify-between space-x-4">
            <p>Join Now</p>
            <p>Signin</p>
        </div>

    </div>
}