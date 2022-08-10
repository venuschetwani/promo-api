const express=require('express');
const app=express();

app.use(express.json());
app.use(express.urlencoded({
    extended: false
}))


const user_router = require("./routers/user.router");
const auth_router=require("./routers/auth.user")


app.use('/users',user_router);
app.use('/users',auth_router)


app.get("/", (req, res) => {
    res.json('Hello')
})

module.exports=app