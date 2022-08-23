const express=require('express');
const app=express();

app.use(express.json());
app.use(express.urlencoded({
    extended: false
}))


const user_router = require("./routers/user.router");
const auth_router=require("./routers/auth.user")
const sku_router=require("./routers/sku.router")


app.use('/users',user_router);
app.use('/user',auth_router)
app.use('/sku',sku_router)

app.get("/", (req, res) => {
    res.json('Hello')
})

module.exports=app