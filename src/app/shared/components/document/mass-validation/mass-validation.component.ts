import { Component, OnInit, Input } from '@angular/core';
import { PredicateFormat, Filter, Relation, Operation, OrderBy, OrderByDirection } from '../../../utils/predicate';
import { SharedConstant } from '../../../../constant/shared/shared.constant';
import { DocumentConstant } from '../../../../constant/sales/document.constant';
import { documentStatusCode } from '../../../../models/enumerators/document.enum';
import { DocumentService } from '../../../../sales/services/document/document.service';
import { DataSourceRequestState } from '@progress/kendo-data-query';
import { GridDataResult } from '@progress/kendo-angular-grid';

@Component({
  selector: 'app-mass-validation',
  templateUrl: './mass-validation.component.html',
  styleUrls: ['./mass-validation.component.scss']
})
export class MassValidationComponent implements OnInit {



  @Input() DocumentType;
  @Input() isSalesDocument;
  @Input() formatFoSalesOptions;

  public gridState: DataSourceRequestState = {
    skip: 0,
    take: 10000,
    filter: { // Initial filter descriptor
      logic: 'and',
      filters: []
    }
  };
  predicate: PredicateFormat;
  public gridView: GridDataResult;
  selectedDocument: any;
  public mySelection: any[] = [];

  constructor(public documentService: DocumentService) { }

  ngOnInit() {
    this.InitDatasource();
  }


  preparePredicate() {
    this.predicate = new PredicateFormat();
    this.predicate.Filter = new Array<Filter>();
    this.predicate.OrderBy = new Array<OrderBy>();
    this.predicate.Relation = new Array<Relation>();
    this.predicate.Filter.push(new Filter(DocumentConstant.DOCUMENT_TYPE_CODE, Operation.eq, this.DocumentType));
    this.predicate.Filter.push(new Filter(DocumentConstant.ID_DOCUMENT_STATUS, Operation.eq, documentStatusCode['Provisional']));
    this.predicate.OrderBy.push.apply(this.predicate.OrderBy, [new OrderBy(DocumentConstant.ID_DOCUMENT, OrderByDirection.desc)]);
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(DocumentConstant.ID_DOCUMENT_STATUS_NAVIGATION),
    new Relation(DocumentConstant.ID_TIER_NAVIGATION)]);
  }

  InitDatasource() {
    this.preparePredicate();
    this.documentService.reloadServerSideData(this.gridState, this.predicate,
      DocumentConstant.GET_DATASOURCE_PREDICATE_DOCUMENT).subscribe(data => {
        this.gridView = data;
        if (this.isSalesDocument) {
          this.gridView.data.forEach(x => {
            x.strcurrency = x.DocumentTtcpriceWithCurrency.toLocaleString('fr-FR', this.formatFoSalesOptions);
          });
        } else {
          this.gridView.data.forEach(x => {
            x.strcurrency = x.DocumentTtcpriceWithCurrency.toLocaleString('fr-FR', x.FormatOption);
          });
        }
      });
  }
  onSelect(dataitem): void {
    this.selectedDocument = dataitem;
    const index = this.mySelection.findIndex(doc => doc === this.selectedDocument);
    if (index < 0) {
      this.mySelection.push(this.selectedDocument);
      dataitem.selected = true;
    } else {
      this.mySelection = this.mySelection.filter(x => x !== dataitem);
      dataitem.selected = false;
    }
  }

  IsSelected(dataitem) {
    return (this.mySelection.findIndex(doc => doc === dataitem)) >= 0;
  }
}
