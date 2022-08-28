import {
  Component, OnInit, Input, Output, EventEmitter, OnDestroy,
  ChangeDetectionStrategy, HostListener, ViewChild
} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {FinancialCommitmentService} from '../../services/financial-commitment/financial-commitment.service';
import {GridSettings} from '../../../shared/utils/grid-settings.interface';
import {DataSourceRequestState, State, process, DataResult} from '@progress/kendo-data-query';
import {ColumnSettings} from '../../../shared/utils/column-settings.interface';
import {FinancialCommitmentConstant} from '../../../constant/sales/financial-commitment.constant';
import {GridComponent, GridDataResult} from '@progress/kendo-angular-grid';
import {FinancialCommitment} from '../../../models/sales/financial-commitment.model';
import {FormGroup} from '@angular/forms';
import {documentStatusCode, DocumentEnumerator} from '../../../models/enumerators/document.enum';
import {IntlService} from '@progress/kendo-angular-intl';
import {KeyboardConst} from '../../../constant/keyboard/keyboard.constant';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {BehaviorSubjectService} from '../../../accounting/services/reporting/behavior-subject.service';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { TranslateService } from '@ngx-translate/core';

// constants
const LOGIC_AND = 'and';
const FORMAT_NUMBER = 'n3';

@Component({
  selector: 'app-financial-commitment',
  templateUrl: './financial-commitment.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./financial-commitment.component.scss']
})
export class FinancialCommitmentComponent implements OnInit, OnDestroy {
  @Input() idDocument: number;
  @Input() formatOptions;
  @Input() documentType: string;
  @Input() showWithholdingTax;

  /** document Enumerator */
  documentEnumerator: DocumentEnumerator = new DocumentEnumerator();
  @Output() settlementAmountValueChange = new EventEmitter();
  @ViewChild(GridComponent) public grid: GridComponent;
  formGroup: FormGroup;
  object: any;
  public statusCode = documentStatusCode;

  /**
   * Grid state
   */
  public gridState: DataSourceRequestState = {
    skip: 0,
    take: 5,

    filter: { // Initial filter descriptor
      logic: LOGIC_AND,
      filters: []
    }
  };

  /**
   * Grid columns
   */
  public columnsConfig: ColumnSettings[] = [
    {
      field: FinancialCommitmentConstant.CODE,
      title: FinancialCommitmentConstant.CODE,
      filterable: true,
      _width: 280
    },
    {
      field: FinancialCommitmentConstant.commitmentDate,
      title: FinancialCommitmentConstant.commitmentDateLabel,
      filterable: false,
      format: this.translate.instant(SharedConstant.DATE_FORMAT),
      _width: 280
    },
    {
      field: FinancialCommitmentConstant.idStatus,
      title: FinancialCommitmentConstant.idStatusLabel,
      filterable: false,
      _width: 100
    },
    {
      field: FinancialCommitmentConstant.amountWithCurrency,
      title: FinancialCommitmentConstant.AMOUNTTTC,
      filterable: true,
      format: FORMAT_NUMBER,
      filter: 'numeric',
      _width: 220
    },
    {
      field: FinancialCommitmentConstant.TTC_HOLDING_TAX,
      title: FinancialCommitmentConstant.TTC_WITH_HOLDING_TITLE,
      filterable: true,
      format: FORMAT_NUMBER,
      filter: 'numeric',
      _width: 220
    },
    {
      field: FinancialCommitmentConstant.VAT_HOLDING_TAX,
      title: FinancialCommitmentConstant.VAT_WITH_HOLDING_TITLE,
      filterable: true,
      format: FORMAT_NUMBER,
      filter: 'numeric',
      _width: 220
    },
    {
      field: FinancialCommitmentConstant.AmountWithoutWithholdingTaxWithCurrency,
      title: FinancialCommitmentConstant.AMOUNT_TO_BE_PAID,
      filterable: true,
      format: FORMAT_NUMBER,
      filter: 'numeric',
      _width: 220
    },
    {
      field: FinancialCommitmentConstant.remainingAmountWithCurrency,
      title: FinancialCommitmentConstant.REMAINING_AMOUNT_TO_BE_PAID,
      filterable: true,
      format: FORMAT_NUMBER,
      filter: 'numeric',
      _width: 220
    }
  ];

  /**
   * Grid Settings
   */
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig
  };

  private financialCommitmentSubscription: Subscription;
  // input of the grid : observable type
  public view: BehaviorSubject<GridDataResult>;
  public dataOfGridFinancialCommitment: FinancialCommitment[] = [];

  constructor(private behaviorSubjectForGridDataResultService: BehaviorSubjectService,
              private financialCommitmentService: FinancialCommitmentService,
              public intl: IntlService, private translate: TranslateService) {
  }

  @HostListener('keyup', ['$event'])
  keyEvent(event) {
    if (event.key === KeyboardConst.ENTER && this.formGroup && this.object) {
      this.grid.closeCell();
    }
  }

  ngOnInit() {
    this.view = this.behaviorSubjectForGridDataResultService;
    if (this.idDocument) {
      this.gridSettings.gridData = new Object() as DataResult;
      this.initGridDataSource();
    }
  }

  /**
   * Init data source of grid
   */
  public initGridDataSource() {
    this.financialCommitmentSubscription =
      this.financialCommitmentService.getFinancialCommitmentOfCurrentDocument(this.idDocument)
        .subscribe(data => {
            this.gridSettings.gridData.data = data.listData.slice(this.gridState.skip, this.gridState.take);
            this.gridSettings.gridData.total = data.total;
            this.dataOfGridFinancialCommitment = data.listData;
            this.view.next(this.gridSettings.gridData);
          }
        );
  }

  /**
   *  this method is called when the page number change or when the filter change
   */
  public dataStateChange(state: State): void {
    this.gridSettings.state = state;
    const listFinancialCommitments = Object.assign([], this.dataOfGridFinancialCommitment);
    this.gridSettings.gridData = process(listFinancialCommitments, state);
    this.view.next(this.gridSettings.gridData);
  }

  /**
   * on destroy
   * */
  ngOnDestroy(): void {
    if (this.financialCommitmentSubscription) {
      this.financialCommitmentSubscription.unsubscribe();
    }
  }
}
