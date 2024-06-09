import mongoose from 'mongoose';

const UserSchema = mongoose.Schema(
    {
        name: String,
        email: String,
        tokens: [String],
    },
    { collection: 'users', timestamps: true }
);

let User;

try {
    User = mongoose.model('users');
} catch (err) {
    User = mongoose.model('users', UserSchema);
}

export default User;
