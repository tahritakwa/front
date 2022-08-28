import {Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewContainerRef} from '@angular/core';
import {State} from '@progress/kendo-data-query';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {ColumnSettings} from '../../../shared/utils/column-settings.interface';
import {RecruitmentConstant} from '../../../constant/rh/recruitment.constant';
import {GridSettings} from '../../../shared/utils/grid-settings.interface';
import {InterviewService} from '../../services/interview/interview.service';
import {Filter, Operation, OrderBy, OrderByDirection, PredicateFormat, Relation} from '../../../shared/utils/predicate';
import {RecruitmentState} from '../../../models/enumerators/recruitment-state.enum';
import {CandidacyService} from '../../services/candidacy/candidacy.service';
import {GridComponent, PagerSettings} from '@progress/kendo-angular-grid';
import {EvaluationDecisionEnumerator} from '../../../models/enumerators/evaluation-decision.enum';
import {FormModalDialogService} from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import {TranslateService} from '@ngx-translate/core';
import {OfferConstant} from '../../../constant/rh/offer.constant';
import {NewEmailComponent} from '../new-email/new-email.component';
import {InterviewConstant} from '../../../constant/rh/interview.constant';
import {Candidacy} from '../../../models/rh/candidacy.model';
import {EmailHistoryComponent} from '../email-history/email-history.component';

@Component({
  selector: 'app-selection',
  templateUrl: './selection.component.html',
  styleUrls: ['./selection.component.scss']
})
export class SelectionComponent implements OnInit {

  @Input() recruitmentId: number;
  @ViewChild(GridComponent) grid: GridComponent;
  @Output() actionSelected = new EventEmitter<boolean>();
  recruitmentState = RecruitmentState;
  evaluationDecisionEnumerator = EvaluationDecisionEnumerator;
  langList: Array<string> = ['fr', 'en'];
  // gridSettings
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public gridState: State = {
    skip: NumberConstant.ZERO as number,
    take: NumberConstant.TEN as number,
    filter: {
      logic: SharedConstant.LOGIC_AND,
      filters: []
    }
  };
  public columnsConfig: ColumnSettings[] = [
    {
      field: RecruitmentConstant.CANDIDATE_NAVIGATION_FIRST_NAME,
      title: RecruitmentConstant.CANDIDATE_UPPERCASE,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: RecruitmentConstant.CANDIDATE_NAVIGATION_EMAIL,
      title: RecruitmentConstant.EMAIL,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: RecruitmentConstant.TOTAL_AVERAGE_MARK,
      title: RecruitmentConstant.TOTAL_AVERAGE_MARK_TITLE,
      filterable: true,
      filter: 'numeric',
      _width: NumberConstant.TWO_HUNDRED
    }
  ];
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };

  // end gridSettings
  constructor(private candidacyService: CandidacyService, private interviewService: InterviewService,
              private formModalDialogService: FormModalDialogService, private translateService: TranslateService,
              private viewRef: ViewContainerRef,
              private viewContainerRef: ViewContainerRef) {
  }

  ngOnInit() {
    this.initGridDataSource();
  }

  public initGridDataSource(): void {
    this.candidacyService.getCandidacyListInSelectionStep(this.gridSettings.state, this.preparePredicate()).subscribe((data) => {
      this.gridSettings.gridData = data;
    });
  }

  public getInterviewEmailHistoric(candidacy: Candidacy) {
    const data = [];
    data.push(candidacy);
    this.formModalDialogService.openDialog(InterviewConstant.MAIL_HISTORY,
      EmailHistoryComponent, this.viewRef, this.onCloseEmailHistoryModal.bind(this),
      data, true, SharedConstant.MODAL_DIALOG_SIZE_M);
  }

  dataStateChange(state: State) {
    this.closeExpandedRows(this.gridSettings);
    this.gridSettings.state = state;
    this.initGridDataSource();
  }

  loadInterviewDetailsOfSelectedCandidacy(event: any) {
    this.interviewService.getCandidacyInterviewDetails(event.dataItem.Id).subscribe((data) => {
      event.dataItem.Interview = [];
      data.forEach((interview) => {
        event.dataItem.Interview.push(interview);
      });
    });
  }

  selectionneCandidacy(dataItem) {
    this.candidacyService.selectionnedOneCandidacy(dataItem).subscribe((data) => {
      this.closeExpandedRows(this.gridSettings);
      this.actionSelected.emit();
    });
  }

  unSelectionneCandidacy(dataItem) {
    this.candidacyService.unSelectionnedOneCandidacy(dataItem).subscribe((data) => {
      this.closeExpandedRows(this.gridSettings);
      this.actionSelected.emit();
    });
  }

  getLineThroughStyle(lineState) {
    if (lineState > this.recruitmentState.Selection) {
      return {
        'text-decoration': ''
      };
    } else {
      return {
        'text-decoration': 'line-through'
      };
    }
  }

  generateAndSendTheRejectedMail(dataItem, lang?: string) {
    this.candidacyService.generateRejectedmail(dataItem, lang).subscribe((result) => {
      result.CandidacyState = dataItem.State;
      this.formModalDialogService.openDialog(this.translateService.instant(OfferConstant.SEND_REJECTION_MAIL),
        NewEmailComponent, this.viewContainerRef, null, result, true, SharedConstant.MODAL_DIALOG_SIZE_M);
    });
  }

  private onCloseEmailHistoryModal(data: any): void {
    this.actionSelected.emit();
  }

  private preparePredicate() {
    let predicate = new PredicateFormat();
    predicate.Filter = new Array<Filter>();
    predicate.Filter.push(new Filter(RecruitmentConstant.CANDIDACY_ID_RECRUITMENT, Operation.eq, this.recruitmentId));
    predicate.Filter.push(new Filter(RecruitmentConstant.STATE, Operation.gte, this.recruitmentState.Selection));
    predicate.Relation = new Array<Relation>();
    predicate.Relation.push.apply(predicate.Relation, [new Relation(RecruitmentConstant.ID_CANDIDATE_NAVIGATION)]);
    predicate.Relation.push.apply(predicate.Relation, [new Relation(RecruitmentConstant.CANDIDACY_INTERVIEW)]);
    predicate.Relation.push.apply(predicate.Relation, [new Relation(RecruitmentConstant.ID_RECRUITMENT_NAVIGATION)]);
    predicate.OrderBy = new Array<OrderBy>();
    predicate.OrderBy.push(new OrderBy(RecruitmentConstant.CANDIDATE_NAVIGATION_FIRST_NAME, OrderByDirection.asc));
    return predicate;
  }

  /***
   * Close expanded rows
   */
  private closeExpandedRows(gridSettings: GridSettings) {
    if (gridSettings.state) {
      gridSettings.gridData.data.forEach((item, idx) => {
        this.grid.collapseRow(gridSettings.state.skip + idx);
      });
    }
  }
}
