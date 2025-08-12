import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface UserState {
    id: string | null
    email: string | null
    name: string | null
    username: string | null
}

const initialState: UserState = {
    id: null,
    email: null,
    name: null,
    username: null
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<UserState>) => {
            state.id = action.payload.id
            state.email = action.payload.email
            state.name = action.payload.name
            state.username = action.payload.username
        },
        logout: (state) => {
            state.id = null
            state.email = null
            state.name = null
            state.username = null
        }
    }
})

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;