import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {DropdownService} from '../../../crm/services/dropdowns/dropdown.service';
import {ComboBoxComponent, MultiSelectComponent} from '@progress/kendo-angular-dropdowns';

@Component({
  selector: 'app-crm-dropdown',
  templateUrl: './crm-dropdown.component.html',
  styleUrls: ['./crm-dropdown.component.scss']
})
export class CrmDropdownComponent implements OnInit {
  @Input() filtreType: String;
  @Input() source: String;
  @Output() selected = new EventEmitter<any>();
  @Input() group;
  public listFiltred = [];
  public activitySectorFromFilter =  'ALL_ACTIVITY_SECTOR';
  @ViewChild(ComboBoxComponent) public comboboxComponent: ComboBoxComponent;
  constructor(private dropdownService: DropdownService) {
  }

  ngOnInit() {
    this.getFiltres();
  }

  getFiltres() {
    if (this.filtreType && this.source) {
      this.dropdownService.getAllFiltreByName(this.filtreType, this.source)
        .subscribe(data => {
          if (data) {
            data.forEach((filtreName) => {
                this.listFiltred.push(filtreName.name);
              }
            );
          }
        });
    }
  }

  public onSelect(event): void {
    this.selected.emit(event);
  }
}
