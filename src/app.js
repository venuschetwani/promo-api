const express=require('express');
const user_router = require("./routers/user.router");
const auth_router=require("./routers/auth.user")
const sku_router=require("./routers/sku.router")
const shelf_router=require("./routers/shelf.router")
const app=express();
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}))

app.use('/users',user_router);
app.use('/user',auth_router)
app.use('/sku',sku_router)
app.use('/shelf',shelf_router)



app.get("/", (req, res) => {
    res.json('Hello')
})

module.exports=app