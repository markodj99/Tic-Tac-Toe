import { RegisterParams } from "../types/graphqlTypes";
import User from "../models/user";
import { Op, Sequelize, Transaction } from "sequelize";
import seq from "../database/dbHandler";
import SinglePlayerTTT from "../models/singlePlayerTTT";
import MultiPlayerTTT from "../models/multiPlayerTTT";

class UserRepo {
    private db:Sequelize = seq;

    constructor() {}

    async getUserById(userId:number):Promise<User | null>
    {
        try {
            const user = await User.findOne({
                where: { id: userId },
                include: [
                    {
                      model: MultiPlayerTTT,
                      as: 'MultiPlayerCreatedGames',
                      where: {
                        [Op.or]: [
                            { creatorId: userId },
                        ],
                        winner: {
                            [Op.not]: -1
                        }
                      },
                      include: [
                        {
                            model: User,
                            as: 'Joiner',
                            attributes: ['username']
                        }
                    ],
                    required: false
                    },
                    {
                        model: MultiPlayerTTT,
                        as: 'MultiPlayerJoinedGames',
                        where: {
                            [Op.or]: [
                                { joinerId: userId }
                            ],
                            winner: {
                                [Op.not]: -1
                            }
                        },
                        include: [
                            {
                                model: User,
                                as: 'Creator',
                                attributes: ['username']
                            }
                        ],
                        required: false
                    },
                    {
                        model: SinglePlayerTTT,
                        as: 'SinglePlayerGames',
                        where: {
                            playerId: userId,
                            winner: {
                                [Op.not]: 'ongoing'
                            }
                        },
                        required: false
                    },
                  ]
            });
            return user;
        } catch (error) {
            console.error('Error while loading user from db by id:', error);
            throw error;
        }
    }

    async getUserByEmail(email:string):Promise<User | null>
    {
        try {
            const user = await User.findOne({
                where: { email }
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
                where: { username }
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
            });
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
