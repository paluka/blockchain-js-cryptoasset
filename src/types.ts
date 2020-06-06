interface BlockchainType {
  chain: BlockType[];
  transactionPool: TransactionType[];
  localNodeUrl: string;
  peers: string[];
}

interface BlockType {
  hash: string;
  index: number;
  nonce: number;
  prevHash: string;
  timestamp: number;
  transactions: TransactionType[];

  setHash(hash: string): void;
  setNonce(nonce: number): void;
}

interface TransactionType {
  amount: number;
  id: string;
  senderAddress: string;
  recipientAddress: string;
}

type ConsensusAlgorithmType = (newBlock: BlockType) => BlockType;
