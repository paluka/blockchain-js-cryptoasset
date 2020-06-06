import { v4 as uuidv4 } from 'uuid';

export default class Transaction implements TransactionType {
  amount: number;
  id: string;
  senderAddress: string;
  recipientAddress: string;

  constructor(amount, senderAddress, recipientAddress) {
    this.amount = amount;
    this.id = uuidv4().split('-').join('');
    this.senderAddress = senderAddress;
    this.recipientAddress = recipientAddress;
  }
}
