import { Component, OnInit } from '@angular/core';
import { DocumentEnumerator } from '../../../models/enumerators/document.enum';
import { StockCorrectionConstant } from '../../../constant/stock-correction/stock-correction.constant';

@Component({
  selector: 'app-be-list',
  templateUrl: './be-list.component.html',
  styleUrls: ['./be-list.component.scss']
})
export class BeListComponent implements OnInit {
  documentType = DocumentEnumerator.BE;
  advencedAddLink = StockCorrectionConstant.BE_ADD;
  translateFilterName = StockCorrectionConstant.ALL_BE;
  ngOnInit() {
  }
}
