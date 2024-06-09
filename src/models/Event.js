import mongoose from 'mongoose';

const EventSchema = mongoose.Schema(
    {
        title: String,
        location: String,
        scheduled_start_time: String,
        scheduled_end_time: String,
        description: String,
        postdiscord: Boolean,
        postintra: Boolean,
        intraeventid: String,
        discordeventid: String,
        expiredAt: { type: Date, expires: 60 },
    },
    { collection: 'evententries', timestamps: true }
);

let Event;

try {
    Event = mongoose.model('evententries');
} catch (err) {
    Event = mongoose.model('evententries', EventSchema);
}

export default Event;
