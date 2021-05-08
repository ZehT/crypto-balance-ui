import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Asset, Position} from "../asset/asset-interface";
import {HttpClient} from "@angular/common/http";
import {interval, Subscription} from "rxjs";
import {AssetService} from "../asset/asset-service.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: 'div[card-component]',
    templateUrl: './card-component.component.html',
    styleUrls: ['./card-component.component.css']
})
export class CardComponentComponent implements OnInit {

    @Input() asset: Asset;
    @Output() onCloseAsset: EventEmitter<Event> = new EventEmitter();

    ASSET_IMG_MAP: Map<string, string>;
    KRAKEN_RESULT_KEY: string = 'result';
    KRAKEN_ERROR_KEY: string = 'error';
    KRAKEN_PRICE_KEY: string = 'a';

    isLoading: boolean = true;
    subscription: Subscription;
    position: Position;

    constructor(private assetService: AssetService, private httpClient: HttpClient, private modalService: NgbModal) {
        this.createAssetSubscription();
    }

    ngOnInit(): void {
        this.ASSET_IMG_MAP = this.buildAssetImageMap();
        this.krakenGetTicker(this.asset.key);
    }

    private createAssetSubscription() {
        this.subscription = interval(5000).subscribe((() => {
            this.krakenGetTicker(this.asset.key);
        }));
    }

    private async krakenGetTicker(assetName: string): Promise<void> {
        await this.startLoading();
        console.log('krakenGetTicker: ' + this.asset.key);
        const currentPrice: number = await this.httpClient.get('https://api.kraken.com/0/public/Ticker?pair=' + assetName + 'eur').toPromise()
            .then((response: any) => {
                const error = response[this.KRAKEN_ERROR_KEY]
                if (error.length > 0) {
                    console.log(error[0]);
                } else {
                    // get result key
                    const result = response[this.KRAKEN_RESULT_KEY];
                    // get the first key of result
                    const firstKey = Object.keys(result)[0];
                    // extract price from result
                    return Number(result[firstKey][this.KRAKEN_PRICE_KEY][0]);
                }
            });
        if (currentPrice) {
            this.asset.currentPrice = currentPrice;
            let totalCoins = 0;
            let totalInvested = 0;
            this.asset.positions.forEach(position => {
                totalCoins += position.coinsOwned;
                totalInvested += position.openedPrice * position.coinsOwned;
            });
            this.asset.totalCoins = totalCoins;
            this.asset.totalInvested = totalInvested;
            this.asset.currentValue = this.asset.totalCoins * this.asset.totalInvested;
            this.asset.profitLoss = this.asset.currentValue - this.asset.totalInvested;
        }
        await this.stopLoading();
    }

    private async startLoading(): Promise<void> {
        this.isLoading = true;
    }

    private async stopLoading(): Promise<void> {
        this.isLoading = false;
    }

    public getAssetImgKey(assetName): string {
        let assetImgkey = assetName;
        if (this.ASSET_IMG_MAP.get(assetName)) {
            assetImgkey = this.ASSET_IMG_MAP.get(assetName);
        }
        return assetImgkey;
    }

    private buildAssetImageMap(): Map<string, string> {
        const assetImgMap = new Map();
        assetImgMap.set('xbt', 'btc');
        assetImgMap.set('xdg', 'doge');
        return assetImgMap;
    }

    public cardProfitOrLoss(): string {
        let css = 'card-footer border-dark ';
        if (this.asset.currentValue > this.asset.totalInvested) {
            css += 'bg-success';
        } else {
            css += 'bg-danger';
        }
        return css;
    }

    public openClosePositionModal(content, position) {
        this.position = position;
        this.position.closedPrice = null;
        this.modalService.open(content).result.then(async (onSave) => {
            await this.assetService.closePosition(this.asset.id, this.position);
            this.subscription.unsubscribe();
            // TODO não fazer refresh de todos os cards
            this.onCloseAsset.emit();
        }, (dismissOrCancel) => {
            // do nothing
        });
    }

    public async openAddPositionModal(content) {
        await this.startLoading();
        this.position = {} as Position;
        this.modalService.open(content).result.then(async (onSave) => {
            this.subscription.unsubscribe();
            await this.assetService.addPosition(this.asset.id, this.position);
            this.asset = await this.assetService.findAsset(this.asset.id);
            await this.krakenGetTicker(this.asset.key);
            this.createAssetSubscription();
        }, (dismissOrCancel) => {
            // do nothing
        });
        await this.stopLoading();
    }

}
