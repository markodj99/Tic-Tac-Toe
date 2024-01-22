import { Sequelize, Transaction } from "sequelize";
import seq from "../database/dbHandler";
import SinglePlayerTTT from "../models/singlePlayerTTT";

class SinglePlayerRepo {
    private db:Sequelize = seq;

    constructor() {}

    async hasOngoingGame(userId:number):Promise<boolean> {
        try {
            const game = await SinglePlayerTTT.findOne({
                where: {
                  playerId: userId,
                  winner: 'ongoing',
                }
            });
            
            if (game === null) return false;
            return true;
        } catch (error) {
            console.error('Error while quering ongoing user games:', error);
            throw error;
        }
    }

    async getOngoingGameByUserId(userId:number):Promise<SinglePlayerTTT | null> {
        try {
            const game = await SinglePlayerTTT.findOne({
                where: {
                  playerId: userId,
                  winner: 'ongoing',
                },
            });
            return game;
        } catch (error) {
            console.error('Error while quering ongoing user games:', error);
            throw error;
        }
    }

    async createNewGame(userId:number):Promise<SinglePlayerTTT> {
        const transaction:Transaction = await this.db.transaction();
        try {
            const game = await SinglePlayerTTT.create({
                playerId: userId,
            }, {
                transaction
            });
            await transaction.commit();
            return game;
        } catch (error) {
            await transaction.rollback();
            console.error('Error while creating new user games:', error);
            throw error;
        }
    }

    async updateGame(game:SinglePlayerTTT | null, object:object):Promise<SinglePlayerTTT | null> {
        if (!game) return null;

        const transaction:Transaction = await this.db.transaction();
        try {
            const responseGame = await game.update(object, {transaction});
            transaction.commit();
            return responseGame;
        } catch (error) {
            await transaction.rollback();
            console.error('Error while setting computer side:', error);
            throw error;
        }
    }
}

export default SinglePlayerRepo;
