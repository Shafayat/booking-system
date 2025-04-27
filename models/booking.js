import {DataTypes} from "sequelize";
import sequelize from "../db/index.js";
import User from "./user.js";
import Service from "./service.js";

const Booking = sequelize.define('Booking', {
    status: {
        type: DataTypes.ENUM('booked', 'cancelled'),
        defaultValue: 'booked',
    },
    bookingDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    }
});

// Associations
Booking.belongsTo(User);
User.hasMany(Booking);

Booking.belongsTo(Service);
Service.hasMany(Booking);

export default Booking;