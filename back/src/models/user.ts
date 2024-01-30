import { DataTypes, Model} from 'sequelize';
import seq from '../database/dbHandler';

class User extends Model {}

User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING(55),
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING(1024),
        allowNull: false
    }
},  {
    sequelize: seq,
    modelName: 'User',
    tableName: 'User'
});

export const upUser = async (): Promise<void> => {
    await User.sync({ force: false });
};

export default User;
