import { Sequelize } from 'sequelize';
import { initModels, product, order, orderdetail, productCreationAttributes, orderCreationAttributes, orderdetailCreationAttributes } from "./models/init-models";
import * as dotenv from 'dotenv';
import { ApolloServer, gql } from 'apollo-server';
import { readFileSync } from 'fs';

const typeDefs = readFileSync("./src/product.graphql").toString('utf-8');
dotenv.config();

const sequelize = new Sequelize(
	process.env.DB_NAME as string,
	process.env.DB_USER as string,
	process.env.DB_PASS as string, {
	host: process.env.DB_HOST as string,
	dialect: 'mysql'
});

// import models into sequelize instance
initModels(sequelize);

const resolvers = {
	Query: {
		products: async () => await product.findAll(),
        orders: async () => await order.findAll(),
        orderdetails: async () => await orderdetail.findAll()
	},
	Mutation: {
		GetDetailProduct: async (_parent: any, args: any) => {
			return await product.findByPk(args.id);
		},
		CreateProduct: async (_parent: any, args: any) => {
			const now = new Date();
			const deadline = now;
			deadline.setDate(now.getDate() + 4);

			const newProduct: productCreationAttributes = {
				name: args.name,
				stock: args.stock,
				price: args.price,
				created: now.toDateString()

			}
			return await product.create(newProduct);
		},
		UpdateProduct: async (_parent: any, args: any) => {
			return await product.update({
				name: args.name,
			}, {
				where: {
					id: args.id
				}
			})
		},
		DeleteProduct: async (_parent: any, args: any) => {
			return await product.destroy({
				where: {
					id: args.id
				}
			})
		},

        //order


        GetDetailOrder: async (_parent: any, args: any) => {
			return await order.findByPk(args.id);
		},
		CreateOrder: async (_parent: any, args: any) => {
			const now = new Date();
			const deadline = now;
			deadline.setDate(now.getDate() + 4);

			const newOrder: orderCreationAttributes = {
				transcode: args.transcode,
				created: now.toDateString() 

			}
			return await order.create(newOrder);
		},
		UpdateOrder: async (_parent: any, args: any) => {
			return await order.update({
				transcode: args.transcode,
			}, {
				where: {
					id: args.id
				}
			})
		},
		DeleteOrder: async (_parent: any, args: any) => {
			return await order.destroy({
				where: {
					id: args.id
				}
			}) 
		}



	}
};



const server = new ApolloServer({
	typeDefs,
	resolvers,
});

server.listen().then(({ url }) => {
	console.log(`🚀 Server ready at ${url}`);
});

function newOrder(newOrder: any) {
    throw new Error('Function not implemented.');
}
