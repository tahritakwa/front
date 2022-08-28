import {Component, OnInit, OnDestroy} from '@angular/core';
import {FormGroup, FormBuilder, FormControl, Validators} from '@angular/forms';
import {PagerSettings, DataStateChangeEvent, PageChangeEvent} from '@progress/kendo-angular-grid';
import {ColumnSettings} from '../../../shared/utils/column-settings.interface';
import {DataSourceRequestState} from '@progress/kendo-data-query';
import {GridSettings} from '../../../shared/utils/grid-settings.interface';
import {TranslateService} from '@ngx-translate/core';
import {ValidationService} from '../../../shared/services/validation/validation.service';
import {SwalWarring} from '../../../shared/components/swal/swal-popup';
import {AreaService} from '../../service/area.service';
import {GrowlService} from '../../../../COM/Growl/growl.service';
import {AreaConstant} from '../../../constant/manufuctoring/area.constant';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {Subscription} from 'rxjs/Subscription';
import {SharedConstant} from '../../../constant/shared/shared.constant';

@Component({
  selector: 'app-list-area',
  templateUrl: './list-area.component.html',
  styleUrls: ['./list-area.component.scss']
})
export class ListAreaComponent implements OnInit, OnDestroy {

  private subscription$: Subscription;

  // Edited Row index
  private editedRowIndex: number;
  // Grid quick add
  public areaFormGroup: FormGroup;
  /* pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS; */
  /**
   * button Advanced Edit visibility
   */
  private btnEditVisible: boolean;
  /**
   * size of pagination => 10 items per page
   */
  private  size = NumberConstant.TWENTY;
  private currentPage = NumberConstant.ZERO;
  /**
   * default value of filter is empty ''
   */
  public value = '';
  // pager settings

  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;

  /* Grid state
  */
  public gridState: DataSourceRequestState = {
    skip: 0,
    take: this.size,
    filter: { // Initial filter descriptor
      logic: 'and',
      filters: []
    }
  };

  /**
   * Grid columns
   */
  public columnsConfig: ColumnSettings[] = [
    {
      field: AreaConstant.REFERENCE_FIELD,
      title: AreaConstant.REFERENCE_TITLE,
      filterable: true,
    },
    {
      field: AreaConstant.DESIGNATION_FIELD,
      title: AreaConstant.DESIGNATION_TITLE,
      filterable: true
    }
  ];

  // Grid settings
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig
  };

  constructor(public growlService: GrowlService, private translate: TranslateService,
              private validationService: ValidationService, private swalWarrings: SwalWarring,
              private fb: FormBuilder, public areaService: AreaService) {
    this.btnEditVisible = true;
  }

  initGridDataSource() {
    this.subscription$ = this.areaService.getJavaGenericService()
      .getEntityList(AreaConstant.LIST_PAGEABLE +
        `?designation=${this.value}&page=${this.currentPage}&size=${this.size}`)
      .subscribe((data) => {
        this.gridSettings.gridData = {data: data.content, total: data.totalElements};
      });
  }


  /**
   * when the page change , the active page change
   * @param state
   */
  dataStateChange(state: DataStateChangeEvent) {
    this.gridSettings.state = state;
  }

  /**
   * load data when the page change with pagination
   * @param event
   */
  onPageChange(event: PageChangeEvent) {
    this.currentPage = (event.skip)  / event.take;
    this.size = event.take;
    this.goPage();
  }

  /**
   * load data into active page
   */
  goPage() {
    this.subscription$ = this.areaService.getJavaGenericService().getEntityList(AreaConstant.LIST_PAGEABLE +
      `?designation=${this.value}&page=${this.currentPage}&size=${this.size}`)
      .subscribe(data => {
        this.gridSettings.gridData.data = data.content;
      });
  }

  /**
   *filter on list nomenclature page by reference
   */
  onSearch() {
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.currentPage = NumberConstant.ZERO;
    this.initGridDataSource();
  }

  /**
   * Close editor
   * @param grid
   * @param rowIndex
   */
  private closeEditor(grid, rowIndex = this.editedRowIndex) {
    if (rowIndex !== undefined) {
      grid.closeRow(rowIndex);
      this.editedRowIndex = undefined;
      this.areaFormGroup = undefined;
    }
    this.btnEditVisible = true;
  }

  /**
   * Quick add
   * @param param0
   */
  public addHandler({sender}) {
    this.closeEditor(sender);
    this.areaFormGroup = new FormGroup({
      reference: new FormControl('', Validators.required),
      designation: new FormControl('', [Validators.required, Validators.minLength(NumberConstant.FIVE)]),
    });

    sender.addRow(this.areaFormGroup);
    this.btnEditVisible = false;

  }

  /**
   * Quick edit
   * @param param0
   */
  public editHandler({sender, rowIndex, dataItem}) {
    this.closeEditor(sender);
    this.closeEditor(sender, -1);

    this.areaFormGroup = this.fb.group({
      id: [dataItem.id, Validators.required],
      reference: [dataItem.reference, Validators.required],
      designation: [dataItem.designation, [Validators.required, Validators.minLength(NumberConstant.FIVE)]],
    });

    this.editedRowIndex = rowIndex;

    sender.editRow(rowIndex, this.areaFormGroup);
    this.btnEditVisible = false;
  }

  /**
   * Cancel
   * @param param0
   */
  public cancelHandler({sender, rowIndex}) {
    this.closeEditor(sender, rowIndex);
    this.btnEditVisible = true;
  }

  /**
   * Save handler
   * @param param0
   */
  public saveHandler({sender, rowIndex, formGroup}) {
    if (formGroup.valid || this.areaFormGroup.valid) {
      this.subscription$ = this.areaService.getJavaGenericService().saveEntity(formGroup.value)
        .subscribe(() => {
          this.initGridDataSource();
          this.growlService.successNotification(this.translate.instant(AreaConstant.SUCCESS_OPERATION));
        });

      sender.closeRow(rowIndex);
      this.btnEditVisible = true;
    } else {
      this.validationService.validateAllFormFields(this.areaFormGroup || formGroup as FormGroup);
    }
  }

  /**
   * Remove handler
   * @param param0
   */
  public removeHandler(event) {
    this.swalWarrings.CreateSwal(AreaConstant.AREA_DELETE_TEXT_MESSAGE, AreaConstant.DELETE_AREA_MSG).then(
      (result) => {
        if (result.value) {
          this.areaService.getJavaGenericService().deleteEntity(event.dataItem.id)
            .subscribe(() => {
              if (this.gridSettings.gridData.data.length === NumberConstant.ONE && this.currentPage !== NumberConstant.ZERO) {
                this.gridSettings.state.skip -= NumberConstant.ONE;
                this.currentPage -= NumberConstant.ONE;
              }
              this.initGridDataSource();
              this.growlService.successNotification(this.translate.instant(AreaConstant.SUCCESS_OPERATION));
            });
        }
      });
  }

  ngOnDestroy(): void {
    if (this.subscription$) {
      this.subscription$.unsubscribe();
    }
  }

  ngOnInit() {
    this.initGridDataSource();
  }

}
