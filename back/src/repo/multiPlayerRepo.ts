import { Op, Sequelize, Transaction } from "sequelize";
import seq from "../database/dbHandler";
import MultiPlayerTTT from "../models/multiPlayerTTT";
import User from "../models/user";

class MultiPlayerRepo {
    private db:Sequelize = seq;

    constructor() {}

    async getOngoingGameByUserId(userId:number):Promise<MultiPlayerTTT | null> {
        try {
            const game = await MultiPlayerTTT.findOne({
                where: {
                  [Op.or]: [
                    { creatorId: userId, winner: -1 },
                    { joinerId: userId, winner: -1 }
                  ]
                }
            });
            return game;
        } catch (error) {
            console.error('Error while quering ongoing user mp games:', error);
            throw error;
        }
    }

    async createNewGame(creatorId:number, creatorSymbol:string, joinerSymbol:string):Promise<MultiPlayerTTT> {
        const transaction:Transaction = await this.db.transaction();
        try {
            const game = await MultiPlayerTTT.create({
                creatorId: creatorId,
                creatorSymbol: creatorSymbol,
                joinerSymbol: joinerSymbol
            }, {
                transaction
            });
            await transaction.commit();
            return game;
        } catch (error) {
            await transaction.rollback();
            console.error('Error while creating new user mp games:', error);
            throw error;
        }
    }

    async getAllExistingGames():Promise<MultiPlayerTTT[]> {
        try {
            const games = await MultiPlayerTTT.findAll({
                where: {
                    joinerId: null
                  }, 
                  include: [
                    {
                      model: User,
                      as: 'Creator',
                      attributes: ['username']
                    }
                ]
            });
            return games;
        } catch (error) {
            console.error('Error while creating new user mp games:', error);
            throw error;
        }
    }

    async getGameById(gameId:number):Promise<MultiPlayerTTT | null> {
        try {
            const game = await MultiPlayerTTT.findOne({
                where: {
                  id: gameId
                },
                include: [
                    {
                      model: User,
                      as: 'Creator',
                      attributes: ['username']
                    },
                    {
                      model: User,
                      as: 'Joiner',
                      attributes: ['username']
                    }
                ]
            });
            return game;
        } catch (error) {
            console.error('Error while quering ongoing user sp games:', error);
            throw error;
        }
    }

    async updateGame(game:MultiPlayerTTT | null, object:object):Promise<MultiPlayerTTT | null> {
        if (!game) return null;

        const transaction:Transaction = await this.db.transaction();
        try {
            const responseGame = await game.update(object, {transaction});
            transaction.commit();
            return responseGame;
        } catch (error) {
            await transaction.rollback();
            console.error('Error while updating mp game:', error);
            throw error;
        }
    }
}

export default MultiPlayerRepo;
