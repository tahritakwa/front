import { AfterViewInit, Component, NgZone, OnDestroy, OnInit, Renderer2, ViewContainerRef } from '@angular/core';
import { DataSourceRequestState, process, State } from '@progress/kendo-data-query';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GammeConstant } from '../../../constant/manufuctoring/gamme.constant';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { OperationModel } from '../../../models/manufacturing/operation.model';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { ActivatedRoute, Router } from '@angular/router';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { TranslateService } from '@ngx-translate/core';
import { OperationService } from '../../service/operation.service';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { FormModalDialogService } from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { filter, take, tap } from 'rxjs/operators';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { DataStateChangeEvent, PageChangeEvent, PagerSettings, RowClassArgs } from '@progress/kendo-angular-grid';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { OperationConstant } from '../../../constant/manufuctoring/operation.constant';


const tableRow = node => node.tagName.toLowerCase() === 'tr';

const closest = (node, predicate) => {
  while (node && !predicate(node)) {
    node = node.parentNode;
  }
  return node;
};

@Component({
  selector: 'app-operation-list',
  templateUrl: './operation-list.component.html',
  styleUrls: ['./operation-list.component.scss']
})


export class OperationListComponent implements OnInit, AfterViewInit, OnDestroy {
  private subscription$: Subscription;
  /**
    * size of pagination => 10 items per page
    */
   private size = NumberConstant.TEN;
   private currentPage = NumberConstant.ZERO;
  public columnsConfig: ColumnSettings[] = [
    {
      field: GammeConstant.CODE_FIELD,
      title: GammeConstant.CODE_TITLE,
      filterable: true,
    },
    {
      field: GammeConstant.OPERATION_DESCRIPTION_FIELD,
      title: GammeConstant.OPERATION_DESCRIPTION_TITLE,
      filterable: true
    }
  ];
  public gridState: DataSourceRequestState = {
    skip: NumberConstant.ZERO,
    take: this.size,
    filter: {
      logic: 'and',
      filters: []
    }
  };
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig
  };

  private dragAndDropSubscription$: Subscription;
  private editedRowIndex: number;
  public operationFormGroup: FormGroup;
  private idGammeOnUpdate: number;
  public formGroup: FormGroup;
  public rowOperationsList: Array<any> = [];
  public btnEditVisible: boolean;
  public sectionDto: any;
  public listItems: Array<OperationModel> = [];
  private selectedOperationBeforeDtos: Array<OperationModel> = [];
  public value: any = [];
  public sectionDescription = GammeConstant.OPERATION_SECTION_DESCRIPTION_FIELD;
  public operationBeforeDtos = GammeConstant.OPERATIONS_BEFORE_LIST_FIELD;
  public duration = GammeConstant.OPERATION_DURATION_FIELD;
  public description = GammeConstant.OPERATION_DESCRIPTION_FIELD;



  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  selectedOperationList: any = [];

  public gridData: any = process(this.rowOperationsList, this.gridState);


  constructor(
    private router: Router,
    private swalWarrings: SwalWarring,
    private translate: TranslateService,
    private operationService: OperationService,
    private growlService: GrowlService,
    private renderer: Renderer2,
    private viewRef: ViewContainerRef,
    private formModalDialogService: FormModalDialogService,
    private zone: NgZone) {

  }

  ngOnInit() {
    this.initGridData();
  }

  ngOnDestroy(): void {
    if (this.dragAndDropSubscription$) {
      this.dragAndDropSubscription$.unsubscribe();
    }
  }

  initGridData() {
    this.subscription$ = this.operationService.getJavaGenericService().getEntityList(
      OperationConstant.LIST_PAGEABLE +
      `?searchValue=${this.value}&page=${this.currentPage}&size=${this.size}`
    )
      .subscribe(data => {
        this.gridSettings.gridData = { data: data.content, total: data.totalElements };
      });
  }

  public async addHandler({ sender }) {
    this.selectedOperationBeforeDtos = [];
    this.closeEditor(sender);
    this.listItems = await this.fillOperationsDropDownList();
    this.createOperationLineForm(new OperationModel());
    sender.addRow(this.operationFormGroup);
    this.btnEditVisible = false;
  }
  /**
   * load data when the page change with pagination
   * @param event
   */
   onPageChange(event: PageChangeEvent) {
    this.currentPage = (event.skip)  / event.take;
    this.size = event.take;
    this.goPage();
    this.initGridData();
  }

  /**
   * load data into active page
   */
  goPage() {
    this.subscription$ = this.operationService.getJavaGenericService().getEntityList(OperationConstant.LIST_PAGEABLE +
      `?page=${this.currentPage}&size=${this.size}`)
      .subscribe(data => {
        this.gridSettings.gridData.data = data.content;
      });
  }

  async fillOperationsDropDownList(dataItem?: any): Promise<any> {
    this.listItems = [];
    if (dataItem === undefined) {
      await this.operationService.getJavaGenericService()
        .getEntityList().subscribe(result => {
          this.listItems = result;
          return new Promise(function (resolve) {
            resolve(result);
          });
        });
    } else {
      await this.operationService.getJavaGenericService()
        .getEntityById(dataItem.id, GammeConstant.ALLOWDED_OPERATION)
        .subscribe(result => {
          this.listItems = result;
          return new Promise(function (resolve) {
            resolve(result);
          });
        });
    }
  }

  private createOperationLineForm(operationModel?: OperationModel): void {
    this.operationFormGroup = new FormGroup({
      description: new FormControl(operationModel.description, Validators.required),
      duration: new FormControl(operationModel.duration, Validators.required),
      operationBeforeDtos: new FormControl(operationModel.operationBeforeDtos),
    });
  }

  private closeEditor(grid: { closeRow: (arg0: number) => void; }, rowIndex = this.editedRowIndex) {
    if (rowIndex !== undefined) {
      this.selectedOperationBeforeDtos = [];
      grid.closeRow(rowIndex);
      this.editedRowIndex = undefined;
      this.operationFormGroup = undefined;
    }
  }

  public async editHandler({ sender, rowIndex, dataItem }) {
    this.selectedOperationBeforeDtos = [];
    this.listItems = await this.fillOperationsDropDownList(dataItem);
    this.operationService.getJavaGenericService().getEntityById(dataItem.id)
      .subscribe(operation => {
        this.closeEditor(sender);
        this.closeEditor(sender, -1);
        this.editedRowIndex = rowIndex;
        dataItem.duration = `${dataItem.duration
          .substring(NumberConstant.ZERO, NumberConstant.TWO)}${dataItem.duration.substring(NumberConstant.FOUR, NumberConstant.SIX)}`;
        this.createOperationForm(dataItem, operation);
        this.selectedOperationList = operation.operationBeforeDtos;
        sender.editRow(rowIndex, this.operationFormGroup);
        this.btnEditVisible = true;
      });
  }

  public goToAdvancedEdit(dataItem) {
    this.router.navigateByUrl(OperationConstant.OPERATION_URL_EDIT.concat(dataItem.id), { queryParams: filter, skipLocationChange: true });
  }

  private substringDuration(duration) {
    return `${duration.substring(NumberConstant.ZERO,
      NumberConstant.TWO)}h:${duration.substring(NumberConstant.TWO,
        NumberConstant.FOUR)}m`;
  }

  /**
   * when the page change , the active page change
   * @param state
   */
  dataStateChange(state: DataStateChangeEvent) {
    this.gridSettings.state = state;
  }

  public ngAfterViewInit(): void {

    this.dragAndDropSubscription$ = this.handleDragAndDrop();
  }

  /**
   * drag & drop rows in GridData
   */
  private handleDragAndDrop(): Subscription {
    const sub = new Subscription(() => {
    });
    let draggedItemIndex;

    const tableRows = Array.from(document.querySelectorAll('.k-grid tr'));
    tableRows.forEach(item => {
      this.renderer.setAttribute(item, 'draggable', 'true');
      const dragStart = fromEvent<DragEvent>(item, 'dragstart');
      const dragOver = fromEvent(item, 'dragover');
      const dragEnd = fromEvent(item, 'dragend');

      sub.add(dragStart.pipe(
        tap(({ dataTransfer }) => {
          try {
            const dragImgEl = document.createElement('span');
            dragImgEl.setAttribute('style', 'position: absolute; display: block; top: 0; left: 0; width: 0; height: 0;');
            document.body.appendChild(dragImgEl);
            dataTransfer.setDragImage(dragImgEl, 0, 0);
          } catch (err) {
          }
          try {
            dataTransfer.setData('application/json', '{}');
          } catch (err) {
          }
        })
      ).subscribe(({ target }) => {
        const row: HTMLTableRowElement = target as HTMLTableRowElement;
        draggedItemIndex = row.rowIndex;
        const dataItem = this.gridData.data[draggedItemIndex];
        dataItem.dragging = true;
      }));

      sub.add(dragOver.subscribe((e: any) => {
        e.preventDefault();
        const dataItem = this.gridData.data.splice(draggedItemIndex, 1)[0];
        const dropIndex = closest(e.target, tableRow).rowIndex;

        draggedItemIndex = dropIndex;
        this.zone.run(() =>
          this.gridData.data.splice(dropIndex, 0, dataItem)
        );
      }));

      sub.add(dragEnd.subscribe((e: any) => {
        e.preventDefault();
        const dataItem = this.gridData.data[draggedItemIndex];
        dataItem.dragging = false;
        this.gridData.data.forEach((element, index: number) => {
          if (this.idGammeOnUpdate > 0) {
            element.duration = this.convertDurationToSeconds(element.duration, NumberConstant.ZERO, NumberConstant.FOUR);
            this.operationService.getJavaGenericService()
              .updateEntity(element, element.id, GammeConstant.SAVE_OPERATION_URL)
              .subscribe((data) => {
                element.duration = this.convertDurationToTime(data.duration);
              });
          }

        });
        this.rowOperationsList = this.gridData.data;
      }));
    });

    return sub;
  }

  createOperationForm(dataItem, operation) {
    this.operationFormGroup = new FormGroup({
      description: new FormControl(dataItem.description, Validators.required),
      duration: new FormControl(dataItem.duration, Validators.required),
      operationBeforeDtos: new FormControl(operation.operationBeforeDtos),
    });
  }






  public removeOperationHandler(event: any) {
    this.swalWarrings.CreateSwal().then((result) => {
      if (result.value) {
        this.operationService.getJavaGenericService()
          .deleteEntity(event.dataItem.id, GammeConstant.DELETE_OPERATION_URL)
          .subscribe(() => {
            const index: number = this.rowOperationsList.indexOf(event.dataItem);
            if (index !== -1) {
              this.rowOperationsList.splice(index, 1);
            }
            this.initGridData()
            this.growlService.successNotification(this.translate.instant(GammeConstant.SUCCESS_OPERATION));
          }, () => {
            this.growlService.ErrorNotification(this.translate.instant(GammeConstant.FAILURE_OPERATION));
          });
      }
    });
  }

  public rowCallback(context: RowClassArgs) {
    return {
      dragging: context.dataItem.dragging
    };
  }

  onSelectOperation($event: any[]) {
    this.selectedOperationBeforeDtos = $event;
  }


  private convertDurationToSeconds(duration: string, indexHours: number, indexMinutes: number) {
    return +duration.substring(indexHours, indexHours + NumberConstant.TWO) * NumberConstant.ONE_HOUR_SECONDS +
      +duration.substring(indexMinutes, indexMinutes + NumberConstant.TWO) * NumberConstant.SIXTY;
  }

  /**
   * Convert java.time.Duration to hours & minutes
   */
  private convertDurationToTime(duration: string) {
    let valueSeconds = '';
    duration = duration.substring(NumberConstant.TWO, duration.length);
    valueSeconds += `${this.getHoursAndMinutesFromDuration(duration, 0, duration.indexOf('H'))}h:`;
    valueSeconds += `${this.getHoursAndMinutesFromDuration(duration, duration.indexOf('H') + 1, duration.indexOf('M'))}m`;
    return valueSeconds;
  }

  private getHoursAndMinutesFromDuration(duration: string, begin: number, end: number) {
    let valueSeconds = '';
    if (end === -1) {
      valueSeconds += GammeConstant.DOUBLE_ZERO;
    } else {
      if (duration.substring(begin, end).length === NumberConstant.TWO) {
        valueSeconds += duration.substring(begin, end);
      } else {
        valueSeconds += `${NumberConstant.ZERO}${duration.substring(begin, end)}`;
      }
    }
    return valueSeconds;
  }

  onSearch() {
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.currentPage = NumberConstant.ZERO;
    this.initGridData();
  }
}
