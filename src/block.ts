export default class Block implements BlockType {
  hash: string;
  index: number;
  nonce: number;
  prevHash: string;
  timestamp: number;
  transactions: TransactionType[];

  constructor(index, prevHash, transactions) {
    this.index = index;
    this.prevHash = prevHash;
    this.timestamp = Date.now();
    this.transactions = transactions;
  }

  setHash(hash: string): void {
    this.hash = hash;
  }

  setNonce(nonce: number): void {
    this.nonce = nonce;
  }
}
