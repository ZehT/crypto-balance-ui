export interface Asset {
    id?: number;
    key?: string;
    positions?: Array<Position>;
    currentPrice?: number;
    currentValue?: number;
    totalCoins?: number;
    totalInvested?: number;
    profitLoss?: number;
}

export interface Position {
    id?: number;
    openedPrice?: number;
    coinsOwned?: number;
    closedPrice?: number;
}
