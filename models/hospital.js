import {DataTypes} from "sequelize";
import sequelize from "../db/index.js";

const Hospital = sequelize.define('Hospital', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address: DataTypes.STRING,
});

export default Hospital;