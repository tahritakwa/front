export class ProvisioningOption {
    Id: number;
    SearchByQty: boolean;
    SearchByPurhaseHistory: boolean;
    SearchBySalesHistory: boolean;
    SearchByNewReferences: boolean;

    PucrahseStartDate: Date;
    PucrahseEndDate: Date;

    SalesStartDate: Date;
    SalesEndDate: Date;

    NewReferencesStartDate?: Date;
    NewReferencesEndDate?: Date;

    IsDeleted: boolean;

    constructor(SearchBySalesHistory: boolean, SearchByPurhaseHistory: boolean, SearchByQty: boolean
        , SearchByNewReferences: boolean, PucrahseStartDate: Date, EndDatePurchase: Date, SatrtDateSales: Date
        , EndDateSales: Date, NewReferencesStartDate: Date, NewReferencesEndDate: Date) {
        this.PucrahseStartDate = PucrahseStartDate;
        this.PucrahseEndDate = EndDatePurchase;
        this.SalesStartDate = SatrtDateSales;
        this.SalesEndDate = EndDateSales;
        this.NewReferencesStartDate = NewReferencesStartDate;
        this.NewReferencesEndDate = NewReferencesEndDate;
        this.SearchBySalesHistory = SearchBySalesHistory;
        this.SearchByPurhaseHistory = SearchByPurhaseHistory;
        this.SearchByQty = SearchByQty;
        this.SearchByNewReferences = SearchByNewReferences;
    }
}
