import { Component, Input } from '@angular/core';
import { GridSettings } from '../../utils/grid-settings.interface';
import { ResourceService } from '../../services/resource/resource.service';
import { Resource } from '../../../models/shared/ressource.model';
import { PredicateFormat } from '../../utils/predicate';
import { Observable } from 'rxjs/Observable';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { FiltersItemDropdown } from '../../../models/shared/filters-item-dropdown.model';
import { TranslateService } from '@ngx-translate/core';
const MAX_INT = 2147483647;
@Component({
  selector: 'app-grid-export',
  templateUrl: './grid-export.component.html',
  styleUrls: ['./grid-export.component.scss']
})
export class GridExportComponent {
  @Input()
  gridSettings: GridSettings;
  @Input()
  fileName: string;
  @Input()
  pdf: boolean;
  @Input()
  excel: boolean;
  @Input()
  service: ResourceService<Resource>;
  @Input()
  predicate: PredicateFormat;
  @Input()
  api: string;
  @Input() filtersItemDropdown: FiltersItemDropdown ;
  @Input() isFromItem: Boolean ;
  public dateFormat = this.translate.instant(SharedConstant.DATE_FORMAT);
  @Input() Config: any[] ;
  constructor(private translate: TranslateService) { }
  public allData = (): Observable<any> => {
    const state = {
      take: MAX_INT,
      skip: 0,
      filter: this.gridSettings.state.filter,
      group: this.gridSettings.state.group,
      sort: this.gridSettings.state.sort,
      aggregates: this.gridSettings.state.aggregates
    };
    if (this.isFromItem) {
      this.filtersItemDropdown.isFromExportExcel = true;
      return this.service.warehouseFilterExcel(state, this.predicate,this.filtersItemDropdown);
    }else if (this.api) {
      return this.service.reloadServerSideData(state, this.predicate, this.api);
    }else {
      return this.service.reloadServerSideData(state, this.predicate);
    }
  }
  get dateTime(): Date {
    return new Date();
  }

    

}
