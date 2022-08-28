import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-prices-type',
  templateUrl: './prices-type.component.html',
  styleUrls: ['./prices-type.component.scss']
})
export class PricesTypeComponent implements OnInit {
  @Input() allowCustom;
  @Input() form: FormGroup;
  @Output() Selected = new EventEmitter<boolean>();
  // Status List
  public prices = [{ 'id': 1, 'name': 'RATE' }, { 'id': 2, 'name': 'DISCOUNT' }];
  constructor(public translate: TranslateService) {
    this.prices.forEach(obj => {

      translate.get(obj.name).subscribe(tr => obj.name = tr);
    });
  }
  ngOnInit() {
  }
  public onSelect(event): void {
    this.Selected.emit(event);
  }
}
