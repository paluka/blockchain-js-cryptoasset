import koaRouter from 'koa-router';
import { start } from './blockchain.controller';

const blockchainRouter = koaRouter().post('/start', start);

export default blockchainRouter;
