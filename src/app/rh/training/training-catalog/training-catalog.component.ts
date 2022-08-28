import { Component, OnInit, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { DataResult, DataSourceRequestState, State } from '@progress/kendo-data-query';
import { isNullOrUndefined } from 'util';
import { TrainingConstant } from '../../../constant/rh/training.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { TranslationKeysConstant } from '../../../constant/shared/translation-keys.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { AdministrativeDocumentStatusEnumerator } from '../../../models/enumerators/administrative-document-status.enum';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { FormModalDialogService } from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { Filter, Operation, OrderBy, OrderByDirection, PredicateFormat, Relation } from '../../../shared/utils/predicate';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { TrainingService } from '../../services/training/training.service';
import { TrainingAddRequestComponent } from '../training-add-request/training-add-request.component';
import { TrainingAddComponent } from '../training-add/training-add.component';
@Component({
  selector: 'app-training-catalog',
  templateUrl: './training-catalog.component.html',
  styleUrls: ['./training-catalog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TrainingCatalogComponent implements OnInit {
  public currentPage: number = NumberConstant.ONE;

  // Sate
  public state: State = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.NINE,
  };

  public gridState: DataSourceRequestState = {
    skip: (this.currentPage * NumberConstant.TEN) - NumberConstant.TEN,
    take: NumberConstant.TEN,

    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: []
    }
  };
  public gridSettings: GridSettings = {
    state: this.gridState
  };
  public readCareerPermission= false;
  public predicate: PredicateFormat;
// Data to diplay in cards
  dataResult: DataResult;
  // Data to diplay in cards
  data: any[] = [];
  // Number of cards to display in the page
  totalCards = NumberConstant.NINE;

  // Number of the total trainings
  totalTrainings = NumberConstant.ZERO;
  pictureBase = 'data:image/png;base64,';
  defaultPictureUrl = '../../../../assets/image/training-icon.png';
  public hasAddPermission: boolean;
  public hasUpdatePermission: boolean;
  public hasDeletePermission: boolean;
  public hasShowPermission: boolean;
  public hasAddTrainingRequestPermission: boolean;
  public hasAddTrainingSessionPermission: boolean;
  searchCatalogFormGroup: FormGroup;
  public typeFilter: Array<any> = [
    { id: AdministrativeDocumentStatusEnumerator.AllStatus, name: this.translateService.instant(TrainingConstant.ALL) },
    { id: true, name: this.translateService.instant(TrainingConstant.INTERNAL) },
    { id: false, name: this.translateService.instant(TrainingConstant.EXTERNAL) }
  ];
  public defaultType = this.typeFilter[NumberConstant.ZERO];
  constructor( private trainingService: TrainingService, private swalWarrings: SwalWarring,
               private viewRef: ViewContainerRef, private formModalDialogService: FormModalDialogService,
               private router: Router, public authService: AuthService, private fb: FormBuilder,private translateService: TranslateService) { }

  /**
   * Initialise the component
   */
  ngOnInit() {
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.ADD_TRAINING);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.UPDATE_TRAINING);
    this.hasDeletePermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.DELETE_TRAINING);
    this.hasShowPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.SHOW_TRAINING);
    this.hasAddTrainingRequestPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.ADD_TRAININGREQUEST);
    this.hasAddTrainingSessionPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.ADD_TRAININGSESSION);
    this.createSearchTeamForm();
    this.preparePredicate();
    this.initDataSource();
  }



  paginate(event, card?) {
    this.gridSettings.state.skip =
      card !== undefined
        ? event * NumberConstant.TEN - NumberConstant.TEN
        : this.gridSettings.state.skip;
    this.initDataSource();
  }

  onPageChange(currentpage) {
    this.currentPage = currentpage;
    this.onPageChangeFiltredBankAccount();
  }

  dataStateChange(state: DataStateChangeEvent) {
    this.gridSettings.state = state;
  }

  private onPageChangeFiltredBankAccount() {
    this.paginate(this.currentPage);
  }

  /**
   * prepare predicate
   */
  preparePredicate() {
    this.predicate = new PredicateFormat();
    this.predicate.OrderBy = new Array<OrderBy>();
    this.predicate.Filter = new Array<Filter>();
    this.predicate.OrderBy.push.apply(this.predicate.OrderBy, [new OrderBy(TrainingConstant.ID, OrderByDirection.desc)]);
    // filters section
    if (this.searchCatalogFormGroup.controls[TrainingConstant.NAME].value) {
      this.predicate.Filter.push(new Filter(TrainingConstant.NAME, Operation.contains, this.searchCatalogFormGroup.controls[TrainingConstant.NAME].value));
    }
    if (this.searchCatalogFormGroup.controls[TrainingConstant.TYPE].value.id !== AdministrativeDocumentStatusEnumerator.AllStatus) {
      this.predicate.Filter.push(new Filter(TrainingConstant.IS_INTERNAL, Operation.eq,
        this.searchCatalogFormGroup.controls[TrainingConstant.TYPE].value.id));
    }
  }

  /**
   * Return the Picture Src to dispaly it in vue
   * @param training
   */
  getPictureSrc(training): string {
    return this.pictureBase.concat(training.TrainingPictureFileInfo.Data);
  }

  /**
   * data source initiation, and filter
   */
  public initDataSource(predicate?: PredicateFormat) {
    if (!isNullOrUndefined(predicate)) {
      this.predicate = predicate;
    }
    this.predicate.Relation = new Array<Relation>();
    this.predicate.Relation.push(new Relation(TrainingConstant.TRAINING_EXPECTED_SKILLS));
    this.trainingService.reloadServerSideData(this.gridSettings.state, this.predicate)
      .subscribe((res) => {
        this.dataResult = res;
        this.data = res.data;
        this.gridSettings.gridData = res;
        this.totalTrainings = res.total;
      });
  }
  /**
   * Delete training
   */
  deleteTraining(training) {
    this.swalWarrings.CreateSwal(TrainingConstant.DELETE_TRAINING_MESSAGE).then((result) => {
      if (result.value) {
        // remove the training
        this.trainingService.remove(training).subscribe(res => {
          this.initDataSource();
        });
      }
    });
  }

  /**
   * open DIALOG to add new training request
   */
  addTrainingRequest(idTraining: number) {
      const dataToSend =  idTraining;
      const TITLE = TranslationKeysConstant.ADD_TRAINING_REQUEST ;
      this.formModalDialogService.openDialog(TITLE, TrainingAddRequestComponent,
        this.viewRef, null, dataToSend, true, SharedConstant.MODAL_DIALOG_SIZE_M);
  }
  /**
   * save or edit training
   * @param data
   */
  saveTraining(data?) {
    const dataToSend = data ? data : undefined;
    const TITLE = data ? TranslationKeysConstant.EDIT_TRAINING : TranslationKeysConstant.ADD_TRAINING ;
    this.formModalDialogService.openDialog(TITLE, TrainingAddComponent,
      this.viewRef, this.initDataSource.bind(this), dataToSend, true, SharedConstant.MODAL_DIALOG_SIZE_M);
  }

  /**
   * open DIALOG to add new planification to a specific training
   */
  PlanifyTraining(idTraining: number) {
      this.router.navigateByUrl(TrainingConstant.NAVIGATE_TO_PLANIFY_TRAINING_SESSSION.concat(String(idTraining)));
  }

  clickSearch() {
    this.preparePredicate();
    this.initDataSource(this.predicate);
  }

  private createSearchTeamForm(): void {
    this.searchCatalogFormGroup = this.fb.group({
      Name: [undefined],
      Type: [this.typeFilter[NumberConstant.ZERO]]
    });
  }
}
