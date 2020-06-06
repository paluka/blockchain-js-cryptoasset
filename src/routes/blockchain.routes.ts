import koaRouter from 'koa-router';
import { someEndpoint } from './blockchain.controller';

const blockchainRouter = koaRouter().post('/someEndpoint', someEndpoint);

export default blockchainRouter;
