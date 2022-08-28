import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { State } from '@progress/kendo-data-query';
import { Filter, Operation, PredicateFormat } from '../../../shared/utils/predicate';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { ValidationService, unique } from '../../../shared/services/validation/validation.service';
import { Country } from '../../../models/administration/country.model';
import { CountryService } from '../../services/country/country.service';
import { DataStateChangeEvent, PagerSettings } from '@progress/kendo-angular-grid';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';

@Component({
  selector: 'app-list-country',
  templateUrl: './list-country.component.html',
  styleUrls: ['./list-country.component.scss']
})
export class ListCountryComponent implements OnInit {
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public predicate: PredicateFormat;
  public formGroup: FormGroup;
  private editedRowIndex: number;
  public country: string;
  public gridState: State = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.TWENTY,
    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: []
    }
  };

  public columnsConfig: ColumnSettings[] = [
    {
      field: 'Id',
      title: 'Id',
      filterable: true
    },
    {
      field: 'Code',
      title: 'CODE',
      filterable: true
    },
    {
      field: 'Alpha2',
      title: 'ALPHA_2',
      filterable: true
    },
    {
      field: 'Alpha3',
      title: 'ALPHA_3',
      filterable: true
    },
    {
      field: 'NameFr',
      title: 'DESIGNATION_FR',
      filterable: true
    }
    ,
    {
      field: 'NameEn',
      title: 'DESIGNATION_EN',
      filterable: true
    }
  ];
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };

  constructor(public countryService: CountryService, private swalWarrings: SwalWarring, private validationService: ValidationService) { }

  ngOnInit() {
    this.initGridDataSource();
  }
  initGridDataSource() {
    this.countryService.reloadServerSideData(this.gridSettings.state, this.predicate)
      .subscribe(data => {
        this.gridSettings.gridData = data;
      }
    );
  }
  
  

  /**
  * Data changed listener
  * @param state
  */
 public dataStateChange(state: DataStateChangeEvent): void {
  this.gridSettings.state = state;
  this.countryService.reloadServerSideData(state, this.predicate).subscribe(data => this.gridSettings.gridData = data);
  }

  public filter() {
    this.predicate = new PredicateFormat();
    this.predicate.Filter = new Array<Filter>();
    this.predicate.Filter.push(new Filter(SharedConstant.CODE, Operation.contains, this.country, false, true));
    this.predicate.Filter.push(new Filter(SharedConstant.NAME_FR, Operation.contains, this.country, false, true));
    this.predicate.Filter.push(new Filter(SharedConstant.NAME_EN, Operation.contains, this.country, false, true));
    this.predicate.Filter.push(new Filter(SharedConstant.ALPHA_2, Operation.contains, this.country, false, true));
    this.predicate.Filter.push(new Filter(SharedConstant.ALPHA_3, Operation.contains, this.country, false, true));   
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.initGridDataSource();
  }
  
}
