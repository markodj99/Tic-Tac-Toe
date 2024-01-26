import { DataTypes, Model} from 'sequelize';
import seq from '../database/dbHandler';
import User from './user';

class MultiPlayerTTT extends Model {}

MultiPlayerTTT.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    creatorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        }
    },
    joinerId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: User,
            key: 'id',
        }
    },
    creatorSymbol: {
        type: DataTypes.STRING(10),
        allowNull: false,
        validate: {
            isIn: [['X', 'O']]
        }
    },
    joinerSymbol: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: 'null',
        validate: {
            isIn: [['null', 'X', 'O']]
        }
    },
    turnToMove: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: 'creator',
        validate: {
            isIn: [['creator', 'joiner']]
        }
    },
    moves: {
        type: DataTypes.ARRAY(DataTypes.STRING(25)),
        allowNull: false,
        defaultValue: ['null','null','null','null','null','null','null','null','null']
    },
    winner: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: -1,
    },
    boardState: {
        type: DataTypes.ARRAY(DataTypes.STRING(5)),
        allowNull: false,
        defaultValue: ['null','null','null','null','null','null','null','null','null']
    }
},  {
    sequelize: seq,
    modelName: 'MultiPlayerTTT',
    tableName: 'MultiPlayerTTT'
});

// User.hasMany(MultiPlayerTTT, {
//     foreignKey: 'creatorId'
// });
// User.hasMany(MultiPlayerTTT, {
//     foreignKey: 'joinerId'
// });
MultiPlayerTTT.belongsTo(User, {
    foreignKey: 'creatorId',
    as: 'Creator'
});

MultiPlayerTTT.belongsTo(User, {
    foreignKey: 'joinerId',
    as: 'Joiner'
});


export const upMultiPlayerTTT = async (): Promise<void> => {
    await MultiPlayerTTT.sync({ force: true });
};

export default MultiPlayerTTT;
