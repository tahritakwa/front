import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-cash-flow-check-box',
  templateUrl: './cash-flow-check-box.component.html',
  styleUrls: ['./cash-flow-check-box.component.scss']
})
export class CashFlowCheckBoxComponent implements OnInit {
  @Input() status: boolean;
  constructor() {
  }

  ngOnInit() {
  }

}
