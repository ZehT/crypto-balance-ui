import {Component, OnInit} from '@angular/core';
import {Asset, Position} from "./asset-interface";
import {AssetService} from "./asset-service.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: 'app-asset',
    templateUrl: './asset.component.html',
    styleUrls: ['./asset.component.css']
})
export class AssetComponent implements OnInit {

    public assets: Array<Asset> = [];
    public asset: Asset = {};
    public position: Position = {};

    constructor(private assetService: AssetService, private modalService: NgbModal) {
    }

    ngOnInit(): void {
        this.getAssets();
    }

    private async getAssets(): Promise<void> {
        this.assets = await this.assetService.getAssets();
    }

    public openAddAssetModal(content) {
        this.asset = {} as Asset;
        this.asset.positions = [] as Array<Position>;
        this.position = {} as Position;
        this.asset.positions.push(this.position)
        this.modalService.open(content).result.then(async (onSave) => {
            await this.assetService.addAsset(this.asset);
            await this.getAssets();
        }, (dismissOrCancel) => {
            // do nothing
        });
    }

    public totalInvested() {
        let totalInvested: number = 0;
        this.assets.forEach(asset => {
            if (asset.totalInvested) {
                totalInvested += asset.totalInvested;
            }
        })
        return totalInvested;
    }

    public totalProfitLoss() {
        let totalProfitLoss: number = 0;
        this.assets.forEach(asset => {
            if (asset.currentValue) {
                totalProfitLoss += asset.currentValue;
            }
        })
        return totalProfitLoss;
    }

    public async reloadAssets() {
        this.assets = [] as Array<Asset>;
        await this.getAssets();
    }

}
