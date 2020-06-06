import * as Koa from 'koa';
import * as Router from 'koa-router';

import blockchainRouter from './routes/blockchain.routes';
import Blockchain from './blockchain';

const app = new Koa();
const api = new Router();

api.use('/', blockchainRouter.routes());
app.use(api.routes());

const blockchain = new Blockchain();

const PORT = process.env.PORT || 3001;
console.log(`Starting on server on port ${PORT}`);
app.listen(PORT);

export function getBlockchain() {
  return blockchain;
}
