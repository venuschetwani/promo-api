const express = require("express");
const User = require("../models/user");
const router = new express.Router();
router.use(express.json());


exports.getUser = (req, res) => {
    User.find({}).then((users) => {
        res.send(users);
    })
}

exports.getUserauth = (req, res) => {
    res.send(req.user)
}

exports.userById = (req, res) => {
    const _id = req.params.id;
    User.find({ _id })
        .then((user) => {
            if (!user) {
                return res.status(404).send();
            }

            res.send(user);
        })
        .catch((e) => {
            res.status(500).send(e);
        });
}

exports.patchAll = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowupdates = ["FirstName", "LastName", "Role", "Email", "Password"];
    const valid = updates.every((update) => allowupdates.includes(update));
    if (!valid) {
        return res.status(404).send({ error: "invalid" });
    }

    try {
        updates.forEach((update) => (req.user[update] = req.body[update]));
        await req.user.save()
        res.send(req.user)
    }
    catch (e) {
        res.status(400).send(e);
    }
}

exports.patchById = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowupdates = ["FirstName", "LastName", "Role", "Email", "Password"];
    const valid = updates.every((update) => allowupdates.includes(update));
    if (!valid) {
        return res.status(404).send({ error: "invalid" });
    }
    try {

        const user = await User.findById(req.params.id);
        updates.forEach((update) => (user[update] = req.body[update]));
        await user.save();
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    }
    catch (e) {
        res.status(400).send(e);
    }
}

exports.deleteById = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).send("no such user found");
        }
        res.send(user);

    }
    catch (e) {
        res.status(400).send(e);
    }
}

exports.deleteByAuth = async (req, res) => {
    try {
        await req.user.remove();
        res.send(req.user);
    }
    catch (e) {
        res.status(400).send(e);
    }
}





