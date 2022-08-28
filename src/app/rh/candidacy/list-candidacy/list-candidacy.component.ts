import {Component, EventEmitter, Input, OnInit, Output, ViewContainerRef} from '@angular/core';
import {PagerSettings} from '@progress/kendo-angular-grid';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {Filter, Operation, OrderBy, OrderByDirection, PredicateFormat, Relation} from '../../../shared/utils/predicate';
import {Candidacy} from '../../../models/rh/candidacy.model';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {SortDescriptor, State} from '@progress/kendo-data-query';
import {ColumnSettings} from '../../../shared/utils/column-settings.interface';
import {CandidacyConstant} from '../../../constant/rh/candidacy.constant';
import {GridSettings} from '../../../shared/utils/grid-settings.interface';
import {CandidacyService} from '../../services/candidacy/candidacy.service';
import {SwalWarring} from '../../../shared/components/swal/swal-popup';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ValidationService} from '../../../shared/services/validation/validation.service';
import {CandidateConstant} from '../../../constant/rh/candidate.constant';
import {RecruitmentState} from '../../../models/enumerators/recruitment-state.enum';
import {RecruitmentService} from '../../services/recruitment/recruitment.service';
import {AddCandidateComponent} from '../../candidate/add-candidate/add-candidate.component';
import {FormModalDialogService} from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import {PermissionConstant} from '../../../Structure/permission-constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';

@Component({
  selector: 'app-list-candidacy',
  templateUrl: './list-candidacy.component.html',
  styleUrls: ['./list-candidacy.component.scss']
})
export class ListCandidacyComponent implements OnInit {

  @Output() actionSelected = new EventEmitter<boolean>();
  @Input() recruitmentId: number;

  public hasFullRecuitmentPermission: boolean;
  public hasAddOrUpdateRecruitmentPermission: boolean;
  recruitmentState: number;
  /**
   * pager settings
   */
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  /**
   * Predicate
   */
  public predicate: PredicateFormat = new PredicateFormat();
  /**
   * if it is in update Mode
   */
  public isUpdateMode: boolean;
  /**
   * candidacy formGroup
   */
  public formGroup: FormGroup;
  added = false;
  public gridState: State = {
    skip: NumberConstant.ZERO as number,
    take: NumberConstant.TEN as number,
    // Initial filter descriptor
    filter: {
      logic: SharedConstant.LOGIC_AND,
      filters: []
    }
  };
  public columnsConfig: ColumnSettings[] = [
    {
      field: CandidacyConstant.ID_CANDIDATE_NAVIGATION_FIRST_NAME,
      title: CandidacyConstant.CANDIDATE,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: CandidacyConstant.DEPOSIT_DATE,
      title: CandidacyConstant.DEPOSITDATE_TITLE,
      filterable: true,
      filter: 'date',
      _width: NumberConstant.TWO_HUNDRED

    },
    {
      field: CandidacyConstant.EMAIL,
      title: CandidacyConstant.EMAIL_TITLE,
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    }
  ];
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };
  public sort: SortDescriptor[] = [{
    field: CandidateConstant.LAST_NAME,
    dir: 'asc'
  }];
  /**
   * edited Row Index
   */
  private editedRowIndex: number;
  /**
   * edited Row Object
   */
  private editedRow: Candidacy;

  constructor(public candidacyService: CandidacyService, public authService: AuthService,
              private swalWarrings: SwalWarring, private validationService: ValidationService,
              private recruitmentService: RecruitmentService, private formModalDialogService: FormModalDialogService,
              private viewRef: ViewContainerRef) {
    this.hasFullRecuitmentPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.FULL_RECRUITMENT);
    this.hasAddOrUpdateRecruitmentPermission = this.authService.hasAuthorities([PermissionConstant.RHAndPaiePermissions.ADD_RECRUITMENT,
      PermissionConstant.RHAndPaiePermissions.UPDATE_RECRUITMENT]);
  }

  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.initGridDataSource();
  }

  ngOnInit() {
    this.initGridDataSource();
  }

  /**
   * dataStateChange
   * @param state
   */
  public dataStateChange(state: State): void {
    this.gridSettings.state = state;
    this.initGridDataSource();
  }

  /**
   * initGridDataSource
   */
  public initGridDataSource(): void {
    this.preparePredicate();
    this.candidacyService.reloadServerSideData(this.gridSettings.state, this.predicate).subscribe(data => {
        this.gridSettings.gridData = data;
        this.initRecruitmentState();
      }
    );
  }

  initRecruitmentState(): any {
    this.recruitmentService.getById(this.recruitmentId).subscribe(result => {
      this.recruitmentState = result.State;
    });
  }

  /**
   * prepare predicate
   */
  public preparePredicate(): void {
    this.predicate = new PredicateFormat();
    if (this.recruitmentId) {
      this.predicate.Filter = new Array<Filter>();
      this.predicate.Filter.push(new Filter(CandidacyConstant.ID_RECRUITMENT, Operation.eq, this.recruitmentId));
    }
    this.predicate.Relation = new Array<Relation>();
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(CandidacyConstant.ID_CANDIDATE_NAVIGATION)]);
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(CandidacyConstant.INTERVIEW)]);
    this.predicate.OrderBy = new Array<OrderBy>();
    this.predicate.OrderBy.push.apply(this.predicate.OrderBy,
      [new OrderBy(CandidacyConstant.FIRST_NAME_FILTRE, OrderByDirection.asc)]);
  }

  /**
   * Add candidacy
   * @param param0
   */
  public addHandler({sender}) {
    this.isUpdateMode = false;
    this.closeEditor(sender);
    this.formGroup = new FormGroup({
      IdCandidate: new FormControl(NumberConstant.ZERO, Validators.required),
      DepositDate: new FormControl('', Validators.required),
      Email: new FormControl({value: '', disabled: true})
    });
    sender.addRow(this.formGroup);
  }

  /**
   * Remove selected candidacy
   * @param param0
   */
  public removeHandler({dataItem}) {
    this.swalWarrings.CreateSwal(CandidacyConstant.DELETE_CANDIDACY).then((result) => {
      if (result.value) {
        this.candidacyService.remove(dataItem).subscribe(() => {
          this.actionSelected.emit();
        });
      }
    });
  }

  /**
   * receive Candidate Name
   * @param $event
   */
  receiveCandidateName($event) {
    if ($event !== undefined) {
      this.formGroup.controls['Email'].setValue($event.Email);
    }
  }

  /**
   * cancel Handler
   * @param param0
   */
  public cancelHandler({sender, rowIndex}) {
    this.receiveCandidateName(1);
    this.closeEditor(sender, rowIndex);
  }

  receiveDepositeDate($event) {
    if ($event !== undefined) {
      this.formGroup.controls['DepositDate'].setValue($event.DepositDate);
    }
  }

  /**
   * Save Candidacy
   * @param param0
   */
  public saveHandler({sender, rowIndex, formGroup, isNew}) {
    if ((formGroup as FormGroup).valid) {
      let candidacy: Candidacy;
      if (this.editedRow) {
        Object.assign(this.editedRow, formGroup.getRawValue());
        candidacy = this.editedRow;
      } else {
        candidacy = (formGroup as FormGroup).getRawValue();
      }
      candidacy.IdRecruitment = this.recruitmentId;
      candidacy.IdCandidateNavigation = null;
      this.candidacyService.save(candidacy, isNew).subscribe(() => {
        this.actionSelected.emit();
      });
      this.initGridDataSource();
      sender.closeRow(rowIndex);
    } else {
      this.validationService.validateAllFormFields(formGroup as FormGroup);
    }
  }

  isCurrentRecruitmentCompleted(): boolean {
    return this.recruitmentState === RecruitmentState.Closed;
  }

  /**
   * edit candidacy
   * @param param0
   */
  public editHandler({sender, rowIndex, dataItem}) {
    this.isUpdateMode = true;
    this.closeEditor(sender);
    this.formGroup = new FormGroup({
      Id: new FormControl(dataItem.Id),
      IdCandidate: new FormControl(dataItem.IdCandidate, Validators.required),
      DepositDate: new FormControl(new Date(dataItem.DepositDate), Validators.required),
      Email: new FormControl({value: dataItem.IdCandidateNavigation.Email, disabled: true})
    });
    this.editedRowIndex = rowIndex;
    this.editedRow = dataItem;
    sender.editRow(rowIndex, this.formGroup);
    this.receiveCandidateName(dataItem.IdCandidateNavigation);
  }

  showActions(dataItem: Candidacy): boolean {
    return !this.isCurrentRecruitmentCompleted() &&
      (!dataItem.Interview || dataItem.Interview && dataItem.Interview.length === 0);
  }

  addCandidate(event) {
    this.formModalDialogService.openDialog(CandidateConstant.ADD_CANDIDATE, AddCandidateComponent,
      this.viewRef, this.onCloseAddModalCall.bind(this), null, false, SharedConstant.MODAL_DIALOG_SIZE_L);
  }

  onCloseAddModalCall() {
    this.added = true;
  }

  /**
   * close edit row
   * @param grid
   * @param rowIndex
   */
  private closeEditor(grid, rowIndex = this.editedRowIndex) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
    this.editedRow = undefined;
    this.formGroup = undefined;
  }
}
