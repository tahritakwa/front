import { Component, OnInit } from '@angular/core';
import { DocumentEnumerator } from '../../../models/enumerators/document.enum';
import { StockCorrectionConstant } from '../../../constant/stock-correction/stock-correction.constant';

@Component({
  selector: 'bs-list',
  templateUrl: './bs-list.component.html',
  styleUrls: ['./bs-list.component.scss']
})
export class BsListComponent implements OnInit {
  documentType = DocumentEnumerator.BS;
  advencedAddLink = StockCorrectionConstant.BS_ADD;
  translateFilterName = StockCorrectionConstant.ALL_BS;
  ngOnInit() {
  }
}
