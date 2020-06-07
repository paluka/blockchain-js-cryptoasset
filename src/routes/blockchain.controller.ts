import * as Koa from 'koa';
import { getBlockchain } from '../app';

export function start(ctx: Koa.Context) {
  const blockchain = getBlockchain();
}
