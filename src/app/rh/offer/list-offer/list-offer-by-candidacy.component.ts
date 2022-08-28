import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, ViewContainerRef} from '@angular/core';
import {State} from '@progress/kendo-data-query';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {ColumnSettings} from '../../../shared/utils/column-settings.interface';
import {GridSettings} from '../../../shared/utils/grid-settings.interface';
import {GridComponent, PagerSettings} from '@progress/kendo-angular-grid';
import {OfferConstant} from '../../../constant/rh/offer.constant';
import {OfferService} from '../../services/offer/offer.service';
import {Filter, Operation, OrderBy, OrderByDirection, PredicateFormat, Relation} from '../../../shared/utils/predicate';
import {CandidacyService} from '../../services/candidacy/candidacy.service';
import {RecruitmentConstant} from '../../../constant/rh/recruitment.constant';
import {RecruitmentState} from '../../../models/enumerators/recruitment-state.enum';
import {FormModalDialogService} from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import {AddOfferComponent} from '../add-offer/add-offer.component';
import {Offer} from '../../../models/rh/offer.model';
import {SwalWarring} from '../../../shared/components/swal/swal-popup';
import {NewEmailComponent} from '../../components/new-email/new-email.component';
import {OfferState} from '../../../models/enumerators/offer-state.enum';
import {EmailEnumerator} from '../../../models/enumerators/email.enum';
import {TranslateService} from '@ngx-translate/core';
import {PermissionConstant} from '../../../Structure/permission-constant';
import {EmailHistoryComponent} from '../../components/email-history/email-history.component';
import {Subscription} from 'rxjs/Subscription';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { EmailService } from '../../../shared/services/email/email.service';

@Component({
  selector: 'app-list-offer-by-candidacy',
  templateUrl: './list-offer-by-candidacy.component.html',
  styleUrls: ['./list-offer-by-candidacy.component.scss']
})
export class ListOfferByCandidacyComponent implements OnInit, OnDestroy {

  @Input() recruitmentId: number;
  @Output() actionSelected = new EventEmitter<boolean>();
  @ViewChild(GridComponent) grid: GridComponent;

  offerState = OfferState;
  emailEnumerator = EmailEnumerator;
  recruitmentState = RecruitmentState;
  public numberConstant = NumberConstant;
  offerOfCurrentEmail: Offer;
  langList: Array<string> = ['fr', 'en'];
  isModal = false;
  format = this.translateService.instant(SharedConstant.DATE_FORMAT);
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
      field: OfferConstant.NUMBER_OF_OFFER,
      title: OfferConstant.NUMBER_OF_OFFER_TITLE,
      filterable: true,
      filter: 'numeric',
      _width: NumberConstant.TWO_HUNDRED
    }
  ];

  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };
  public hasFullRecuitmentPermission: boolean;
  // end gridSettings
  private subscriptions: Subscription[] = [];

  constructor(private offerService: OfferService, private candidacyService: CandidacyService,
    private swalWarrings: SwalWarring, private formModalDialogService: FormModalDialogService, private emailService: EmailService,
    private viewContainerRef: ViewContainerRef, private translateService: TranslateService, public authService: AuthService) {
    this.hasFullRecuitmentPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.FULL_RECRUITMENT);
  }

  ngOnInit() {
    this.initGridDataSource();
  }

  /**
   * Add a new offer or update the offer
   * @param idCandidacy
   * @param offer
   */
  public openAddOfferDialog(idCandidacy: number, offer: any) {
    if (offer) {
      const predicate = new PredicateFormat();
      predicate.Filter = new Array<Filter>();
      predicate.Filter.push(new Filter(OfferConstant.ID, Operation.eq, offer.Id));
      predicate.Relation = new Array<Relation>();
      predicate.Relation.push.apply(predicate.Relation, [new Relation(OfferConstant.ADVANTAGES)]);
      predicate.Relation.push.apply(predicate.Relation, [new Relation(OfferConstant.OFFER_BENEFIT_IN_KIND)]);
      predicate.Relation.push.apply(predicate.Relation, [new Relation(OfferConstant.OFFER_BONUS)]);
      this.subscriptions.push(this.offerService.getModelByCondition(predicate).subscribe((data) => {
        offer = data as Offer;
        let title = OfferConstant.UPDATE_OFFER;
        if (offer.State === OfferState.Accepted || offer.State === OfferState.Rejected) {
          title = OfferConstant.OFFER_DETAILS;
        }
        this.formModalDialogService.openDialog(title,
          AddOfferComponent, this.viewContainerRef, this.onCloseAddOfferDialogModal.bind(this),
          offer, true, SharedConstant.MODAL_DIALOG_SIZE_L);
      }));
    } else {
      this.formModalDialogService.openDialog(OfferConstant.ADD_OFFER,
        AddOfferComponent, this.viewContainerRef, this.onCloseAddOfferDialogModal.bind(this),
        idCandidacy, true, SharedConstant.MODAL_DIALOG_SIZE_L);
    }
  }

  /**
   * Init list candidacy which state is greater or equals offer
   */
  initGridDataSource(): void {
    this.subscriptions.push(this.candidacyService.getCandidacyListInOfferStep(this.gridSettings.state, this.prepareForCandidacyList()).subscribe((data) => {
      this.gridSettings.gridData = data;
    }));
  }

  dataStateChange(state: State) {
    this.closeExpandedRows(this.gridSettings);
    this.gridSettings.state = state;
    this.initGridDataSource();
  }

  loadOfferDetailsOfSelectedCandidacy(event: any) {
    this.subscriptions.push(this.offerService.readPredicateData(this.preparePredicateForDetails(event.dataItem.Id)).subscribe((data) => {
      event.dataItem.Offer = [];
      data.forEach((offer) => {
        event.dataItem.Offer.push(offer);
      });

    }));
  }

  public getOffreEmailHistoric(dataItem: any) {
    const offerList = [];
    this.subscriptions.push(this.offerService.readPredicateData(this.preparePredicateForDetails(dataItem.Id)).subscribe((res) => {
      res.forEach((offer) => {
        offerList.push(offer);
      });
      this.formModalDialogService.openDialog(OfferConstant.MAIL_HISTORY,
        EmailHistoryComponent, this.viewContainerRef, this.onCloseEmailModal.bind(this),
        offerList, true, SharedConstant.MODAL_DIALOG_SIZE_M);
    }));
  }

  generateAndSendTheOffer(offer: Offer, lang?: string) {
    // If the state of the offer is not draft => the email was generated for this offer,
    // just load the email and the send it to the dialogModal else generate the email and send it to the dialogModal
    if (offer.State !== OfferState.Draft) {
      this.offerService.getOfferWithHisNavigations(offer.Id).subscribe((data) => {
        this.offerOfCurrentEmail = data;
        this.formModalDialogService.openDialog(this.translateService.instant(OfferConstant.SEND_THE_OFFER),
          NewEmailComponent, this.viewContainerRef, this.onCloseEmailModal.bind(this),
          this.offerOfCurrentEmail.IdEmailNavigation, true, SharedConstant.MODAL_DIALOG_SIZE_M);
      });
    } else {
      this.subscriptions.push(this.offerService.generateOffermail(offer, lang).subscribe((result) => {
        this.offerOfCurrentEmail = offer;
        this.offerOfCurrentEmail.IdEmailNavigation = result;
        this.offerOfCurrentEmail.IdEmail = result.Id;
        this.formModalDialogService.openDialog(this.translateService.instant(OfferConstant.SEND_THE_OFFER),
          NewEmailComponent, this.viewContainerRef, this.onCloseEmailModal.bind(this),
          this.offerOfCurrentEmail.IdEmailNavigation, true, SharedConstant.MODAL_DIALOG_SIZE_M);
      }));
    }
  }

  /**
   * After the close of the email modal, communique to back for set state of the offer to sended
   * @param data
   */
  onCloseEmailModal(data: any) {
    if (data && data.Status === this.emailEnumerator.SendRequested) {
      if (this.offerOfCurrentEmail.State === this.offerState.Draft) {
        this.subscriptions.push(this.offerService.updateOfferAfterEmailSend(this.offerOfCurrentEmail).subscribe((result) => {
          this.offerOfCurrentEmail = result as Offer;
          this.initGridDataSource();
        }));
      }
    }
  }

  acceptTheOffer(offer: Offer) {
    this.swalWarrings.CreateSwal(OfferConstant.SURE_TO_ACCEPT_THE_OFFER, OfferConstant.THE_ACCEPTION_IS_DEFINITIVE,
      OfferConstant.ACCEPT_THE_OFFER).then((result) => {
      if (result.value) {
        this.subscriptions.push(this.offerService.acceptTheOffer(offer).subscribe((data) => {
          this.offerOfCurrentEmail = data;
          this.actionSelected.emit();
        }));
      }
    });
  }

  refuseTheOffer(offer: Offer) {
    this.swalWarrings.CreateSwal(OfferConstant.SURE_TO_REFUSE_THE_OFFER, OfferConstant.THE_ACCEPTION_IS_DEFINITIVE,
      OfferConstant.REFUSE_THE_OFFER).then((result) => {
      if (result.value) {
        this.subscriptions.push(this.offerService.refuseTheOffer(offer).subscribe((data) => {
          this.offerOfCurrentEmail = data;
          this.actionSelected.emit();
        }));
      }
    });
  }

  public removeOffer(offer: Offer) {
    this.swalWarrings.CreateSwal().then((result) => {
      if (result.value) {
        this.subscriptions.push(this.offerService.remove(offer).subscribe(() => {
          this.initGridDataSource();
        }));
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscriptions !== undefined) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
  }

  private onCloseAddOfferDialogModal(data: any) {
    this.actionSelected.emit();
  }

  private prepareForCandidacyList() {
    let predicate = new PredicateFormat();
    predicate.Filter = new Array<Filter>();
    predicate.Filter.push(new Filter(RecruitmentConstant.CANDIDACY_ID_RECRUITMENT, Operation.eq, this.recruitmentId));
    predicate.Filter.push(new Filter(RecruitmentConstant.STATE, Operation.gte, this.recruitmentState.Offer));
    predicate.Relation = new Array<Relation>();
    predicate.Relation.push.apply(predicate.Relation, [new Relation(RecruitmentConstant.ID_CANDIDATE_NAVIGATION)]);
    predicate.Relation.push.apply(predicate.Relation, [new Relation(RecruitmentConstant.ID_RECRUITMENT_NAVIGATION)]);
    predicate.Relation.push.apply(predicate.Relation, [new Relation(RecruitmentConstant.CANDIDACY_OFFER)]);
    predicate.OrderBy = new Array<OrderBy>();
    predicate.OrderBy.push(new OrderBy(RecruitmentConstant.CANDIDATE_NAVIGATION_FIRST_NAME, OrderByDirection.asc));
    return predicate;
  }

  private closeExpandedRows(gridSettings: GridSettings) {
    if (gridSettings.state) {
      gridSettings.gridData.data.forEach((item, idx) => {
        this.grid.collapseRow(gridSettings.state.skip + idx);
      });
    }
  }

  private preparePredicateForDetails(idCandidacy: number) {
    let predicate = new PredicateFormat();
    predicate.Filter = new Array<Filter>();
    predicate.Filter.push(new Filter(OfferConstant.ID_CANDIDACY, Operation.eq, idCandidacy));
    predicate.Relation = new Array<Relation>();
    predicate.Relation.push.apply(predicate.Relation, [new Relation(OfferConstant.ADVANTAGES)]);
    predicate.Relation.push.apply(predicate.Relation, [new Relation(OfferConstant.EMAIL_NAVIGATION)]);
    predicate.OrderBy = new Array<OrderBy>();
    predicate.OrderBy.push(new OrderBy(OfferConstant.CREATION_DATE, OrderByDirection.asc));
    return predicate;
  }
}
