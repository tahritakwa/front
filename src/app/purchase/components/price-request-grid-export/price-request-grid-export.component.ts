import { Component, Input, OnInit } from '@angular/core';
import { Resource } from '../../../models/shared/ressource.model';
import { Observable } from 'rxjs/Observable';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { ResourceService } from '../../../shared/services/resource/resource.service';
import { PredicateFormat } from '../../../shared/utils/predicate';
const MAX_INT = 2147483647;
@Component({
  selector: 'app-price-request-grid-export',
  templateUrl: './price-request-grid-export.component.html',
  styleUrls: ['./price-request-grid-export.component.scss']
})
export class PriceRequestGridExportComponent implements OnInit {

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

  constructor() { }

  ngOnInit() {}

  public allData = (): Observable<any> => {
    const state = {
      take: MAX_INT,
      skip: 0,
      filter: this.gridSettings.state.filter,
      group: this.gridSettings.state.group,
      sort: this.gridSettings.state.sort,
      aggregates: this.gridSettings.state.aggregates
    };
    return this.service.reloadServerSideData(state, this.predicate);
  }
  get dateTime(): Date {
    return new Date();
  }


}
