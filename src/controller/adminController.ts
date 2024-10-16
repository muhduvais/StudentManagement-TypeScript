
import express, { Request, Response, NextFunction } from 'express';
import User from '../models/config';

const toAdminLogin = (req: Request, res: Response): void => {
    try {
        if(req.session.admin) {
            res.redirect("/adminHome");
        }
        else {
            let logoutMsg = req.query.logoutMsg;
            res.render("login", { logoutMsg });
        }
    } catch(err) {
        console.error("Internal server error", err);
        res.status(500).send("Internal server error");
    }
}

const checkLogin = async (req: Request, res: Response): Promise<void> => {
    const {email, password} = req.body;
    try {
        const user = await User.findOne({email});

        //Email validation
        const isValidEmail = (email: string): boolean => {
            const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        }

        if(!email || !password) {
            res.render("login", {errMessage: "Please fill the fields"});
        }

        else if(!isValidEmail(email)) {
            res.render("login", {errMessage: "Invalid email!"})
        }
        else if(!user || (user.email !== email) || (user.password !== password)) {
            res.render("login", {errMessage: "Invalid username or password!"});
        }
        else if(user.isAdmin === 1) {
            req.session.admin = user;
            res.redirect("/adminHome");
        } else {
            res.render("login", {errMessage: "Invalid username or password!"});
        }
    }
    catch(err) {
        console.error("Error logging in", err);
        res.status(500).send("Internal server error");
    }
}

const fromAdminHome = async (req: Request, res: Response): Promise<void> => {
    try {
        if(req.session.admin && req.session.admin.isAdmin === 1) {
            const usersList = await User.find({isAdmin: {$ne: 1}});
            res.render("adminHome", {usersList});
        }
        else {
            res.redirect("/adminLogin");
        }
    } catch(err) {
        console.error("Internal server error", err);
        res.status(500).send("Internal server error");
    }
}

const addUser = async (req: Request, res: Response): Promise<void> => {

    try {
        const {name, age, place, phone, email, password, cPassword, isAdmin} = req.body;

        const existingUser = await User.findOne({email});

        if(existingUser) {
            res.json({ message: "User exists!"});
        }

        else {
            const newUser = new User({name, age, place, phone, email, password, cPassword, isAdmin});
            await newUser.save();
            res.status(200).json({ success: true, message: "Created user successfully!" });
        }
        
    }
    catch(err) {
        console.error("Error registering user", err);
        res.status(500).send("Error registering user");
    }
}

const editUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, age, place, phone, email } = req.body;
        const userId = req.params.id;

        const existingUser = await User.findOne({ email, _id: { $ne: userId } });

        if (existingUser) {
            res.json({ success: false, message: "User with this email already exists!" });
        } else {
            await User.findByIdAndUpdate(userId, { name, age, place, phone, email });
            res.status(200).json({ success: true });
        }
    } catch (err) {
        console.log("Error updating user", err);
        res.status(500).json({ success: false, message: "Error updating user!" });
    }
};

const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try{
        const userId = req.params.id;
        await User.findByIdAndDelete(userId);
        const usersList = await User.find({isAdmin: {$ne: 1}});

        res.render("adminHome", {usersList});
    }
    catch(err) {
        console.log("Error deleting user!", err);
        res.status(500).send("Error deleting user!");
    }
}

const adminLogout = (req: Request, res: Response): void => {
    try {
        if(req.session.admin) {
            delete req.session.admin;
        }
        res.redirect('/adminLogin?logoutMsg=Logout successfully...');
    } catch(err) {
        console.error("Error logging out", err);
        res.status(500).send("Internal server error");
    }
}

export default {
    toAdminLogin,
    checkLogin,
    fromAdminHome,
    addUser,
    editUser,
    deleteUser,
    adminLogout
}