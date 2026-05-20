const express=require('express')
const app=express()
const port=3000
const route=require('./route/route')
const connectdb=require('./config/config')
const cors=require('cors')
app.use(express.json())
app.use(cors())
connectdb()
app.use('/router',route)
app.listen(port,()=>{
    console.log(`port is listen on ${port}`)
})
