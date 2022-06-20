export interface TokenAccountType {
  jsonrpc?: string;
  result?: Result;
  id?: number;
  error?: any;
}

export interface Result {
  context?: Context;
  value?: Value[];
}

export interface Context {
  slot?: number;
}

export interface Value {
  account?: Account;
  pubkey?: string;
}

export interface Account {
  data?: Data;
  executable?: boolean;
  lamports?: number;
  owner?: string;
  rentEpoch?: number;
}

export interface Data {
  parsed?: Parsed;
  program?: string;
  space?: number;
}

export interface Parsed {
  info?: Info;
  type?: string;
}

export interface Info {
  isNative?: boolean;
  mint?: string;
  owner?: string;
  state?: string;
  tokenAmount?: TokenAmount;
}

export interface TokenAmount {
  amount?: string;
  decimals?: number;
  uiAmount?: number;
  uiAmountString?: string;
}
