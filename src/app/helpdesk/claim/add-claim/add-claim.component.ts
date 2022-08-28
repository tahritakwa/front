import {ItemService} from './../../../inventory/services/item/item.service';
import {Relation, Filter} from './../../../shared/utils/predicate';
import {Component, OnInit, OnDestroy, ViewChild, AfterViewInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormArray, FormControl} from '@angular/forms';
import {
  ValidationService,
  lowerOrEqualThan,
  strictSup,
  digitsAfterComma,
  isNumeric
} from '../../../shared/services/validation/validation.service';
import {Router, ActivatedRoute} from '@angular/router';
import {SwalWarring} from '../../../shared/components/swal/swal-popup';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {ClaimService} from '../../services/claim/claim.service';
import {Subscription} from 'rxjs/Subscription';
import {claimStatusCode, ClaimEnumerator} from '../../../models/enumerators/claim.enum';
import {ClaimConstant} from '../../../constant/helpdesk/claim.constant';
import {TranslateService} from '@ngx-translate/core';
import {PredicateFormat, Operation} from '../../../shared/utils/predicate';
import {DocumentFormService} from '../../../shared/services/document/document-grid.service';
import {isNullOrUndefined} from 'util';
import {Claim} from '../../../models/helpdesk/claim.model';
import {ObjectToSend} from '../../../models/sales/object-to-save.model';
import {ClaimType} from '../../../models/helpdesk/claim-type.model';
import {ClaimTypeService} from '../../services/claim-type/claim-type.service';
import {ClaimStatusService} from '../../services/claim-status/claim-status.service';
import {ClaimInteraction} from '../../../models/helpdesk/claim-interaction.model';
import {DocumentEnumerator} from '../../../models/enumerators/document.enum';
import {isNullOrEmptyString} from '@progress/kendo-angular-grid/dist/es2015/utils';
import {GrowlService} from '../../../../COM/Growl/growl.service';
import {AddClaimDetailsComponent} from '../../components/add-claim-details/add-claim-details.component';
import {ClaimForm} from '../../../models/helpdesk/claim-form.model';
import {ReduisDocument} from '../../../models/sales/reduis-document.model';
import {ItemPrice} from '../../../models/sales/item-price.model';
import {DocumentService} from '../../../sales/services/document/document.service';
import {Observable} from 'rxjs';
import {Document} from '../../../models/sales/document.model';
import {isNotNullOrUndefinedAndNotEmptyValue} from '../../../stark-permissions/utils/utils';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';

@Component({
  selector: 'app-add-claim',
  templateUrl: './add-claim.component.html',
  styleUrls: ['./add-claim.component.scss']
})
export class AddClaimComponent implements OnInit, OnDestroy, AfterViewInit {

  private isSaveOperation = false;
  public collapseInteractionIsOpened = false;
  @ViewChild(AddClaimDetailsComponent) claimDetailsComponent: AddClaimDetailsComponent;
  claimAddForm: FormGroup;
  array: FormGroup;
  public isUpdateMode = false;
  public isSubmitted = false;
  public isClosed = false;
  public isShowForm: boolean;
  private idClaimRequestSubscription: Subscription;
  /*
  * Id Entity
  */
  private idClaim: number;

  choosenFilter: string;
  choosenFilterNumber = NumberConstant.ZERO;
  public predicate: PredicateFormat;

  public claimTypeDropdownSource: Array<ClaimType>;
  public idStatus: number;
  public codeStatus: any;
  private idClaimTypeSelected: number;
  private idClaimStatusSelected: number;
  public claimTypeCode;
  private newClaim: Claim = new Claim();
  private objectToSave: ObjectToSend;
  public isInitialPage: boolean;
  public isSecondPage: boolean;
  public isLastPage: boolean;
  public isClaimAccepted = false;
  public idTier: number;
  public haveDeletePermission = false;
  public haveAddPermission =false;
  public haveUpdatePermission= false;
  public haveGeneratePermission= false;
  /**
   * To be fill in update mode
   */
  public claimData: any;
  predicateItem: PredicateFormat;


  constructor(public claimServices: ClaimService, public claimTypeServices: ClaimTypeService,
              public claimStatusServices: ClaimStatusService, private formBuilder: FormBuilder,
              public validationService: ValidationService, private router: Router,
              private activatedRoute: ActivatedRoute, private growlService: GrowlService,
              private swalWarrings: SwalWarring, public translate: TranslateService,
              public documentFormService: DocumentFormService,
              public documentService: DocumentService, public itemService: ItemService, public authService: AuthService) {

    this.idClaimRequestSubscription = this.activatedRoute.params.subscribe(params => {
      this.idClaim = +params['id'] || NumberConstant.ZERO;
    });

    this.isUpdateMode = false;
    this.isInitialPage = true;
    this.isSecondPage = false;
    this.isLastPage = false;
  }

  ngOnInit() {
    this.haveAddPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.ADD_CLAIM_PURCHASE);
    this.haveUpdatePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_CLAIM_PURCHASE);
    this.haveDeletePermission =this.authService.hasAuthority(PermissionConstant.CommercialPermissions.DELETE_CLAIM_PURCHASE);
    this.haveGeneratePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.GENERATE_DOCUMENT_CLAIM);
    // Prepare predicate for claim type
    this.claimTypeServices.listdropdown().subscribe(
      (data: any) => {
        this.claimTypeDropdownSource = new Array<ClaimType>();
        this.claimTypeDropdownSource = data.listData;
        this.claimTypeDropdownSource.forEach(x => {
          const trans = this.translate.instant(x.TranslationCode);
          x.TranslationCode = trans;
        });
      });
    this.isUpdateMode = this.idClaim > NumberConstant.ZERO;
    this.createAddForm();
    this.addNewClaimInteraction();
    if (!this.isUpdateMode) {
      this.idStatus = claimStatusCode.NEW_CLAIM;
      this.codeStatus = ClaimConstant.NEW_CLAIM;
    }
  }

  ngOnDestroy() {
    if (this.idClaimRequestSubscription) {
      this.idClaimRequestSubscription.unsubscribe();
    }
    this.claimServices.OnDestroy();
  }

  ngAfterViewInit() {
    if (this.isUpdateMode) {
      this.LoadClaimDetails(this.idClaim);
    }
  }

  public checkInteractionCollapseOpening() {
    if (!this.collapseInteractionIsOpened) {
      this.ClaimInteraction.controls.forEach((claim, index) => {
        if (!claim.valid) {
          this.ClaimInteraction.removeAt(index);
        }
      });
    }
  }

  public createAddForm(): void {
    this.claimAddForm = this.formBuilder.group({
      Id: [0],
      IdTiers: [{value: '', disabled: false}, Validators.required],
      IdTiersReference: [{value: '', disabled: true}],
      DocumentDate: [{value: new Date(), disabled: false}, Validators.required],
      IdDocumentStatus: [{value: 1, disabled: false}],
      IdClaimStatus: [{value: claimStatusCode.NEW_CLAIM, disabled: false}],
      Code: [{value: 'CLAIM/' + new Date().getFullYear(), disabled: true}],
      IdDocument: [{value: '', disabled: true}, Validators.required],
      IdClaimStatusReference: [{value: '1', disabled: false}, Validators.required],
      ClaimTypeReference: [{value: '', disabled: true}],
      ClaimType: [{value: ''}, Validators.required],
      IdDocumentLine: [{value: '', disabled: true}],
      Reference: [{value: '', disabled: false}],
      Description: [{value: '', disabled: !this.haveUpdatePermission && !this.haveAddPermission}, Validators.required],
      ClaimContact: [{value: '', disabled: true}],
      ClaimItem: [{value: '', disabled: true}, Validators.required],
      IdClaimItem: [{value: '', disabled: true}, Validators.required],
      IdItem: [{value: '', disabled: false}, Validators.required],
      IdItemReference: [{value: '', disabled: true}],
      IdWarehouse: [{value: '', disabled: true}],
      IdWarehouseReference: [{value: '', disabled: true}],
      ClaimItemWarehouse: [{value: '', disabled: true}],
      IdContact: [{value: '', disabled: true}],
      IdDocumentAssociated: [null],
      ClaimQty: [{value: '', disabled: !this.claimServices.authorizedToUpdate || !this.haveUpdatePermission && !this.haveAddPermission }, [Validators.min(NumberConstant.ZERO), Validators.required]],
      ClaimMaxQty: [{value: '', disabled: false}],
      ClaimInteraction: this.formBuilder.array([]),
      isSecondDeffectivePage: [{value: false, disabled: false}],
      isSecondExtraPage: [{value: false, disabled: false}],
      isSecondMissingPage: [{value: false, disabled: false}],
      IsClaimQtyLocked: [{value: false, disabled: true}],
      SaleInvoiceDocument: [{value: new ReduisDocument(), disabled: true}],
      StockMovementDocument: [{value: undefined, disabled: true}],
      IsExistingStockMovementDocument: [{value: false, disabled: true}],
      IdUsedCurrency: [{value: undefined, disabled: true}],
      IdItemNavigation: [{value: undefined, disabled: true}],
      IdSalesAssetDocument: [{value: undefined, disabled: true}],
      IdMovementIn: [{value: undefined, disabled: true}],
      IdMovementOut: [{value: undefined, disabled: true}],
      IdDocumentNavigation: [{value: undefined, disabled: true}],
      ReferenceOldDocument: [{value: '', disabled: this.claimServices.disableOldButton}],
      IdMovementInNavigation: [{value: undefined, disabled: true}],
      IdMovementOutNavigation: [{value: undefined, disabled: true}],
      IdSalesAssetDocumentNavigation: [{value: undefined, disabled: true}],
      IdFournisseur: [{value: '', disabled: false}, Validators.required]
    });
    this.isSubmitted = false;
    this.claimAddForm.controls[ClaimConstant.CLAIM_QUANTITY].valueChanges.subscribe(() => {
      this.claimAddForm.controls[ClaimConstant.CLAIM_MAX_QUUANTITY].updateValueAndValidity();
    });
  }

  LoadClaimDetails(idclaim: number, claimData?: any) {
    if (isNullOrUndefined(claimData)) {
      this.claimServices.getClaimById(idclaim).subscribe(
        res => {
          this.UpdateClaimDetails(res);
        });
    } else {
      this.UpdateClaimDetails(claimData);
    }
  }

  UpdateClaimDetails(res) {
    if (!isNullOrUndefined(res)) {
      this.claimServices.authorizedToUpdate = res.IdClaimStatus === claimStatusCode.NEW_CLAIM || res.IdClaimStatus === claimStatusCode.SUBMITTED_CLAIM;
      this.claimAddForm.patchValue(new ClaimForm(this.translate, res));
      this.idStatus = res.IdClaimStatus;
      this.codeStatus = res.IdClaimStatusNavigation.TranslationCode;
      this.isSecondPage = true;
      this.claimTypeCode = res.ClaimType;
      this.claimAddForm.controls['isSecondDeffectivePage'].setValue(this.claimTypeCode === ClaimEnumerator.Deffective);
      this.claimAddForm.controls['isSecondExtraPage'].setValue(this.claimTypeCode === ClaimEnumerator.Extra);
      this.claimAddForm.controls['isSecondMissingPage'].setValue(this.claimTypeCode === ClaimEnumerator.Missing);
      this.isClaimAccepted = this.idStatus === claimStatusCode.ACCEPTED_CLAIM;
      this.clearClaimInteraction();
      this.initClaimInteraction(res);
      this.claimData = res;
      if (this.isUpdateMode) {
        this.claimAddForm.controls.DocumentDate.disable();
      }
      if (res.IdClaimStatus === claimStatusCode.ACCEPTED_CLAIM) {
        this.claimAddForm.controls.ClaimQty.disable();
      }
      if (!isNullOrUndefined(this.claimAddForm.controls.ReferenceOldDocument.value)
        && this.claimAddForm.controls.ReferenceOldDocument.value !== '') {
        this.claimServices.hasOnlyOldDocument = true;
        this.claimAddForm.controls.ReferenceOldDocument.disable();
      }
      if (this.claimAddForm.controls.isSecondDeffectivePage.value
        && isNullOrUndefined(this.claimAddForm.controls.IdMovementOut.value)) {
        this.claimServices.disableOldButton = true;
      }
      if (!isNullOrUndefined(this.claimAddForm.controls.IdDocument.value)
        && this.claimAddForm.controls.IdDocument.value !== '') {
        this.claimServices.saleDocument = new Document(this.claimAddForm.controls.IdDocumentNavigation.value.DocumentLine,
          this.claimAddForm.controls.IdDocumentNavigation.value);
      }
      if (!isNullOrUndefined(this.claimAddForm.controls.IdSalesAssetDocument.value)
        && this.claimAddForm.controls.IdSalesAssetDocument.value !== '') {
        this.claimServices.assetDocument = new Document(this.claimAddForm.controls.IdSalesAssetDocumentNavigation.value.DocumentLine,
          this.claimAddForm.controls.IdSalesAssetDocumentNavigation.value);
      }
      if (!isNullOrUndefined(this.claimAddForm.controls.IdMovementIn.value)
        && this.claimAddForm.controls.IdMovementIn.value !== '') {
        this.claimServices.movementDocument = new Document(this.claimAddForm.controls.IdMovementInNavigation.value.DocumentLine,
          this.claimAddForm.controls.IdMovementInNavigation.value);
      }
      if (!isNullOrUndefined(this.claimAddForm.controls.IdMovementOut.value)
        && this.claimAddForm.controls.IdMovementOut.value !== '') {
        this.claimServices.movementDocument = new Document(this.claimAddForm.controls.IdMovementOutNavigation.value.DocumentLine,
          this.claimAddForm.controls.IdMovementOutNavigation.value);
      }
      this.LoadPage(true);
    }
  }

  receiveClaimType($event) {
    $event.claimTypeFiltredDataSource = this.claimTypeDropdownSource;
  }

  /** create the form group */


  initDetailsValues = (isNew?: boolean) => {
    if (!isNullOrUndefined(isNew)) {
      this.claimAddForm.patchValue({
        IdTiersReference: undefined,
        IdItemReference: undefined,
        IdWarehouseReference: undefined
      });
    }
  };


  receiveClaimTypeSelected() {
    this.idClaimTypeSelected = this.claimAddForm.controls['ClaimType'].value;
    if(this.claimAddForm.controls['ClaimType'].value != "D"){
      this.claimAddForm.controls['IdFournisseur'].clearValidators();
      this.claimAddForm.controls['IdFournisseur'].setErrors(null);
    }else{
      this.claimAddForm.controls['IdFournisseur'].setValidators(Validators.required);
    }
    if (this.claimTypeCode !== this.idClaimTypeSelected) {
      this.formPartialReset();
    }
    this.claimTypeCode = this.idClaimTypeSelected;
    this.LoadPage();
  }

  /**
   * LoadPage loading details of page and claim type
   */
  public LoadPage(isFromUpdate?: boolean) {
    if (!isNullOrUndefined(this.claimTypeCode)) {

      if (isNullOrUndefined(isFromUpdate) && isFromUpdate) {
        this.claimAddForm.patchValue({
          IdItem: undefined,
          IdTiers: undefined
        });
      }


      if (this.claimTypeCode === ClaimConstant.Deffective) {
        this.claimAddForm.patchValue({
          isSecondDeffectivePage: true,
          isSecondExtraPage: false,
          isSecondMissingPage: false,
        });
        if (!this.isUpdateMode) {
          this.initDetailsValues(true);
        }
      }
      if (this.claimTypeCode === ClaimConstant.Extra) {
        this.claimAddForm.patchValue({
          isSecondDeffectivePage: false,
          isSecondExtraPage: true,
          isSecondMissingPage: false,
        });
      }
      if (this.claimTypeCode === ClaimConstant.Missing) {
        this.claimAddForm.patchValue({
          isSecondDeffectivePage: false,
          isSecondExtraPage: false,
          isSecondMissingPage: true,
        });
      }
      this.isSecondPage = true;
      if (this.claimDetailsComponent) {
        this.claimDetailsComponent.disableItemDropdown();
      }
    } else {
      this.claimAddForm.patchValue({
        isSecondDeffectivePage: false,
        isSecondExtraPage: false,
        isSecondMissingPage: false,
        IdItem: undefined,
        IdTiers: undefined
      });
      this.isSecondPage = false;
    }
  }

  save() {
    this.claimServices.disableButtonWhenTreatment = true;
    this.checkInteractionCollapseOpening();
    if (this.claimAddForm.valid) {
      if (this.isUpdateMode) {
        this.updateClaimRequest();
      } else {
        this.saveClaimRequest();
      }
    } else {
      this.claimServices.disableButtonWhenTreatment = false;
      this.validationService.validateAllFormFields(this.claimAddForm);
    }
  }

  saveClaimRequest() {
    this.checkInteractionCollapseOpening();
    this.isSaveOperation = true;
    this.prepareObjectToAdd();
    this.claimServices.saveClaim(this.objectToSave).finally(() => {
      this.claimServices.disableButtonWhenTreatment = false;
    }).subscribe(res => {
      this.newClaim = res;
      if (!isNullOrUndefined(res)) {
        this.router.navigateByUrl(ClaimConstant.URI_CLAIM_LIST);
      } else {
        this.growlService.ErrorNotification(this.translate.instant(ClaimConstant.CLAIM_UNSUCCESSFULL_ADD));
      }
    });
  }

  updateClaimRequest() {
    this.isSaveOperation = true;
    this.claimDetailsComponent.claimQty = this.claimAddForm.controls[ClaimConstant.CLAIM_QUANTITY].value;
    this.prepareObjectToUpdate();
    this.claimServices.updateClaim(this.objectToSave).finally(() => {
      this.claimServices.disableButtonWhenTreatment = false;
    }).subscribe(res => {
      this.newClaim = res;
      if (!isNullOrUndefined(res)) {
        this.router.navigateByUrl(ClaimConstant.URI_CLAIM_LIST);
      } else {
        this.growlService.ErrorNotification(this.translate.instant(ClaimConstant.CLAIM_UNSUCCESSFULL_ADD));
      }
    });
  }

  addClaimTiersAsset() {
    if (this.claimAddForm.valid) {
      if (this.isUpdateMode) {
        this.prepareObjectToUpdate();
        this.newClaim.DocumentTypeCode = DocumentEnumerator.SalesAsset;
        this.objectToSave.Model.IdClaimStatus = claimStatusCode.ACCEPTED_CLAIM;
        this.claimServices.updateClaim(this.objectToSave).subscribe(res => {
          this.newClaim = res;
          if (!isNullOrUndefined(res)) {
            this.UpdateClaimDetails(res);
            this.objectToSave.Model.IdClaimStatus = claimStatusCode.ACCEPTED_CLAIM;
            this.claimServices.addClaimTiersAsset(this.objectToSave).finally(() => {
              this.claimServices.disableButtonWhenTreatment = false;
            }).subscribe(res => {
              this.claimServices.hasSaleDeliveryToUpdate = false;
              this.claimServices.hasSaleInvoiceToGenerateSaleAsset = false;
              this.claimServices.hasBSToUpdate = false;
              this.newClaim = res;
              if (!isNullOrUndefined(res)) {
                this.router.navigateByUrl(ClaimConstant.URI_ADVANCED_EDIT.concat(res.Id.toString()));
                this.LoadClaimDetails(res.Id);
              } else {
                this.growlService.ErrorNotification(this.translate.instant(ClaimConstant.CLAIM_UNSUCCESSFULL_GENERATE_STOCK_MOVEMENT));
              }
            });
          }
        });
      } else {
        this.prepareObjectToAdd();
        this.newClaim.DocumentTypeCode = DocumentEnumerator.SalesAsset;
        this.claimServices.saveClaim(this.objectToSave).subscribe(res => {
          this.newClaim = res;
          if (!isNullOrUndefined(res)) {
            this.UpdateClaimDetails(res);
            this.objectToSave.Model.IdClaimStatus = claimStatusCode.ACCEPTED_CLAIM;
            this.objectToSave.Model.IdFournisseur = res.IdFournisseur;
            this.objectToSave.Model.Id = this.newClaim.Id;
            this.objectToSave.Model.Code = this.newClaim.Code;
            this.claimServices.addClaimTiersAsset(this.objectToSave).finally(() => {
              this.claimServices.disableButtonWhenTreatment = false;
              this.claimServices.hasSaleInvoiceToGenerateSaleAsset = false;
            }).subscribe(res => {
              this.newClaim = res;
              if (!isNullOrUndefined(res)) {
                this.router.navigateByUrl(ClaimConstant.URI_ADVANCED_EDIT.concat(res.Id.toString()));
                this.LoadClaimDetails(res.Id);
              } else {
                this.growlService.ErrorNotification(this.translate.instant(ClaimConstant.CLAIM_UNSUCCESSFULL_GENERATE_STOCK_MOVEMENT));
              }
            });
          } else {
            this.growlService.ErrorNotification(this.translate.instant(ClaimConstant.CLAIM_UNSUCCESSFULL_ADD));
          }
        });
      }

    } else {
      this.claimServices.disableButtonWhenTreatment = false;
      this.validationService.validateAllFormFields(this.claimAddForm);
    }
  }

  addClaimMovement() {
    if (this.claimAddForm.valid) {
      this.isSaveOperation = true;
      if (this.isUpdateMode) {
        this.prepareObjectToUpdate();
        this.claimServices.updateClaim(this.objectToSave).subscribe(res => {
          this.newClaim = res;
          if (!isNullOrUndefined(res)) {
            this.UpdateClaimDetails(res);
            this.objectToSave.Model.IdClaimStatus = claimStatusCode.ACCEPTED_CLAIM;
            this.claimServices.addClaimMovement(this.objectToSave).finally(() => {
              this.claimServices.disableButtonWhenTreatment = false;
            }).subscribe(res => {
             this.resolveMovementGeneration(res);
            });
          }
        });
      } else {
        this.prepareObjectToAdd();
        this.claimServices.saveClaim(this.objectToSave).subscribe(res => {
          this.newClaim = res;
          if (!isNullOrUndefined(res)) {
            this.UpdateClaimDetails(res);
            this.objectToSave.Model.Id = this.newClaim.Id;
            this.objectToSave.Model.Code = this.newClaim.Code;
            this.objectToSave.Model.IdClaimStatus = claimStatusCode.ACCEPTED_CLAIM;
            this.objectToSave.Model.IdFournisseur = res.IdFournisseur;
            this.claimServices.addClaimMovement(this.objectToSave).finally(() => {
              this.claimServices.disableButtonWhenTreatment = false;
            }).subscribe(res => {
              this.resolveMovementGeneration(res);
            });


          } else {
            this.growlService.ErrorNotification(this.translate.instant(ClaimConstant.CLAIM_UNSUCCESSFULL_ADD));
          }
        });

      }
    } else {
      this.claimServices.disableButtonWhenTreatment = false;
      this.validationService.validateAllFormFields(this.claimAddForm);
    }
  }

  resolveMovementGeneration = (res) => {
    this.newClaim = res;
    if (!isNullOrUndefined(res)) {
      this.router.navigateByUrl(ClaimConstant.URI_ADVANCED_EDIT.concat(res.Id.toString()));
      this.LoadClaimDetails(res.Id);
    } else {
      this.growlService.ErrorNotification(this.translate.instant(ClaimConstant.CLAIM_UNSUCCESSFULL_GENERATE_STOCK_MOVEMENT));
    }
  };

  generateMovementOut() {
    this.checkInteractionCollapseOpening();
    this.addClaimMovement();
  }

  generateMovementIn() {
    this.checkInteractionCollapseOpening();
    this.addClaimMovement();
  }

  getClaimInteractions() {
    const listclaims = new Array<ClaimInteraction>();
    const listerrorclaims = new Array<ClaimInteraction>();

    this.ClaimInteraction.value.forEach(element => {
      // element.Id = 0;
      let claimerrors = 0;
      if (isNullOrEmptyString(element.InteractionDescription)) {
        claimerrors = claimerrors + 1;
      }

      if (isNullOrEmptyString(element.IdInteractionType)) {
        claimerrors = claimerrors + 1;
      }

      if (isNullOrUndefined(element.InteractionDate)) {
        claimerrors = claimerrors + 1;
      }

      if (claimerrors >= 1) {
        listerrorclaims.push(element);
      } else {
        const newElement = new ClaimInteraction();
        newElement.Id = this.isUpdateMode ? element.Id : NumberConstant.ZERO;
        newElement.IdClaim = this.isUpdateMode ? element.IdClaim : NumberConstant.ZERO;
        newElement.DocumentDate = element.InteractionDate;
        newElement.TypeInteraction = element.IdInteractionType;
        newElement.Description = element.InteractionDescription;
        newElement.IsDeleted = element.IsDeleted;
        if (listclaims.find(x => x.Id === newElement.Id && x.TypeInteraction === newElement.TypeInteraction
          && x.DocumentDate === newElement.DocumentDate && x.Description === newElement.Description) === undefined) {
          listclaims.push(newElement);
        }
      }

    });
    return listclaims;
  }

  prepareObjectData() {
    this.newClaim.Description = this.claimAddForm.controls['Description'].value;
    this.newClaim.IdClaimStatus = this.claimAddForm.controls['IdClaimStatus'].value;
    this.newClaim.DocumentDate = this.claimAddForm.controls['DocumentDate'].value;
    this.newClaim.Reference = this.claimAddForm.controls['Reference'].value;
    this.newClaim.IsClaimQtyLocked = this.claimAddForm.controls['IsClaimQtyLocked'].value;
    this.newClaim.IdWarehouse = this.claimAddForm.controls['IdWarehouse'].value;
    this.newClaim.ClaimQty = this.claimAddForm.controls[ClaimConstant.CLAIM_QUANTITY].value;
    this.newClaim.ClaimMaxQty = this.claimAddForm.controls[ClaimConstant.CLAIM_MAX_QUUANTITY].value;
    this.newClaim.IdItem = this.claimAddForm.controls[ClaimConstant.ID_ITEM_FIELD].value;
    this.newClaim.IdDocument = this.claimAddForm.controls['IdDocument'].value;
    this.newClaim.IdDocumentLine = this.claimAddForm.controls['IdDocumentLine'].value;
    this.newClaim.ClaimType = this.claimTypeCode;
    this.newClaim.ReferenceOldDocument = this.claimAddForm.controls['ReferenceOldDocument'].value;
    if (this.newClaim.ClaimType === ClaimEnumerator.Deffective) {
      this.newClaim.IdClient = this.claimAddForm.controls['IdTiers'].value;
      this.newClaim.IdFournisseur = this.claimAddForm.controls['IdFournisseur'].value;
    } else {
      this.newClaim.IdFournisseur = this.claimAddForm.controls['IdTiers'].value;
    }
    this.newClaim.ClaimInteraction = this.getClaimInteractions();
  }

  prepareObjectToAdd() {
    this.newClaim = new Claim();
    this.prepareObjectData();
    this.newClaim.IsTreated = false;
    this.objectToSave = new ObjectToSend(this.newClaim);
  }

  prepareObjectToUpdate() {
    this.newClaim = new Claim();
    this.newClaim.Code = this.claimAddForm.controls['Code'].value;
    this.newClaim.Id = this.claimAddForm.controls['Id'].value;
    this.prepareObjectData();
    this.newClaim.IdSalesAssetDocument = this.claimAddForm.controls['IdSalesAssetDocument'].value;
    this.newClaim.IdMovementIn = this.claimAddForm.controls['IdMovementIn'].value;
    this.newClaim.IdMovementOut = this.claimAddForm.controls['IdMovementOut'].value;
    this.objectToSave = new ObjectToSend(this.newClaim);
  }

  isDisabledForm(): boolean {
    return this.idStatus !== -1 && this.idStatus !== claimStatusCode.NEW_CLAIM;
  }

  formPartialReset() {
    this.claimAddForm.patchValue({
      IdTiers: undefined,
      IdTiersReference: undefined,
      IdItemReference: undefined,
      IdDocumentStatus: undefined,
      IdClaimStatus: claimStatusCode.NEW_CLAIM,
      IdDocument: undefined,
      ClaimStatus: undefined,
      Reference: undefined,
      Description: undefined,
      ClaimContact: undefined,
      ClaimItem: undefined,
      IdItem: undefined,
      IdClaimItem: undefined,
      ClaimItemWarehouse: undefined,
      IdContact: undefined,
      IdDocumentAssociated: undefined,
      ClaimMaxQty: undefined,
      StockMovementDocument: undefined,
      IdMovementInNavigation: undefined,
      IdMovementOutNavigation: undefined
    });

    this.claimServices.saleDeliveryDocument = new Document();
    this.claimServices.saleInvoiceDocument = new Document();
    this.claimServices.bSDocumentToUpdate = new Document();
    this.claimServices.hasSaleDeliveryToUpdate = false;
    this.claimServices.hasSaleInvoiceToGenerateSaleAsset = false;
    this.claimServices.hasBSToUpdate = false;
    this.claimServices.assetDocument = new Document();
    this.claimServices.saleDocument = new Document();
    this.claimServices.movementDocument = new Document();

  }


  updateStatusFromClaimInteraction(itemToUpdate) {
    this.idClaimStatusSelected = (this.ClaimInteraction.length > NumberConstant.ZERO) ?
      ((!isNullOrUndefined(itemToUpdate) && itemToUpdate.IdClaimStatus === claimStatusCode.NEW_CLAIM) ?
        claimStatusCode.SUBMITTED_CLAIM : (isNullOrUndefined(itemToUpdate) ?
          (this.idStatus <= claimStatusCode.SUBMITTED_CLAIM ? claimStatusCode.NEW_CLAIM : this.idStatus) : itemToUpdate.IdClaimStatus)) :
      (!isNullOrUndefined(itemToUpdate) && itemToUpdate.IdClaimStatus <= claimStatusCode.SUBMITTED_CLAIM ? claimStatusCode.NEW_CLAIM
        : this.idStatus);
    this.idStatus = this.idClaimStatusSelected;
    this.claimAddForm.patchValue({
      IdClaimStatusReference: this.idStatus
    });
  }

  onUpdateSaleDeliveryDocumentClicked() {
    this.generateBLWithoutReferenceDoc();
    if (this.claimAddForm.valid) {
      if (this.claimAddForm.controls['ClaimQty'].value <= this.claimAddForm.controls['ClaimMaxQty'].value) {
        if (this.isUpdateMode) {
          this.prepareObjectToUpdate();
          this.claimServices.updateClaim(this.objectToSave).subscribe(res => {
            this.newClaim = res;
            if (!isNullOrUndefined(res)) {
              this.UpdateClaimDetails(res);
              this.objectToSave.Model.IdClaimStatus = claimStatusCode.ACCEPTED_CLAIM;
              this.updateSalesDocument();
            }
          });
        } else {
          this.prepareObjectToAdd();
          if (this.objectToSave.Model.ClaimInteraction.length == NumberConstant.ZERO){
            this.swalWarrings.CreateSwal(ClaimConstant.CLAIM_INTERACTION_TEXT_MESSAGE, ClaimConstant.CLAIM_INTERACTION_TITLE_MESSAGE).
            then((result) => {
              if (result.value) {
                   this.saveClaim();
              }
          });
        }else{
          this.saveClaim();
        }
        }
      } else {
        this.growlService.ErrorNotification(this.translate.instant(ClaimConstant.CLAIM_UNSUCCESSFULL_ADD_EXCEED_QUANTITY));
      }
    } else {
      this.claimServices.disableButtonWhenTreatment = false;
      this.validationService.validateAllFormFields(this.claimAddForm);
    }

  }
  public saveClaim(){
    this.objectToSave.Model.IsClaimQtyLocked = true;
    this.claimServices.saveClaim(this.objectToSave).subscribe(res => {
      this.newClaim = res;
      if (!isNullOrUndefined(res)) {
        this.UpdateClaimDetails(res);
        this.objectToSave.Model.Id = this.newClaim.Id;
        this.objectToSave.Model.Code = this.newClaim.Code;
        if (this.claimAddForm.valid) {
          this.updateSalesDocument();
        }
      } else {
        this.growlService.ErrorNotification(this.translate.instant(ClaimConstant.CLAIM_UNSUCCESSFULL_ADD));
      }
    });
  }

  onGenerateAssetDocumentClicked() {
    if (!isNullOrUndefined(this.claimAddForm.controls.SaleInvoiceDocument.value)) {
      this.claimAddForm.controls['ReferenceOldDocument'].enable();
      this.array.controls['InteractionDate'].clearValidators();
      this.array.controls['InteractionDescription'].clearValidators();
      this.array.controls['IdInteractionType'].clearValidators();
      this.validationService.validateAllFormFields(this.array);
      this.addClaimTiersAsset();
    } else {
      this.claimServices.disableButtonWhenTreatment = false;
      this.growlService.warningNotification(ClaimConstant.NEW_CLAIM);
    }
  }

  OnUpdateBSDocumentClicked() {
    if (this.claimAddForm.valid) {
      if (this.isUpdateMode) {
        this.prepareObjectToUpdate();
        this.claimServices.updateClaim(this.objectToSave).subscribe(res => {
          this.newClaim = res;
          if (!isNullOrUndefined(res)) {
            this.UpdateClaimDetails(res);
            this.objectToSave.Model.IdClaimStatus = claimStatusCode.ACCEPTED_CLAIM;
            this.updateBs();
          }
        });
      } else {
        this.prepareObjectToAdd();
        this.objectToSave.Model.IsClaimQtyLocked = true;
        this.claimServices.saveClaim(this.objectToSave).subscribe(res => {
          this.newClaim = res;
          this.UpdateClaimDetails(res);
          if (!isNullOrUndefined(res)) {
            this.objectToSave.Model.Id = this.newClaim.Id;
            this.objectToSave.Model.Code = this.newClaim.Code;
            this.updateBs();
          }
        });
      }
    } else {
      this.claimServices.disableButtonWhenTreatment = false;
      this.validationService.validateAllFormFields(this.claimAddForm);
    }
  }

  updateBs() {
    if (!isNullOrUndefined(this.claimServices.bSDocumentToUpdate)) {
      if (this.claimAddForm.valid) {
        let itemPrice = this.prepareItemPrices(this.claimServices.bSDocumentToUpdate,
          this.claimServices.bSDocumentToUpdate.DocumentLine);
        itemPrice.DocumentLineViewModel.IdDocument = this.claimServices.bSDocumentToUpdate.Id;
        let document = new Document(this.claimServices.bSDocumentToUpdate.DocumentLine, this.claimServices.bSDocumentToUpdate);

        this.claimServices.updateRelatedDocumentToClaim(itemPrice).finally(() => {
          this.claimServices.disableButtonWhenTreatment = false;
        }).subscribe(x => {
          this.claimServices.hasSaleDeliveryToUpdate = false;
          this.claimServices.hasSaleInvoiceToGenerateSaleAsset = false;
          this.claimServices.hasBSToUpdate = false;
          this.claimAddForm.patchValue({
            IsClaimQtyLocked: true,
            IdDocument: this.claimServices.bSDocumentToUpdate.Id,
            IdClaimStatus: claimStatusCode.ACCEPTED_CLAIM,
            Id: this.newClaim.Id,
            Code: this.newClaim.Code,
            ClaimType: this.newClaim.ClaimType,
            IdClient: this.newClaim.IdClient,
            IdContact: this.newClaim.IdContact,
          });
          this.idStatus = claimStatusCode.ACCEPTED_CLAIM;
          this.updateClaimRequest();
        });

      } else {
        this.claimServices.disableButtonWhenTreatment = false;
        this.validationService.validateAllFormFields(this.claimAddForm);
      }
    } else {
      this.claimServices.disableButtonWhenTreatment = false;
      this.growlService.warningNotification(ClaimConstant.NEW_CLAIM);
    }
  }

  prepareItemPrices(dataItem, dataItemLine): ItemPrice {
    let itemPrice;
    const documentLine = dataItemLine.find(x => x.IdItem === this.claimAddForm.controls.IdItem.value);
    if (documentLine.MovementQty === this.claimAddForm.controls.ClaimQty.value) {
      documentLine.IsDeleted = true;
    }
    documentLine.MovementQty = documentLine.MovementQty - this.claimAddForm.controls.ClaimQty.value;
    itemPrice = new ItemPrice(dataItem.DocumentTypeCode, dataItem.DocumentDate,
      dataItem.IdTiers, documentLine, this.claimAddForm.controls.IdUsedCurrency.value, false);
    itemPrice.DocumentLineViewModel.IdItem = this.claimAddForm.controls.IdItem.value;
    itemPrice.DocumentLineViewModel.Id = documentLine.Id;
    itemPrice.DocumentLineViewModel.IsDeleted = documentLine.IsDeleted;
    return itemPrice;
  }

  updateSalesDocument() {
    let itemPrice: any;
    if (this.claimServices.hasSaleDeliveryToUpdate) {
      itemPrice = this.prepareItemPrices(this.claimServices.saleDeliveryDocument,
        this.claimServices.saleDeliveryDocument.DocumentLine);
      itemPrice.DocumentLineViewModel.IdDocument = this.claimServices.saleDeliveryDocument.Id;
    }
    this.claimServices.updateRelatedDocumentToClaim(itemPrice).finally(() => {
      this.claimServices.disableButtonWhenTreatment = false;
    }).subscribe(x => {
      this.claimServices.hasSaleDeliveryToUpdate = false;
      this.claimServices.hasSaleInvoiceToGenerateSaleAsset = false;
      this.claimServices.hasBSToUpdate = false;
      this.claimAddForm.patchValue({
        IsClaimQtyLocked: true,
        IdDocument: this.claimServices.saleDeliveryDocument.Id,
        IdClaimStatus: claimStatusCode.ACCEPTED_CLAIM,
        Id: this.newClaim.Id,
        Code: this.newClaim.Code,
        ClaimType: this.newClaim.ClaimType,
        IdClient: this.newClaim.IdClient,
        IdContact: this.newClaim.IdContact,
      });
      this.idStatus = claimStatusCode.ACCEPTED_CLAIM;
      this.updateClaimRequest();
    });
  }

  /**************************** CLAIM INTERACTION ***************************************************/

  /**
   * Build ItemWarehouse Array form item
   * */
  public buildClaimInteractionFormGroup(): FormGroup {
    this.array = this.formBuilder.group({
      Id: [NumberConstant.ZERO],
      IdItem: [NumberConstant.ZERO],
      IdClaim: [NumberConstant.ZERO],
      IdInteractionType: [undefined, Validators.required],
      InteractionDescription: [undefined, Validators.required],
      InteractionDate: [undefined, Validators.required],
      IsDeleted: [false]
    });
    return this.array;
  }


  /**
   * Claim's InteractionList list
   */
  get ClaimInteraction(): FormArray {
    return this.claimAddForm.get(ClaimConstant.CLAIMINTERACTION) as FormArray;
  }


  /**
   * Get itemWarehouse row visibility
   * @param i
   * @returns boolean
   */
  isRowVisible(i): boolean {
    return !this.ClaimInteraction.at(i).get(ClaimConstant.IS_DELETED).value;

  }


  /**
   * generate Qualification FormGroup from Contract object
   * @param currentContract
   */
  public generateInteractionFromClaimInteraction(currentInteraction: ClaimInteraction): FormGroup {
    let currentQualificationFormGroup: FormGroup;
    currentQualificationFormGroup = this.formBuilder.group({
      Id: [currentInteraction.Id],
      IdItem: [this.idClaimStatusSelected],
      IdClaim: [this.idClaim],
      IdInteractionType: [currentInteraction.TypeInteraction, Validators.required],
      InteractionDescription: [currentInteraction.Description, Validators.required],
      InteractionDate: [new Date(currentInteraction.DocumentDate), Validators.required],
      IsDeleted: [currentInteraction.IsDeleted]
    });
    return currentQualificationFormGroup;
  }


  /**
   * Itim itemwarehouse form
   * */
  initClaimInteraction(itemToUpdate: any) {
    if (itemToUpdate.ClaimInteraction && itemToUpdate.ClaimInteraction.length > NumberConstant.ZERO) {
      this.isSubmitted = true;
      let i = NumberConstant.ZERO;
      itemToUpdate.ClaimInteraction.forEach(element => {
        const newFormInteraction = this.generateInteractionFromClaimInteraction(element);
        this.addClaimInteraction(newFormInteraction, i);
        i++;
      });
    }

    if (itemToUpdate.IdClaimStatus > claimStatusCode.SUBMITTED_CLAIM) {
      this.isSubmitted = true;
    }
  }


  /**
   * Add new Qualification to the claim form
   * @param newClaimInteractionFormGroup
   */
  addClaimInteraction(newClaimInteractionFormGroup: FormGroup, index: number): void {
    newClaimInteractionFormGroup.addControl(ClaimConstant.HIDE, new FormControl(true));
    this.ClaimInteraction.insert(index, newClaimInteractionFormGroup);

  }

  /**
   * Delete contract from UI and add it to contractListToDeleteFromDB if already exist in DB
   * @param i
   */
  deleteClaimInteraction(i: number): void {
    if ((this.ClaimInteraction.at(i) as FormGroup).controls[ClaimConstant.ATTRIBUT_ID].value === NumberConstant.ZERO) {
      this.ClaimInteraction.removeAt(i);
    } else {
      this.swalWarrings.CreateSwal(ClaimConstant.INTERACTION_DELETE_TEXT_MESSAGE,
        ClaimConstant.INTERACTION_DELETE_TITLE_MESSAGE).then((result) => {
        if (result.value) {
          (this.ClaimInteraction.at(i) as FormGroup).controls[ClaimConstant.IS_DELETED] = new FormControl(true);
          this.ClaimInteraction.at(i).updateValueAndValidity();
        }
      });
    }
  }

  showClaimInteraction() {
    this.isLastPage = true;
  }

  clearClaimInteraction() {
    while (this.ClaimInteraction.length) {
      this.ClaimInteraction.removeAt(0);
    }
  }

  claimQtySetValidators(idItem) {
    if (idItem) {
      this.predicateItem = new PredicateFormat();
      this.predicateItem.Filter = new Array<Filter>();
      this.predicateItem.Filter.push(new Filter('Id', Operation.eq, idItem));
      this.predicateItem.Relation = new Array<Relation>();
      this.predicateItem.Relation.push.apply(this.predicateItem.Relation, [new Relation('IdUnitStockNavigation')]);
      let claim = {
        'ClaimType': this.claimTypeCode,
        'IdItem': idItem,
        'IdClient': 0,
        'IdFournisseur': 0,
        'IdClaim': 0
      };
      if (claim.ClaimType === ClaimEnumerator.Deffective) {
        claim.IdClient = this.claimAddForm.controls['IdTiers'].value;
        claim.IdFournisseur = this.claimAddForm.controls['IdFournisseur'].value;
      } else {
        claim.IdFournisseur = this.claimAddForm.controls['IdTiers'].value;
      }
      if (this.idClaim) {
        claim.IdClaim = this.idClaim;
      }
      this.predicateItem.Filter.push(new Filter('Claim', Operation.eq, claim));

      this.itemService.getModelByCondition(this.predicateItem).subscribe(res => {
        if (res.Id) {
          this.claimDetailsComponent.itemAfterSelect(res.Id);
        }
        if (res.IdUnitStockNavigation.IsDecomposable) {
          const digits = res.IdUnitStockNavigation.DigitsAfterComma;
          this.claimAddForm.controls['ClaimQty'].setValidators([Validators.required,
            digitsAfterComma(digits), strictSup(0),
            lowerOrEqualThan(new Observable(o => o.next(this.claimAddForm.controls[ClaimConstant.CLAIM_MAX_QUUANTITY].value)))]);
        } else {
          this.claimAddForm.controls['ClaimQty'].setValidators([Validators.required, Validators.min(1), isNumeric(),
            lowerOrEqualThan(new Observable(o => o.next(this.claimAddForm.controls[ClaimConstant.CLAIM_MAX_QUUANTITY].value)))]);
        }
      });
    } else {
      this.claimAddForm.controls['ClaimQty'].reset();
      this.claimAddForm.controls['ClaimQty'].setValidators(Validators.min(NumberConstant.ZERO));
    }

  }
  claimTierSetValidators(idTier){
    this.claimAddForm.controls['IdFournisseur'].setValue(idTier);
  }

  /**
   * this method will be called by CanDeactivateGuard service to check the leaving component possibility
   */
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.isSaveOperation) {
      this.isSaveOperation = false;
      return true;
    }
    return this.validationService.handleCanDeactivateToLeaveCurrentComponent(this.isFormChanged.bind(this));
  }

  isFormChanged(): boolean {
    return this.claimAddForm.touched;
  }

  /**
   *Add new qualification popup
   * */
  addNewClaimInteraction() {
    if (this.ClaimInteraction.valid) {
      this.ClaimInteraction.push(this.buildClaimInteractionFormGroup());
    } else {
      this.validationService.validateAllFormGroups(this.ClaimInteraction);
    }
  }

  public getCode() {
    if (this.claimAddForm && this.claimAddForm.controls[ClaimConstant.CODE_FIELD]) {
      return this.claimAddForm.controls[ClaimConstant.CODE_FIELD].value;
    }
  }

  public removeClaim() {
    if (isNotNullOrUndefinedAndNotEmptyValue(this.claimData)) {
      this.swalWarrings.CreateSwal(ClaimConstant.CLAIM_DELETE_TEXT_MESSAGE, ClaimConstant.CLAIM_DELETE_TITLE_MESSAGE).then((result) => {
        if (result.value) {
          this.claimServices.remove(this.claimData).subscribe(() => {
            this.router.navigateByUrl(ClaimConstant.URI_CLAIM_LIST);
          });
        }
      });
    }
  }
  public generateBLWithoutReferenceDoc(){
    this.claimAddForm.controls['ReferenceOldDocument'].enable();
    this.array.controls['InteractionDate'].clearValidators();
      this.array.controls['InteractionDescription'].clearValidators();
      this.array.controls['IdInteractionType'].clearValidators();
      this.validationService.validateAllFormFields(this.claimAddForm);
      this.validationService.validateAllFormFields(this.array);
  }
}
