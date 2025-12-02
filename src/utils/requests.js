import { createSlice } from "@reduxjs/toolkit";


const requests = createSlice({
    name: "request",
    initialState: null,
    reducers: {
        addRequests: (state, action)=> action.payload,
        removeRequest: (state, action)=>{
            const newArray = state.filter((r)=> r._id !== action.payload);
            return newArray
        }
    }
});

export const {addRequests , removeRequest} = requests.actions;
export default requests.reducer