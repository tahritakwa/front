import {Component, ComponentRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewContainerRef} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {PredicateFormat} from '../../../../shared/utils/predicate';
import {UserService} from '../../../../administration/services/user/user.service';
import {ActionConstant} from '../../../../constant/crm/action.constant';
import {EventDateModel} from '../../../../models/crm/eventDate.model';
import {TranslateService} from '@ngx-translate/core';
import {ActionService} from '../../../services/action/action.service';
import {PermissionService} from '../../../services/permission/permission.service';
import {dateValueGT, dateValueLT, ValidationService} from '../../../../shared/services/validation/validation.service';
import {ContactCrmService} from '../../../services/contactCrmService/contact-crm.service';
import {OpportunityService} from '../../../services/opportunity.service';
import {ModalDialogInstanceService} from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import {ExactDate} from '../../../../shared/helpers/exactDate';
import {OrganisationService} from '../../../services/organisation/organisation.service';
import {GenericCrmService} from '../../../generic-crm.service';
import {GrowlService} from '../../../../../COM/Growl/growl.service';
import {Router} from '@angular/router';
import {FormModalDialogService} from '../../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import {LeaveService} from '../../../../payroll/services/leave/leave.service';
import {DatePipe} from '@angular/common';
import {TiersService} from '../../../../purchase/services/tiers/tiers.service';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import {NumberConstant} from '../../../../constant/utility/number.constant';
import {EventService} from '../../../services/event/event.service';
import {Address} from '../../../../models/crm/address.model';
import {LocalStorageService} from '../../../../login/Authentification/services/local-storage-service';
import {IModalDialog, IModalDialogOptions} from 'ngx-modal-dialog';
import {SharedCrmConstant} from '../../../../constant/crm/sharedCrm.constant';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit, IModalDialog, OnDestroy {

  public addFormGroup: FormGroup;
  public selectedUsers: any = [];
  public typeList: any = ['Foire', 'Séminaire', 'salon', 'autres'];
  public listUsers = [];
  public listUsersFilter = [];
  public predicate: PredicateFormat;
  private connectedUser: any;
  public formatDate: string = this.localStorageService.getFormatDate();
  public eventToSave = new EventDateModel();
  public isModal;
  dialogVisible: boolean;

  markerTitle: string;

  selectedPosition: any;

  infoWindow: any;

  draggable: boolean;

  options: any;
  public relatedActionsPermissions: any;
  overlays: any[];
  public parentPermission = 'ADD_EVENT';
  public uuid = Math.floor(Math.random() * NumberConstant.ONE_THOUSAND);
  @Input() selectedDate;
  @Input() eventToSaveFromCalendar: Observable<any>;
  @Input() eventToCloseFromCalendar: Observable<any>;
  @Output() saveIsDone = new EventEmitter<boolean>();
  private saveEventSubscription: Subscription;
  private closeEventSubscription: Subscription;

  latitude: number = 18.5204;
  longitude: number = 73.8567;

  map: any;
  public optionDialog: Partial<IModalDialogOptions<any>>;
  public eventData: EventComponent;
  stardDateFromPopup: any;
  endDateFromPopup: any;
  public idToUpdate;
  public idAddressUpdate;
  private assignedTo: any;

  constructor(private userService: UserService,
              private fb: FormBuilder,
              private translate: TranslateService,
              private eventService: EventService,
              private actionService: ActionService,
              private permissionService: PermissionService,
              private validationService: ValidationService,
              private contactService: ContactCrmService,
              private opportunitiesService: OpportunityService,
              private viewRef: ViewContainerRef,
              private modalService: ModalDialogInstanceService,
              private exactDate: ExactDate,
              private organizationService: OrganisationService,
              public genericCrmService: GenericCrmService,
              private growlService: GrowlService,
              private router: Router,
              private formModalDialogService: FormModalDialogService,
              private leaveService: LeaveService,
              private datePipe: DatePipe,
              private translateService: TranslateService,
              private tiersService: TiersService,
              private localStorageService: LocalStorageService) {
  }

  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.optionDialog = options;
    this.isModal = true;
    this.eventData = this.optionDialog.data.eventData;
  }

  ngOnInit() {
    this.createAddForm();
    this.getConnectedUser();
    this.loadIndividualUsersList();
    this.initSaveReminderEvent();
    this.selectedPermission();
    if (this.isModal) {
      this.addFormGroup.patchValue(this.eventData);
      // @ts-ignore
      this.idAddressUpdate = this.eventData.address.id;
      // @ts-ignore
      this.idToUpdate = this.eventData.id;
      this.stardDateFromPopup = this.eventData.startDate;
      this.endDateFromPopup = this.eventData.endDate;
      this.addFormGroup.controls['startDate'].setValue(new Date(this.stardDateFromPopup));
      this.addFormGroup.controls['endDate'].setValue(new Date(this.endDateFromPopup));
      this.addFormGroup.controls['startTime'].setValue(new Date(this.stardDateFromPopup));
      this.addFormGroup.controls['endTime'].setValue(new Date(this.endDateFromPopup));
      this.addFormGroup.controls['endTime'].setValue(new Date(this.endDateFromPopup));
      // @ts-ignore
      this.setAddressFromPopup(this.eventData.address);
    }
  }

  setAddressFromPopup(address) {
    if ((address.latitude != undefined) && (address.longitude != undefined)) {
      this.addFormGroup.patchValue({
        'city': address.city,
        'country': address.country,
        'lat': address.latitude,
        'lng': address.longitude,
        'address_line': address.addressLine,
        'postal_code': address.zipCode


      });
      this.clear();
      this.overlays.push(new google.maps.Marker({
        position: {lat: address.latitude, lng: address.longitude},
        title: this.markerTitle,
        draggable: this.draggable
      }));
    }
  }

  private createAddForm(): void {
    this.addFormGroup = this.fb.group({
      name: ['', [Validators.required]],
      employeesPermittedTo: [''],
      type: [''],
      startTime: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      endTime: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      deadLine: [''],
      city: [''],
      country: [''],
      address_line: [''],
      postal_code: [''],
      lat: [''],
      lng: [''],
      commercialAssignedToId: ['']
    });
    this.addDatesDependenceControls();
  }

  setAddress(form: FormGroup) {
    let address: Address = new Address();
    address.zipCode = form.value.postal_code;
    address.city = form.value.city;
    address.country = form.value.country;
    address.latitude = form.value.lat;
    address.longitude = form.value.lng;
    address.addressLine = form.value.address_line;
    if (this.idAddressUpdate) {
      address.id = this.idAddressUpdate;
    }
    this.eventToSave.address = address;
  }

  convertActionFormToAction(form: FormGroup) {
    this.eventToSave = form.value;
    this.setAddress(form);
    this.setDates();
    return this.eventToSave;
  }

  save() {
    if (this.addFormGroup.valid) {
      const eventToSave = this.convertActionFormToAction(this.addFormGroup);

      this.eventService.getJavaGenericService().saveEntity(eventToSave)
        .subscribe((data) => {


          this.permissionService.savePermission(this.relatedActionsPermissions, 'EVENT', data.id)
            .subscribe(() => {

              this.growlService.successNotification(this.translate.instant(ActionConstant.SUCCESS_OPERATION));
              this.saveIsDone.emit(true);
            });


        });
    } else {
      this.validationService.validateAllFormFields(this.addFormGroup);
    }
  }

  update() {
    if (this.addFormGroup.valid) {
      const eventToSave = this.convertActionFormToAction(this.addFormGroup);
      this.eventService.getJavaGenericService().updateEntity(eventToSave, this.idToUpdate)
        .subscribe((data) => {
          if (data) {
            this.onBackToListOrCancel();
          }
        });

    }
  }

  getConnectedUser() {
    this.connectedUser = this.localStorageService.getUser();
  }

  loadIndividualUsersList() {
    this.predicate = PredicateFormat.prepareEmptyPredicate();
    this.userService.processDataServerSide(this.predicate).subscribe(data => {
      this.listUsers = data.data;
      this.listUsersFilter = data.data;
      this.filterUsers();
    });
  }

  get startDate(): FormControl {
    return this.addFormGroup.get(ActionConstant.START_DATE_FORM_CONTROL) as FormControl;
  }

  get endDate(): FormControl {
    return this.addFormGroup.get(ActionConstant.END_DATE_FORM_CONTROL) as FormControl;
  }

  get startTime(): FormControl {
    return this.addFormGroup.get(ActionConstant.START_TIME_FORM_CONTROL) as FormControl;
  }

  get endTime(): FormControl {
    return this.addFormGroup.get(ActionConstant.END_TIME_FORM_CONTROL) as FormControl;
  }

  onBackToListOrCancel() {
    if (!this.isModal) {
      this.router.navigateByUrl(ActionConstant.ACTIONS_LIST);
    } else {
      this.modalService.closeAnyExistingModalDialog();
    }
  }

  private initSaveReminderEvent() {

    if (this.eventToSaveFromCalendar) {

      this.saveEventSubscription = this.eventToSaveFromCalendar.subscribe((data) => {
        {

          this.save();
        }
      });
    }
  }


  handleMapClick(event) {
    this.dialogVisible = true;
    this.selectedPosition = event.latLng;
    this.addMarker();
  }

  handleOverlayClick(event) {

    // tslint:disable-next-line:triple-equals
    const isMarker = event.overlay.getTitle != undefined;

    if (isMarker) {
      const title = event.overlay.getTitle();
      this.infoWindow.setContent('' + title + '');
      this.infoWindow.open(event.map, event.overlay);
      event.map.setCenter(event.overlay.getPosition());

    } else {
    }
  }

  addMarker() {
    this.clear();
    this.overlays.push(new google.maps.Marker({
      position: {lat: this.selectedPosition.lat(), lng: this.selectedPosition.lng()},
      title: this.markerTitle,
      draggable: this.draggable
    }));
    this.markerTitle = null;
    this.dialogVisible = false;
    this.eventService.getAllAddress(this.selectedPosition.lat(), this.selectedPosition.lng()).subscribe(
      (e) => {
        this.addFormGroup.controls['city'].setValue(e.address.city);
        this.addFormGroup.controls['address_line'].setValue(e.address.region);
        this.addFormGroup.controls['country'].setValue(e.address.country);
        this.addFormGroup.controls['postal_code'].setValue(e.address.postcode);
        this.addFormGroup.controls['lat'].setValue(e.lat);
        this.addFormGroup.controls['lng'].setValue(e.lon);
      }
    );
  }

  handleDragEnd(event) {
  }

  initOverlays() {
    if (!this.overlays || !this.overlays.length) {
      this.overlays = [];
    }
  }

  zoomIn(map) {
    map.setZoom(map.getZoom() + 1);
  }

  zoomOut(map) {
    map.setZoom(map.getZoom() - 1);
  }

  clear() {
    this.overlays = [];
  }

  selectedPermission() {
    this.permissionService.getResult().subscribe(data => {
      if (data && data.permission && (data.parent === this.parentPermission)) {
        this.relatedActionsPermissions = data.permission;
      }
    });
  }

  setStartTime() {
    const startTime = new Date(this.addFormGroup.controls['startTime'].value);
    const startDate = new Date(this.addFormGroup.controls['startDate'].value);
    if (startTime.getDate()) {
      this.eventToSave.startDate = this.exactDate.getDateExact(new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(),
        startTime.getHours(), startTime.getMinutes()));
    } else {
      this.eventToSave.startDate = this.exactDate.getDateExact(new Date(startDate.getFullYear(),
        startDate.getMonth(), startDate.getDate()));
    }
  }

  setEndTime() {
    const endTime = new Date(this.addFormGroup.controls['endTime'].value);
    const endDate = new Date(this.addFormGroup.controls['endDate'].value);
    this.eventToSave.endDate = this.exactDate.getDateExact(new Date(endDate.getFullYear(), endDate.getMonth(),
      endDate.getDate(), endTime.getHours(), endTime.getMinutes()));
  }

  setDeadline() {
    this.eventToSave.deadLine = this.addFormGroup.value.deadLine ?
      this.exactDate.getDateExact(new Date(this.addFormGroup.value.deadLine)) : null;
  }

  setDates() {
    this.setStartTime();
    this.setEndTime();
    this.setDeadline();
  }

  private addDatesDependenceControls(): void {
    this.startDate.setValidators([Validators.required,
      dateValueLT(new Observable(o => o.next(this.endDate.value)))]);
    this.endDate.setValidators([Validators.required,
      dateValueGT(new Observable(o => o.next(this.startDate.value)))
    ]);
  }

  ngOnDestroy(): void {
    if (this.saveEventSubscription) {
      this.saveEventSubscription.unsubscribe();
    }
  }

  filterUsers() {
    this.listUsersFilter = this.listUsersFilter.filter(responsable => responsable.FullName != null);
    this.removeDuplicateUsers();
    this.listUsers = this.listUsersFilter;
  }

  removeDuplicateUsers() {
    this.listUsersFilter = this.listUsersFilter.reduce((a, b) => {
      if (!a.find(data => data.Email === b.Email)) {
        a.push(b);
      }
      return a;
    }, []);
  }

  handleResponsablesFilter(userSearched) {
    this.listUsers = this.listUsersFilter.filter(responsable => responsable.FullName.toLowerCase()
      .includes(userSearched.toLowerCase()));
  }

}
