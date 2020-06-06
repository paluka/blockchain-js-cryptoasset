import sha256 from 'sha256';
import { BLOCK_SIZE_BYTES } from './constants';
import Block from './block';

const localNodeUrl = process.argv[3];

export default class Blockchain implements BlockchainType {
  chain: BlockType[];
  consensusAlgorithm: ConsensusAlgorithmType;
  transactionPool: TransactionType[];
  localNodeUrl: string;
  peers: string[];

  constructor() {
    this.chain = [];
    this.transactionPool = [];
    this.localNodeUrl = localNodeUrl;
    this.peers = [];
    this.setConsensusAlgorithm(this.proofOfWork);
    this.mine();
  }

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
