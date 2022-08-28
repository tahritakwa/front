export class PurchaseBudgetPriceRequest {
    IdPriceRequest: number;
    IdTiers: number;
    constructor(idPriceRequest: number, idTiers: number) {
        this.IdPriceRequest = idPriceRequest;
        this.IdTiers = idTiers;
    }
}
