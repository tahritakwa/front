import {Component, OnDestroy, OnInit, ViewRef} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {DataSourceRequestState, process, State} from '@progress/kendo-data-query';
import {EnumValues} from 'enum-values';
import {Subscription} from 'rxjs/Subscription';
import {GrowlService} from '../../../../COM/Growl/growl.service';
import {MachineConstant} from '../../../constant/manufuctoring/machine.constant';
import {MachineSpareConstant} from '../../../constant/manufuctoring/machineSpare.constant';
import {NomenclaturesConstant} from '../../../constant/manufuctoring/nomenclature.constant';
import {PurchaseRequestConstant} from '../../../constant/purchase/purchase-request.constant';
import {ItemService} from '../../../inventory/services/item/item.service';
import {StateMachine} from '../../../models/enumerators/state-machine.enum';
import {Item} from '../../../models/inventory/item.model';
import {Machine} from '../../../models/manufacturing/machine.model';
import {SpareMachine} from '../../../models/manufacturing/spareMachine.model';
import {SwalWarring} from '../../../shared/components/swal/swal-popup';
import {ValidationService} from '../../../shared/services/validation/validation.service';
import {ColumnSettings} from '../../../shared/utils/column-settings.interface';
import {GridSettings} from '../../../shared/utils/grid-settings.interface';
import {MachineSpareService} from '../../service/machine-spare.service';
import {MachineService} from '../../service/machine.service';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {FamilyMachineEnum} from '../../../models/enumerators/family-machine.enum';
import {OperationModel} from '../../../models/manufacturing/operation.model';
import {OperationService} from '../../service/operation.service';
import {StyleConstant} from '../../../constant/utility/style.constant';
import {Operation} from '../../../../COM/Models/operations';
import {Company} from '../../../models/administration/company.model';
import {CompanyService} from '../../../administration/services/company/company.service';
import {UserService} from '../../../administration/services/user/user.service';
import {TypeMachineEnum} from '../../../models/enumerators/type-machine.enum';
import {FileInfo} from '../../../models/shared/objectToSend';
import {DomSanitizer} from '@angular/platform-browser';


@Component({
  selector: 'app-add-machine',
  templateUrl: './add-machine.component.html',
  styleUrls: ['./add-machine.component.scss']
})
export class AddMachineComponent implements OnInit, OnDestroy {
  private subscription$: Subscription;
  public isUpdateMode = false;
  public machine = new Machine();
  public spareMachine: any;
  private editedRowIndex: number;
  public btnEditVisible: boolean;
  private item: Item = new Item();
  public productLineFormGroup: FormGroup;
  private idMachineOnUpdate: number;
  public rowSparesList: Array<{ id?: number, productId: string, machineId: any, description: string }> = [];
  public formGroup: FormGroup;
  public getTypesFromEnum = StateMachine;
  public getFamiliesFromEnum = FamilyMachineEnum;
  public getTypeMachineFromEnum = TypeMachineEnum;
  public typesList: any;
  public familiesList: any;
  public typeMachineList: any;
  viewRef: ViewRef;
  public rowCost: any[] = [];
  public listOperations: any[] = [];
  public machineOperations: any[] = [];
  public machineReference;
  public currency: any;
  public listUsers: any[] = [];
  public selectedUsers: any;
  public machineImageFile: any;
  public machineImageBase64Picture: any;
  public pictureMachineSrc: any;
  public pictureFileInfo: FileInfo;
  public pathPicture;
  private currentFileUpload: File;

  /*update image */
  changePicture = false;
  imageData: string = null;

  getBase64File(fileName) {
    if (fileName !== null) {
      this.machineService.getJavaGenericService().getFile('getmachineimage?fileName=' + fileName).subscribe(response => {
        if (response.base64File !== '') {
          this.imageData = 'data:image/' + (response.name).split('?')[0].split('.').pop() + ';base64,' + response.base64File;
        } else {
          this.imageData = null;
        }
      });
    } else {
      this.imageData = null;
    }
  }

  displayFile(base64Picture, file) {
    this.machineImageFile = file;
    this.machineImageBase64Picture = base64Picture;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e: any) => {
      this.pictureFileInfo = new FileInfo();
      this.pictureFileInfo.Name = file.name;
      this.pictureFileInfo.Extension = file.type;
      this.pictureFileInfo.FileData = reader.result.split(',')[1];
      this.pictureMachineSrc = reader.result;
      this.changePicture = true;
    };
  }

  saveMachineImage(base64Picture, file) {
    this.machineService.getJavaGenericService().uploadFile('uploadmachineimage', {
      'base64File': base64Picture,
      'name': file.name,
      'directoryName': 'machinePictureStore'
    }).subscribe((data: String) => {
      if (data !== null) {
        this.pathPicture = data;
        this.saveMachine();
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e: any) => {
          this.pictureFileInfo = new FileInfo();
          this.pictureFileInfo.Name = file.name;
          this.pictureFileInfo.Extension = file.type;
          this.pictureFileInfo.FileData = reader.result.split(',')[1];
          this.pictureMachineSrc = reader.result;
        };
      }
    });
  }

  public uploadPictureFile(event) {
    if (event.target.files[0].size > MachineConstant.MACHINE_IMAGE_MAX_SIZE) {
      this.growlService.ErrorNotification(this.translate.instant(MachineConstant.INVALID_MACHINE_SIZE, {maxSize: NumberConstant.ONE}));
    } else {
      this.currentFileUpload = event.target.files[0];
      if (this.currentFileUpload) {
        const reader = new FileReader();
        reader.readAsBinaryString(this.currentFileUpload);
        this.handleInputChange(this.currentFileUpload);
      }
    }
  }

  handleInputChange(file) {
    const pattern = /image-*/;
    const reader = new FileReader();
    if (!file.type.match(pattern)) {
      alert('invalid format');
      return;
    }
    reader.onloadend = this._handleReaderLoaded.bind(this, file);
    reader.readAsDataURL(file);
  }

  _handleReaderLoaded(file, e) {
    const reader = e.target;
    const base64result = reader.result.substr(reader.result.indexOf(',') + 1);

    if (base64result !== undefined) {
      this.displayFile(base64result, file);
    }
  }

  public gridStateSpares: DataSourceRequestState = {
    skip: 0,
    take: 10,
    filter: {
      logic: 'and',
      filters: []
    }
  };

  public gridData: any = process(this.rowSparesList, this.gridStateSpares);
  public columnsConfigSpares: ColumnSettings[] = [
    {
      field: MachineSpareConstant.SPARES_NAME_FILIED,
      title: MachineSpareConstant.SPARE_NAME_TITLE,
      filterable: true,
    }
  ];

  public gridSettingsSpares: GridSettings = {
    state: this.gridStateSpares,
    columnsConfig: this.columnsConfigSpares
  };


  constructor(
    public sanitizer: DomSanitizer,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private validationService: ValidationService,
    private translate: TranslateService,
    private machineService: MachineService,
    private itemService: ItemService,
    private swalWarrings: SwalWarring,
    private machineSpareService: MachineSpareService,
    private operationService: OperationService,
    public companyService: CompanyService,
    private growlService: GrowlService) {
    this.activatedRoute.params.subscribe(params => {
      this.idMachineOnUpdate = +params['id'] || 0;
    });

    this.getTypesList();
    this.getFamiliesList();
    this.getTypeMachineList();
    this.formGroup = new FormGroup({
      reference: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      machineImage: new FormControl(''),
      brand: new FormControl(''),
      serialNumber: new FormControl(''),
      typeMachine: new FormControl(''),
      stateMachine: new FormControl('', Validators.required),
      IdResponsible: new FormControl('', Validators.required),
      costPerHour: new FormControl('', Validators.required),
      familyMachine: new FormControl('', Validators.required),
      price: new FormControl('', Validators.required),
      purchaseDate: new FormControl('', Validators.required),
      endDateAmortisation: new FormControl('', Validators.required),
      periodAmortisation: new FormControl('', [Validators.required, Validators.min(NumberConstant.ZERO), Validators.max(NumberConstant.ONE_HUNDRED)]),
    });
  }

  public addHandler({sender}) {
    this.closeEditor(sender);
    this.createProductLineForm(new SpareMachine());
    sender.addRow(this.productLineFormGroup);
    this.btnEditVisible = false;
  }

  public editHandler({sender, rowIndex, dataItem}) {
    this.closeEditor(sender);
    this.closeEditor(sender, -1);
    this.editedRowIndex = rowIndex;
    this.productLineFormGroup = new FormGroup({
      IdItem: new FormControl(dataItem.productId, Validators.required),
    });
    sender.editRow(rowIndex, this.productLineFormGroup);
    this.btnEditVisible = true;
  }

  public cancelHandler({sender, rowIndex}) {
    this.closeEditor(sender, rowIndex);
    this.btnEditVisible = true;
  }

  public saveHandler({sender, rowIndex, formGroup, isNew}) {
    if (this.productLineFormGroup.valid) {
      this.itemService.getById(formGroup.value.IdItem
      ).subscribe(res => {
        if ((this.rowSparesList.find(item => item.productId === formGroup.value.IdItem) === undefined)) {
          if (isNew) {
            this.saveNewHandler(formGroup, res);

          } else {
            this.saveExistedHandler(formGroup, rowIndex, res);

          }
        } else {
          this.growlService.ErrorNotification(this.translate.instant(MachineConstant.EXIST_SPARE));
        }
      });
      sender.closeRow(rowIndex);
    } else {
      this.validationService.validateAllFormFields(this.productLineFormGroup);
    }

  }

  saveExistedHandler(formGroup, rowIndex, res) {
    this.rowSparesList.find(item => this.rowSparesList.indexOf(item) === rowIndex).productId = formGroup.value.IdItem;
    this.rowSparesList.find(item => this.rowSparesList.indexOf(item) === rowIndex).description = res.Description;
    if (this.idMachineOnUpdate > 0) {
      this.machineSpareService.getJavaGenericService().updateEntity(
        {
          id: this.rowSparesList[rowIndex].id,
          machineId: this.idMachineOnUpdate,
          productId: formGroup.value.IdItem,
        }, this.rowSparesList[rowIndex].id, '').subscribe();
    }
  }

  saveNewHandler(formGroup, res) {
    if (this.idMachineOnUpdate > 0) {
      this.machineSpareService.getJavaGenericService().saveEntity(
        {
          machineId: this.idMachineOnUpdate,
          productId: formGroup.value.IdItem
        }, '')
        .subscribe(result => {
          this.rowSparesList.push({
            id: result.id,
            productId: formGroup.value.IdItem,
            machineId: this.idMachineOnUpdate,
            description: res.Description
          });
          this.dataStateChange(this.gridStateSpares);
        });
    } else {
      this.rowSparesList.push({
        productId: formGroup.value.IdItem,
        machineId: this.idMachineOnUpdate,
        description: res.Description
      });
    }

  }


  private closeEditor(grid: { closeRow: (arg0: number) => void; }, rowIndex = this.editedRowIndex) {
    if (rowIndex !== undefined) {
      grid.closeRow(rowIndex);
      this.editedRowIndex = undefined;
      this.productLineFormGroup = undefined;
    }
  }

  /*
  * retrieve list of ennumartions of state machine
   */
  getTypesList() {
    this.typesList = EnumValues.getNamesAndValues(this.getTypesFromEnum);
  }

  getFamiliesList() {
    this.familiesList = EnumValues.getNames(this.getFamiliesFromEnum).map((type: any) => {
      return type = {enumValue: type, enumText: this.translate.instant(type)};
    });
  }

  getTypeMachineList() {
    this.typeMachineList = EnumValues.getNames(this.getTypeMachineFromEnum).map((type: any) => {
      return type = {enumValue: type, enumText: this.translate.instant(type)};
    });
  }

  /*
 * prepare spareMachineForm for machine
  */
  private createProductLineForm(spareMachine?: SpareMachine): void {
    this.productLineFormGroup = new FormGroup({
      IdItem: new FormControl(spareMachine.productId, Validators.required),

    });
  }

  /*
 *remove spare part from machine  in database
  */
  public removeSpareHandler(event: any) {

    this.swalWarrings.CreateSwal().then((result) => {
      if (result.value) {
        if (this.idMachineOnUpdate > NumberConstant.ZERO) {
          this.subscription$ = this.machineSpareService.getJavaGenericService()
            .deleteEntity(event.dataItem.id, MachineSpareConstant.MACHINESPARE_URL)
            .subscribe(() => {
              this.growlService.successNotification(this.translate.instant(NomenclaturesConstant.SUCCESS_OPERATION));
              const index: number = this.rowSparesList.indexOf(event.dataItem);
              if (index !== NumberConstant.MINUS_ONE) {
                this.rowSparesList.splice(index, NumberConstant.ONE);
              }
              this.dataStateChange(this.gridStateSpares);
            }, () => {
              this.growlService.ErrorNotification(this.translate.instant(NomenclaturesConstant.FAILURE_OPERATION));
            });
        } else {
          const index: number = this.rowSparesList.indexOf(event.dataItem);
          if (index !== -1) {
            this.rowSparesList.splice(index, 1);
          }
          this.dataStateChange(this.gridStateSpares);
        }
      }
    });
  }


  public dataStateChange(state: State): void {
    this.gridStateSpares = state;
    this.gridData = process(this.rowSparesList, this.gridStateSpares);
  }


  /* Item drpodown change value*/
  itemSelect($event) {
    if ($event) {
      if ($event.itemFiltredDataSource && $event.itemForm && $event.itemForm.value[PurchaseRequestConstant.ID_ITEM]) {
        const itemValue: any[] =
          ($event.itemFiltredDataSource.filter(c => c.Id === $event.itemForm.value[PurchaseRequestConstant.ID_ITEM]));
        if (itemValue && itemValue.length > 0) {
          this.item = itemValue[0];
          this.formGroup.patchValue({
            IdItem: this.item.Id
          });
        }
      }
    }
  }

  /* Item drpodown from LineProduct form change value*/
  itemSelectProductLineForm($event) {
    if ($event) {
      if ($event.itemFiltredDataSource && $event.itemForm && $event.itemForm.value[PurchaseRequestConstant.ID_ITEM]) {
        const itemValue: any[] = ($event.itemFiltredDataSource.filter(c => c.Id === $event.itemForm.value[PurchaseRequestConstant.ID_ITEM]));
        if (itemValue && itemValue.length > 0) {
          this.item = itemValue[0];
        }
      }
    }
  }


  // save new machine

  public saveMachineClick() {
    if (this.formGroup.valid) {
      this.subscription$ = this.machineService.getJavaGenericService()
        .saveEntity({
          reference: this.machineReference,
          description: this.formGroup.value.description,
          sectionId: null,
          operations: this.machineOperations,
          responsibleId: this.formGroup.value.IdResponsible,
          stateMachine: MachineConstant.AVAILABLE,
          costPerHour: this.formGroup.value.costPerHour,
          typeMachine: this.formGroup.value.typeMachine === '' ? null : this.formGroup.value.typeMachine,
          machineImage: this.pathPicture ? this.pathPicture : null,
          serialNumber: this.formGroup.value.serialNumber,
          brand: this.formGroup.value.brand,
          familyMachine: this.formGroup.value.familyMachine,
          price: this.formGroup.value.price,
          purchaseDate: this.formGroup.value.purchaseDate,
          periodAmortisation: this.formGroup.value.periodAmortisation,
          endDateAmortisation: this.formGroup.value.endDateAmortisation,
        }, '')
        .subscribe(data => {
          this.rowSparesList.forEach(x => {
            this.machineSpareService.getJavaGenericService().saveEntity(
              {
                machineId: data.id,
                productId: x.productId
              }, '')
              .subscribe();
          });
          this.growlService.successNotification(this.translate.instant(NomenclaturesConstant.SUCCESS_OPERATION));
          this.router.navigateByUrl(MachineConstant.URI_MACHINES);
        });
    } else {
      this.displayValidator();
      this.validationService.validateAllFormFields(this.formGroup);
    }
  }

  public displayValidator(): void {
    let invalidFields = '';
    Object.keys(this.formGroup.controls)
      .forEach(field => {
        const control = this.formGroup.get(field);
        if (control.status === 'INVALID' && (field === 'description' || field === 'IdResponsible'
          || field === 'familyMachine' || field === 'periodAmortisation' || field === 'price')) {
          field = this.translateMachineFields(field);
          invalidFields += ' ' + field + ',';
        }
      });
    if (invalidFields.split(',').length > NumberConstant.TWO) {
      this.growlService.ErrorNotification(this.translate.instant(MachineConstant.FAIL_MULTIPLE_VALIDATION_PART_ONE) +
        invalidFields + this.translate.instant(MachineConstant.FAIL_MULTIPLE_VALIDATION_PART_TWO));
    } else {
      this.growlService.ErrorNotification(this.translate.instant(MachineConstant.FAIL_VALIDATION_PART_ONE) + invalidFields
        + this.translate.instant(MachineConstant.FAIL_VALIDATION_PART_TWO));
    }
  }

  translateMachineFields(field): string {
    let translatedField = '';
    switch (field) {
      case 'description' :
        translatedField = this.translate.instant(MachineConstant.MACHINE_DESCRIPTION_FIELD);
        break;
      case 'IdResponsible' :
        translatedField = this.translate.instant(MachineConstant.MACHINE_RESPONSIBLE_FIELD);
        break;
      case 'familyMachine' :
        translatedField = this.translate.instant(MachineConstant.MACHINE_FAMILY_FIELD);
        break;
      case 'periodAmortisation' :
        translatedField = this.translate.instant(MachineConstant.MACHINE_DATE_AMORTISATION_FIELD);
        break;
      case 'price' :
        translatedField = this.translate.instant(MachineConstant.MACHINE_COST_FIELD);
        break;
      default :
        return;
    }
    return translatedField;
  }

  public editMachineClick() {
    if (this.formGroup.valid) {
      this.subscription$ = this.machineService.getJavaGenericService().updateEntity(
        {
          id: this.idMachineOnUpdate,
          reference: this.formGroup.value.reference,
          description: this.formGroup.value.description,
          sectionId: this.formGroup.value.sectionId,
          operations: this.machineOperations,
          responsibleId: this.formGroup.value.IdResponsible,
          stateMachine: this.formGroup.value.stateMachine,
          costPerHour: this.formGroup.value.costPerHour,
          machineImage: this.changePicture ? this.pathPicture : this.formGroup.value.machineImage,
          typeMachine: this.formGroup.value.typeMachine === '' ? null : this.formGroup.value.typeMachine,
          serialNumber: this.formGroup.value.serialNumber,
          brand: this.formGroup.value.brand,
          familyMachine: this.formGroup.value.familyMachine,
          price: this.formGroup.value.price,
          purchaseDate: this.formGroup.value.purchaseDate,
          periodAmortisation: this.formGroup.value.periodAmortisation,
          endDateAmortisation: this.formGroup.value.endDateAmortisation,
        },
        this.idMachineOnUpdate, MachineConstant.MACHINE_URL)
        .subscribe((data) => {
          this.growlService.successNotification(this.translate.instant(NomenclaturesConstant.SUCCESS_OPERATION));
          this.router.navigateByUrl(MachineConstant.URI_MACHINES);
        });
    } else {
      this.growlService.ErrorNotification(this.translate.instant(MachineConstant.FAIL_FORM_VALIDATION));
      this.validationService.validateAllFormFields(this.formGroup);
    }
  }

  ngOnDestroy(): void {
    if (this.subscription$) {
      this.subscription$.unsubscribe();
    }
  }


  /*
   * in this method we define update or save through idMachineOnUpdate
   */
  ngOnInit() {

    this.userService.getAllUserWithoutState().subscribe(result => {
      this.listUsers = result.data;
    });
    this.getCurrency();
    this.operationService.getJavaGenericService().getEntityList().subscribe(result => {
      if (result && result.length > 0) {
        this.listOperations = result;
      }
    });
    if (this.idMachineOnUpdate > 0) {
      this.isUpdateMode = true;
      this.subscription$ = this.machineService.getJavaGenericService()
        .getEntityById(this.idMachineOnUpdate, MachineConstant.MACHINE_URL)
        .subscribe(data => {
          this.machine = data;
          this.machine.operations.forEach(op => {
            this.machineOperations.push(op);
          });
          if (this.machine.machineImage) {
            this.getBase64File(this.machine.machineImage);
          }
          this.formGroup.patchValue({
            reference: this.machine.reference,
            description: this.machine.description,
            stateMachine: this.machine.stateMachine,
            IdResponsible: this.machine.responsibleId,
            costPerHour: this.machine.costPerHour,
            machineImage: this.machine.machineImage,
            typeMachine: this.machine.typeMachine,
            serialNumber: this.machine.serialNumber,
            brand: this.machine.brand,
            familyMachine: this.machine.familyMachine,
            price: this.machine.price,
            purchaseDate: new Date(this.machine.purchaseDate),
            endDateAmortisation: new Date(this.machine.endDateAmortisation),
            periodAmortisation: this.machine.periodAmortisation,
          });
          this.rowCost.push(this.formGroup.value);
        });

      this.subscription$ = this.machineSpareService.getJavaGenericService()
        .getEntityById(this.idMachineOnUpdate, MachineSpareConstant.GET_SPARE_BY_MACHINE)
        .subscribe(result => {
          result.forEach(x => {
            this.itemService.getById(x.productId).subscribe(res => {
              x.description = res.Description + ' ' + res.Code;
            });

          });
          this.rowSparesList = result;
        });

    } else {

      this.rowCost.push({});
      const machine = new Machine();
      this.formGroup = new FormGroup({
        'reference': new FormControl(machine.reference, Validators.required),
        'description': new FormControl(machine.description, Validators.required),
        'IdResponsible': new FormControl('', Validators.required),
        'costPerHour': new FormControl(machine.costPerHour, Validators.required),
        'machineImage': new FormControl(''),
        'brand': new FormControl(''),
        'serialNumber': new FormControl(''),
        'typeMachine': new FormControl(''),
        'familyMachine': new FormControl(machine.familyMachine, Validators.required),
        machineSpare: new FormControl(this.rowSparesList),
        price: new FormControl('', Validators.required),
        purchaseDate: new FormControl('', Validators.required),
        endDateAmortisation: new FormControl('', Validators.required),
        periodAmortisation: new FormControl('', Validators.required),
      });
      this.formGroup.patchValue({
        purchaseDate: new Date()
      });
      this.getLastReference();
    }
  }

  save() {
    if (this.changePicture && this.machineImageBase64Picture && this.machineImageFile) {
      this.saveMachineImage(this.machineImageBase64Picture, this.machineImageFile);
    } else {
      this.saveMachine();
    }
  }

  saveMachine() {
    if (this.isUpdateMode) {
      this.editMachineClick();
    } else {
      this.saveMachineClick();
    }
  }

  calculateCost() {
    const price = this.formGroup.value.price;
    const periodAmortisation = this.formGroup.value.periodAmortisation;
    const purchaseDate = this.formGroup.value.purchaseDate;
    if (periodAmortisation && purchaseDate) {
      this.formGroup.controls[MachineConstant.END_DATE_AMORTISATION].setValue(new Date(purchaseDate.getFullYear() + periodAmortisation,
        purchaseDate.getMonth(), purchaseDate.getDay()));
    }
    if (periodAmortisation && purchaseDate && price) {
      this.formGroup.controls[MachineConstant.COST].patchValue((((price / periodAmortisation) / 365) / 24).toFixed(4));
      this.rowCost = [];
      this.rowCost.push(this.formGroup.value);
    }
  }

  editCostHandler({sender, rowIndex, dataItem}) {
    sender.editRow(rowIndex, this.formGroup);
    this.btnEditVisible = true;
  }

  cancelCostHandler({sender, rowIndex}) {
    this.closeCostEditor(sender, rowIndex);
    this.btnEditVisible = true;
  }

  private closeCostEditor(grid: { closeRow: (arg0: number) => void; }, rowIndex = this.editedRowIndex) {
    if (rowIndex !== undefined) {
      grid.closeRow(rowIndex);
    }
  }

  public saveCostHandler({sender, rowIndex, formGroup, isNew}) {
    this.calculateCost();
    sender.closeRow(rowIndex);
  }

  private getLastReference() {
    this.machineService.callService(Operation.GET, 'get-last-reference').subscribe((result) => {
      this.machineReference = result;
      this.formGroup.controls['reference'].patchValue(result);
      this.formGroup.controls['reference'].disable();
    });

  }

  getCurrency() {
    this.companyService.getCurrentCompanyWithContactPictures().subscribe((data: Company) => {
      this.currency = data.IdCurrencyNavigation.Code;
    });
  }

  checkPositive(e, input) {
    const keyValue = +e.key;
    const numberOnlyPattern = '[0-9]+';
    const newValue = input.value + (isNaN(keyValue) ? '' : keyValue.toString());
    const match = newValue.match(numberOnlyPattern);
    if (!match) {
      e.preventDefault();
    }
  }
}

