import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ComboBoxComponent} from '@progress/kendo-angular-dropdowns';
import {EnumValues} from 'enum-values';
import {OfStatusFilterLaunchOfEnum} from '../../../../models/enumerators/of-status-filter-launch-of.enum';
import {FabricationArrangementService} from '../../../../manufacturing/service/fabrication-arrangement.service';
import {Operation} from '../../../../../COM/Models/operations';
import {FabricationArrangementConstant} from '../../../../constant/manufuctoring/fabricationArrangement.constant';
import {ItemService} from '../../../../inventory/services/item/item.service';
import {DataSourceRequestState} from '@progress/kendo-data-query';
import {GridSettings} from '../../../utils/grid-settings.interface';
import {DropdownProductItemsComponent} from '../../../../manufacturing/dropdown-product-items/dropdown-product-items.component';

@Component({
  selector: 'app-launch-of-article-dropdown',
  templateUrl: './launch-of-article-dropdown.component.html',
})
export class LaunchOfArticleDropdownComponent implements OnInit {
  @Input() group;
  @Input() allowCustom;
  @Input() disabled: boolean;
  @Output() Selected: EventEmitter<any> = new EventEmitter();
  @ViewChild(DropdownProductItemsComponent) public ofArticleDropdownComponent: DropdownProductItemsComponent;

  ngOnInit(): void {
  }

  public onValueChanged(event): void {
    if (event) {
      this.Selected.emit(event.itemForm.value.IdItem);
    }
  }
}
