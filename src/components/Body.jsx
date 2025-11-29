import React, { useEffect } from 'react'
import Navbar from './Navbar'
import { Outlet, useNavigate } from 'react-router-dom'
import Footer from './Footer'
import { BASE_URL } from '../utils/constants'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { addUser } from '../utils/userSlice'

const Body = () => {
  const dispatch = useDispatch();
  const userData = useSelector((store)=> store.user);
  const navigate = useNavigate();

  const fetchData = async ()=>{
     if (userData) return;
    try {
     
      const res = await axios.get(BASE_URL +"/profile/view",{withCredentials: true});
      dispatch(addUser(res.data));
     
    } catch (err) {
      if(err.status === 400){
        navigate("/login");
      }
      console.error(err);
    } 
  }
  useEffect(()=>{
    fetchData();
    },[]);
  return (
    <div>
      <Navbar/>
      <Outlet/>
      <Footer/>
    </div>
  )
}

export default Body
