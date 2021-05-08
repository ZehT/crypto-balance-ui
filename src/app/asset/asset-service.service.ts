import {Injectable} from "@angular/core";
import {Asset, Position} from "./asset-interface";
import {HttpCommons} from "../util/http/http.commons";

@Injectable({
    providedIn: 'root'
})
export class AssetService {

    private ASSETS = 'http://localhost:8080/assets/';
    private ASSET = 'http://localhost:8080/assets/{assetId}';
    private POSITION_CLOSE = 'http://localhost:8080/assets/{assetId}/position/{possitionId}';
    private POSITION_ADD = 'http://localhost:8080/assets/{assetId}/position/';

    public constructor() {
    }

    public async getAssets(): Promise<Array<Asset>> {
        return await HttpCommons.getRequest<Array<Asset>>(this.ASSETS);
    }

    public async findAsset(assetId: number): Promise<Asset> {
        let url = this.ASSET.replace("{assetId}", String(assetId));
        return await HttpCommons.getRequest<Asset>(url);
    }

    public async addAsset(asset: Asset) {
        await HttpCommons.postRequest<Asset>(this.ASSETS, asset);
    }

    public async closePosition(assetId: number, position: Position) {
        let url = this.POSITION_CLOSE.replace("{assetId}", String(assetId));
        url = url.replace('{possitionId}', String(position.id));
        await HttpCommons.putRequest<Asset>(url, position);
    }

    public async addPosition(assetId: number, position: Position) {
        let url = this.POSITION_ADD.replace("{assetId}", String(assetId));
        await HttpCommons.postRequest<Asset>(url, position);
    }
}
