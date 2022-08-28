import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-toogle-btn-filter',
  templateUrl: './toogle-btn-filter.component.html',
  styleUrls: ['./toogle-btn-filter.component.scss']
})
export class ToogleBtnFilterComponent implements OnInit {

  @Input() leftCriteria: string;
  @Input() rightCriteria: string;
  @Input() buttonStatus: boolean; // false : button on left side
  @Output() newItemEvent = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  toggleButton(event: any) {
    event.stopPropagation();
    this.buttonStatus = !this.buttonStatus;
    this.newItemEvent.emit(this.buttonStatus);
  }

  changeButton(event: any) {
    event.source.checked = this.buttonStatus;
  }

}
