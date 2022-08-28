import { PredicateFormat } from '../../shared/utils/predicate';

export class DocumentLinesWithPaging {
    IdDocument: number;
    pageSize: number;
    Skip: number;
    Coefficient: number;
    RefDescription: string;
    isSalesDocument: boolean;
    predicate: PredicateFormat;
    constructor(IdDocument: number,
        pageSize: number,
        Skip: number, Coefficient?: number, searchfield?: string, isSalesDocument?: boolean, predicate?: PredicateFormat) {
        this.IdDocument = IdDocument;
        this.pageSize = pageSize;
        this.Skip = Skip;
        this.Coefficient = Coefficient;
        this.isSalesDocument = isSalesDocument;
        this.predicate = predicate;
    }
}
