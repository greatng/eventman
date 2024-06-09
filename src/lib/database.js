import mongoose from 'mongoose';

// connect to DB if readState != 0
const connect = async () => {
    if (!dbState) {
        mongoose.connect(
            process.env.MONGODB_URI,
            { useNewUrlParser: true, useUnifiedTopology: true },
            (err) => {
                if (err) console.log('Error connecting to MongoDB');
                else console.log('Connected to MongoDB');
            }
        );
    } else console.log(`dbState = ${dbState}`);
};

export const dbState = mongoose.connection.readyState;
export default connect;
