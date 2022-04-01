'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Client extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Client.init({
    name:{ 
      type: DataTypes.STRING, 
      allowNull: false,
    },
    email:{ 
      type: DataTypes.STRING, 
      allowNull: false,
    },
    slack_id:{ 
      type: DataTypes.STRING, 
      allowNull: false,
    },
    city:{ type: 
      DataTypes.STRING, 
      allowNull: false,
    },
    state:{ 
      type: DataTypes.STRING, 
      allowNull: false,
    },
    country:{ 
      type: DataTypes.STRING, 
      allowNull: false,
    },
    organization:{ 
      type: DataTypes.STRING, 
      allowNull: false,
    },
    isArchive:{
      type: DataTypes.BOOLEAN,
      allowNull: false,
    } 
  }, {
    sequelize,
    modelName: 'Client',
  });
  return Client;
};