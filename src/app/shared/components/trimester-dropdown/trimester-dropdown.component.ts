import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { EnumValues } from 'enum-values';
import { Trimester } from '../../../models/enumerators/trimester.enum';

@Component({
  selector: 'app-trimester-dropdown',
  templateUrl: './trimester-dropdown.component.html',
  styleUrls: ['./trimester-dropdown.component.scss']
})
export class TrimesterDropdownComponent implements OnInit {
  @Input() group;
  @Input() allowCustom;
  @Output() Selected = new EventEmitter<number>();
  public trimesterDataSource: any;

  constructor(public translate: TranslateService) {
  }

  /**
   * Ng Init
   */
  ngOnInit() {
    this.initDataSource();
  }

  /**
   * Init dropdown component with Trimester Enum values
   */
  initDataSource(): void {
    this.trimesterDataSource = EnumValues.getNamesAndValues(Trimester);
  }

  /**
   * Value change of dropdown component
   * @param $event
   */
  public valueChange($event): void {
    this.Selected.emit($event);
  }

}
