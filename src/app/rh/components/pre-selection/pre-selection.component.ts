import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {State} from '@progress/kendo-data-query';
import {ColumnSettings} from '../../../shared/utils/column-settings.interface';
import {RecruitmentConstant} from '../../../constant/rh/recruitment.constant';
import {GridSettings} from '../../../shared/utils/grid-settings.interface';
import {Filter, Operation, OrderBy, OrderByDirection, PredicateFormat, Relation} from '../../../shared/utils/predicate';
import {CandidacyService} from '../../services/candidacy/candidacy.service';
import {RecruitmentState} from '../../../models/enumerators/recruitment-state.enum';
import {PagerSettings} from '@progress/kendo-angular-grid';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {NumberConstant} from '../../../constant/utility/number.constant';

@Component({
  selector: 'app-pre-selection',
  templateUrl: './pre-selection.component.html',
  styleUrls: ['./pre-selection.component.scss']
})
export class PreSelectionComponent implements OnInit {

  @Output() actionSelected = new EventEmitter<boolean>();
  @Input() recruitmentId;
  recruitmentState = RecruitmentState;
  // gridSettings
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  gridState: State = {
    skip: NumberConstant.ZERO as number,
    take: NumberConstant.TEN as number
  };
  public columnsConfig: ColumnSettings[] = [
    {
      field: RecruitmentConstant.CANDIDATE_NAVIGATION_FIRST_NAME,
      title: RecruitmentConstant.CANDIDATE_UPPERCASE,
      filterable: true,
      _width: NumberConstant.THREE_HUNDRED
    },
    {
      field: RecruitmentConstant.CANDIDATE_NAVIGATION_EMAIL,
      title: RecruitmentConstant.EMAIL,
      filterable: true,
      _width: NumberConstant.THREE_HUNDRED
    }
  ];
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };
  private predicate: PredicateFormat;

// end gridSettings
  constructor(private candidacyService: CandidacyService) {
  }

  ngOnInit() {
    this.initGridDataSource();
  }

  public initGridDataSource(): void {
    this.preparePredicate();
    this.candidacyService.reloadServerSideData(this.gridSettings.state, this.predicate).subscribe((data) => {
      this.gridSettings.gridData = data;
    });
  }

  dataStateChange(state: State) {
    this.gridSettings.state = state;
    this.initGridDataSource();
  }

  preselectionneCandidacy(dataItem) {
    this.candidacyService.presSelectionnedOneCandidacy(dataItem).subscribe((data) => {
      this.actionSelected.emit();
    });
  }

  unPreselectionneCandidacy(dataItem) {
    this.candidacyService.unPresSelectionnedOneCandidacy(dataItem).subscribe((data) => {
      this.actionSelected.emit();
    });
  }

  getLineThroughStyle(lineState) {

    if (lineState > this.recruitmentState.PreSelection) {
      return {
        'text-decoration': ''
      };
    } else {
      return {
        'text-decoration': 'line-through'
      };
    }
  }

  private preparePredicate(): void {
    this.predicate = new PredicateFormat();
    this.predicate.Filter = new Array<Filter>();
    this.predicate.Filter.push(new Filter(RecruitmentConstant.CANDIDACY_ID_RECRUITMENT, Operation.eq, this.recruitmentId));
    this.predicate.Filter.push(new Filter(RecruitmentConstant.STATE, Operation.gte, this.recruitmentState.PreSelection));
    this.predicate.Relation = new Array<Relation>();
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(RecruitmentConstant.ID_CANDIDATE_NAVIGATION)]);
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(RecruitmentConstant.ID_RECRUITMENT_NAVIGATION)]);
    this.predicate.OrderBy = new Array<OrderBy>();
    this.predicate.OrderBy.push.apply(this.predicate.OrderBy,
      [new OrderBy(RecruitmentConstant.CANDIDATE_NAVIGATION_FIRST_NAME, OrderByDirection.asc)]);
  }
}
