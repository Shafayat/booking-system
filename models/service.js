import {DataTypes} from "sequelize";
import sequelize from "../db/index.js";
import Hospital from './hospital.js';

const Service = sequelize.define('Service', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: DataTypes.STRING,
    price: DataTypes.FLOAT,
});

// Each service belongs to a hospital
Service.belongsTo(Hospital);
Hospital.hasMany(Service);

export default Service;