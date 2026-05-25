import React from 'react'
import  { useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import './page.css'

const Page3 = () => {
    const[email,setemail]=useState("")
    const[password,setpassword]=useState("")
     const navigate = useNavigate()
    const signed=async function(e){
          e.preventDefault()
        await axios.post('https://table-tennis-tournament-teal.vercel.app/router/signup',{
            email,
            password
        })
        navigate('/home')
    }
  return (
      <div className='container w-50 mt-5'>

      <h1 className='text-center text-light mt-3 mb-4'>
        Signup
      </h1>
      <form action="">
        <div className="mb-3">
            <label htmlFor="">
                Enter Email
            </label>
            <input type="text" placeholder="Enter.." className='form-control' onChange={(e)=>setemail(e.target.value)}/>
        </div>
        <div className="mb-3">
            <label htmlFor="">Enter Password</label>
            <input type="text"placeholder="Enter.." className='form-control' onChange={(e)=>setpassword(e.target.value)}/>
             
        </div>
      </form>
      <button className='btn btn-info mb-3'  type="button" onClick={signed}>Register</button>
      
      <p className='text-center text-light mt-3'>
         Already Have Account?<Link to="/">
   Login
</Link>

</p>
      </div>
  )
}

export default Page3