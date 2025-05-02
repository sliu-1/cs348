import mongoose from 'mongoose';

const friendSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    closeness: {
        type: String,
        required: true
    },
    birthday: {
        type: Date,
    },
    place: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Place"
    },
    likes: {
        type: String
    },
    dislikes: {
        type: String
    },
    notes: {
        type: String
    },
    mutuals: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Friend" }]
    }

}, {
    timestamps: true
});

const placeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    city: {
        type: String,
    },
    state: {
        type: String,
    }
}, {
    timestamps: true
});

const Friend = mongoose.model('Friend', friendSchema);  
const Place = mongoose.model('Place', placeSchema);

export {Place};
export {Friend};