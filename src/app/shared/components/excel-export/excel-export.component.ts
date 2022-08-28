import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { ColumnSettings } from '../../utils/column-settings.interface';
import { ResourceService } from '../../services/resource/resource.service';
import { Resource } from '../../../models/shared/ressource.model';
import { PredicateFormat } from '../../utils/predicate';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { GridSettings } from '../../utils/grid-settings.interface';

@Component({
  selector: 'app-excel-export',
  templateUrl: './excel-export.component.html',
  styleUrls: ['./excel-export.component.scss']
})
export class ExcelExportComponent implements OnInit {
  @ViewChild('excelexport') excelexportRef: any;
  @Input()
  gridSettings: GridSettings;
  @Input()
  fileName: string;
  @Input()
  service: ResourceService<Resource>;
  @Input()
  predicate: PredicateFormat;
  @Input()
  api: string;
  data: any;
  constructor() { }

  ngOnInit() {
  }
  get dateTime(): Date {
    return new Date();
  }

  getAllDataAndSave() {

    const state = {
      take: NumberConstant.MAX_INT,
      skip: 0,
      filter: this.gridSettings.state.filter,
      group: this.gridSettings.state.group,
      sort: this.gridSettings.state.sort,
      aggregates: this.gridSettings.state.aggregates
    };
    this.service.reloadServerSideData(state, this.predicate, this.api).subscribe(data => {
      this.data = data.data;
      this.excelexportRef.data = this.data;
      this.excelexportRef.save();
    });

  }
}
