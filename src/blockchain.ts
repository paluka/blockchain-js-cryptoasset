import sha256 from 'sha256';
import rp from 'request-promise';
import { v4 as uuidv4 } from 'uuid';

import { BLOCK_SIZE_BYTES } from './constants';
import Block from './block';

export default class Blockchain implements BlockchainType {
  address: string;
  chain: BlockType[];
  consensusAlgorithm: ConsensusAlgorithmType;
  transactionPool: TransactionType[];
  localNodeUrl: string;
  peers: string[];

  constructor(localNodeUrl, peer = null) {
    this.address = uuidv4.split('-').join('');
    this.chain = [];
    this.transactionPool = [];
    this.localNodeUrl = localNodeUrl;
    this.peers = peer ? [peer] : [];
    this.setConsensusAlgorithm(this.proofOfWork);
  }

  start(): void {
    if (this.peers.length) {
      this.registerWithPeer();
      this.syncBlockchain();
    }

    this.mine();
  }

  registerWithPeer() {}

  syncBlockchain() {}

  setConsensusAlgorithm(consensusAlgorithm: ConsensusAlgorithmType): void {
    this.consensusAlgorithm = consensusAlgorithm;
  }

  getNewTransactionsForBlock(): TransactionType[] {
    const transactions: TransactionType[] = [];
    let size: number = 0;

    while (size < BLOCK_SIZE_BYTES && this.transactionPool.length) {
      const tempTransaction = this.transactionPool.shift();
      transactions.push(tempTransaction);
      size++; // TODO - calculate size of the transaction
    }

    return transactions;
  }

  getLastBlock(): BlockType {
    if (!this.chain.length) {
      return null;
    }
    const lastBlockIndex: number = this.chain.length - 1;
    return this.chain[lastBlockIndex];
  }

  getLastBlockHash(): string {
    const lastBlock: BlockType = this.getLastBlock();

    if (!lastBlock) {
      return '0';
    }
    return lastBlock.hash;
  }

  mine(): BlockType {
    const prevHash: string = this.getLastBlockHash();
    const index: number = this.chain.length;
    const transactions: TransactionType[] = this.getNewTransactionsForBlock();

    const newBlock: BlockType = new Block(index, prevHash, transactions);
    const finalBlock: BlockType = this.consensusAlgorithm(newBlock);

    this.chain.push(finalBlock);
    return finalBlock;
  }

  hashBlock(newBlock: BlockType): string {
    const dataString = newBlock.toString();
    return sha256(dataString);
  }

  proofOfWork(newBlock: BlockType): BlockType {
    let nonce: number = -1;
    let hash: string = '';

    do {
      nonce++;
      newBlock.setNonce(nonce);
      hash = this.hashBlock(newBlock);
    } while (hash.substring(0, 4) !== '0000');

    newBlock.setHash(hash);
    return newBlock;
  }
}
