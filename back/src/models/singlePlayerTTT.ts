import { DataTypes, Model} from 'sequelize';
import seq from '../database/dbHandler';
import User from './user';

class SinglePlayerTTT extends Model {}

SinglePlayerTTT.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    playerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        }
    },
    moves: {
        type: DataTypes.ARRAY(DataTypes.STRING(15)),
        allowNull: false,
        defaultValue: ['null','null','null','null','null','null','null','null','null']
    },
    computerSymbol: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: 'null',
        validate: {
            isIn: [['null', 'X', 'O']]
        }
    },
    winner: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: 'ongoing',
        validate: {
            isIn: [['ongoing', 'user', 'computer', 'draw']]
        }
    },
    boardState: {
        type: DataTypes.ARRAY(DataTypes.STRING(5)),
        allowNull: false,
        defaultValue: ['null','null','null','null','null','null','null','null','null']
    }
},  {
    sequelize: seq,
    modelName: 'SinglePlayerTTT',
    tableName: 'SinglePlayerTTT'
});

export const upSinglePlayerTTT = async (): Promise<void> => {
    await SinglePlayerTTT.sync({ force: true });
};

export default SinglePlayerTTT;
