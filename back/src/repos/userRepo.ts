import { RegisterParams } from "../config/types";
import User from "../models/user";
import { Sequelize, Transaction } from "sequelize";
import seq from "../database/dbHandler";

class UserRepo {
    private db:Sequelize = seq;

    constructor() {}

    async getUserByEmail(email:string):Promise<User | null>
    {
        try {
            const user = await User.findOne({
                where: { email },
            });
            return user;
        } catch (error) {
            console.error('Error while loading user from db by email:', error);
            throw error;
        }
    }

    async getUserByUsername(username:string):Promise<User | null> {
        try {
            const user = await User.findOne({
                where: { username },
            });
            return user;
        } catch (error) {
            console.error('Error while loading user from db by username:', error);
            throw error;
        }
    }
    
    async createNewUser(params:RegisterParams):Promise<boolean> {
        const transaction:Transaction = await this.db.transaction();
        try {
            const _ = await User.create({
                username: params.username,
                email: params.email,
                password: params.password
            }, {
                transaction
            }
            );

            await transaction.commit();
            return true;
        } catch (error) {
            await transaction.rollback();
            console.error('Error while creating new user:', error);
            throw error;
        }
    }
}

export default UserRepo;
