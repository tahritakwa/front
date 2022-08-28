export class Misc {
     articleStatusId: number;
     articleStatusDescription: string;
     articleStatusValidFromDate: number;
     quantityPerPackage: number;
     quantityPerPartPerPackage: number;
     isSelfServicePacking: boolean;
     hasMandatoryMaterialCertification: boolean;
     isRemanufacturedPart: boolean;
     isAccessory: boolean;
     batchSize1: number;
     batchSize2: number;
}

export class GenericArticle {
     genericArticleId: number;
     genericArticleDescription: string;
     legacyArticleId: number;
}

export class ArticleText {
     informationTypeKey: number;
     informationTypeDescription: string;
     isImmediateDisplay: boolean;
     text: string[];
}

export class OemNumber {
     articleNumber: string;
     mfrId: number;
     mfrName: string;
}

export class ArticleCriteria {
     criteriaId: number;
     criteriaDescription: string;
     criteriaAbbrDescription: string;
     criteriaType: string;
     rawValue: string;
     formattedValue: string;
     immediateDisplay: boolean;
     isMandatory: boolean;
     isInterval: boolean;
     criteriaUnitDescription: string;
}

export class Linkage {
     linkageTargetTypeId: number;
     linkageTargetId: number;
     legacyArticleLinkId: number;
     genericArticleId: number;
     genericArticleDescription: string;
     linkageCriteria: any[];
     linkageText: any[];
}

export class Image {
     imageURL50: string;
     imageURL100: string;
     imageURL200: string;
     imageURL400: string;
     imageURL800: string;
     fileName: string;
     typeDescription: string;
     headerDescription: string;
}

export class TecDocRowItem {
     DataSupplierId: number;
     ArticleNumber: string;
     MfrId: number;
     MfrName: string;
     Misc: Misc;
     GenericArticles: GenericArticle[];
     ArticleText: ArticleText[];
     Gtins: string[];
     TradeNumbers: any[];
     OemNumbers: OemNumber[];
     ReplacesArticles: any[];
     ReplacedByArticles: any[];
     ArticleCriteria: ArticleCriteria[];
     Linkages: Linkage[];
     Pdfs: any[];
     Images: Image[];
     ComparableNumbers: any[];
     Links: any[];
     TotalLinkages: number;
     Prices: any[];
}
