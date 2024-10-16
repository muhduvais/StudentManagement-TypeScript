import mongoose, { Document, Schema } from 'mongoose';

interface IUser extends Document {
    name: string;
    age: number;
    place: string;
    phone: number;
    email: string;
    password: string;
    cPassword: string;
    isAdmin: number;
}

const userSchema: Schema<IUser> = new Schema({
    name: {
        type: String,
    },
    age: {
        type: Number,
    },
    place: {
        type: String,
    },
    phone: {
        type: Number,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    cPassword: {
        type: String,
    },
    isAdmin: {
        type: Number
    }
});

const User = mongoose.model<IUser>('users', userSchema);
export default User;