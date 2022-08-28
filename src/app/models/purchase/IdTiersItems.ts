export class TiersItemViewModel {
    IdTiers: Array<number>;
    IdItem: number;
    constructor(tiers: Array<number>, idItems: number) {
        this.IdTiers = tiers;
        this.IdItem = idItems;
    }
}

