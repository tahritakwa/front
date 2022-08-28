import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {DataSourceRequestState, process, State} from '@progress/kendo-data-query';
import {EnumValues} from 'enum-values';
import {Subscription} from 'rxjs/Subscription';
import {GrowlService} from '../../../../COM/Growl/growl.service';
import {MachineConstant} from '../../../constant/manufuctoring/machine.constant';
import {StateMachine} from '../../../models/enumerators/state-machine.enum';
import {Machine} from '../../../models/manufacturing/machine.model';
import {ValidationService} from '../../../shared/services/validation/validation.service';
import {ColumnSettings} from '../../../shared/utils/column-settings.interface';
import {GridSettings} from '../../../shared/utils/grid-settings.interface';
import {MachineService} from '../../service/machine.service';
import {SectionService} from '../../service/section.service';
import {SectionConstant} from '../../../constant/manufuctoring/section.constant';
import {Section} from '../../../models/manufacturing/section.model';
import {RowClassArgs} from '@progress/kendo-angular-grid';
import {EmployeeService} from '../../../payroll/services/employee/employee.service';
import {NomenclaturesConstant} from '../../../constant/manufuctoring/nomenclature.constant';
import {GammeConstant} from '../../../constant/manufuctoring/gamme.constant';
import {SwalWarring} from '../../../shared/components/swal/swal-popup';

@Component({
  selector: 'app-add-machine',
  templateUrl: './add-section.component.html',
  styleUrls: ['./add-section.component.scss']
})
export class AddSectionComponent implements OnInit, OnDestroy {
  public isUpdateMode = false;
  public formGroup: FormGroup;
  private idSectionOnUpdate: number;
  private subscription$: Subscription;
  public currentArea: any;
  public rowMachinesList: Array<any> = [];
  public machinesListToSave: Array<any> = [];
  public section = new Section();
  public machineFormGroup: FormGroup;
  public btnEditVisible: boolean;
  private editedRowIndex: number;
  public typesList: any;
  public getTypesFromEnum = StateMachine;
  selectedMachine: any;

  public gridStateSections: DataSourceRequestState = {
    skip: 0,
    take: 10,
    filter: {
      logic: 'and',
      filters: []
    }
  };

  public gridData: any = process(this.rowMachinesList, this.gridStateSections);

  public columnsConfigMachines: ColumnSettings[] = [
    {
      field: MachineConstant.DESCRPTION_FIELD,
      title: MachineConstant.MACHINE_TITLE,
      filterable: true,
    },
    {
      field: MachineConstant.COST,
      title: MachineConstant.COST_PER_HOUR,
      filterable: true
    },
    {
      field: MachineConstant.RESPONSIBLE_NAME,
      title: MachineConstant.RESPONSIBLE_TITLE,
      filterable: true,
    },
    {
      field: MachineConstant.STATUS_FIELD,
      title: MachineConstant.STATUS_TITLE,
      filterable: true
    }
  ];

  public gridSettingsSections: GridSettings = {
    state: this.gridStateSections,
    columnsConfig: this.columnsConfigMachines
  };

  public isEditingMode = false;

  public rowCallback(context: RowClassArgs) {
    return {
      dragging: context.dataItem.dragging
    };
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private swalWarrings: SwalWarring,
    private validationService: ValidationService,
    private sectionService: SectionService,
    private translate: TranslateService,
    private machineService: MachineService,
    private employeeService: EmployeeService,
    private growlService: GrowlService) {
    this.activatedRoute.params.subscribe(params => {
      this.idSectionOnUpdate = +params['id'] || 0;
    });
    this.getTypesList();
    this.formGroup = new FormGroup({
      reference: new FormControl('', Validators.required),
      designation: new FormControl('', Validators.required),
      areaId: new FormControl('', Validators.required),
    });
  }

  getTypesList() {
    this.typesList = EnumValues.getNamesAndValues(this.getTypesFromEnum);
  }

  public dataStateChange(state: State): void {
    this.gridStateSections = state;
    this.gridData = process(this.rowMachinesList, this.gridStateSections);
  }

  initGridData() {
    if (this.idSectionOnUpdate > 0) {
      this.isUpdateMode = true;
    }
    this.subscription$ = this.sectionService.getJavaGenericService()
      .getEntityById(this.idSectionOnUpdate)
      .subscribe(data => {
        this.section = data;
        this.formGroup.patchValue({
          reference: this.section.reference,
          designation: this.section.designation,
          areaId: this.section.areaId
        });
      });
    this.subscription$ = this.machineService.getJavaGenericService()
      .getEntityById(this.idSectionOnUpdate, SectionConstant.GET_BY_SECTION_ID)
      .flatMap(result => {
        this.rowMachinesList = result;
        const idEmployees: Array<number> = [];
        result.forEach((element) => {
          idEmployees.push(element.responsibleId);
        });
        return this.employeeService.getEmployeesDetails(idEmployees);
      }).subscribe(employees => {
        this.rowMachinesList.map(machine => {
          employees.forEach((employee) => {
            if (employee.Id === machine.responsibleId) {
              machine.responsibleName = employee.FullName;
            }
          });
        });
        this.dataStateChange(this.gridStateSections);
      });
  }

  ngOnDestroy(): void {
    if (this.subscription$) {
      this.subscription$.unsubscribe();
    }
  }

  ngOnInit(): void {
    if (this.idSectionOnUpdate > 0) {
      this.initGridData();
    } else {
      const section = new Section();
      this.createSectionForm(section);
    }
  }

  editSectionClick() {
    if (this.formGroup.valid) {
      const sectionToUpdate = {
        reference: this.formGroup.value.reference,
        designation: this.formGroup.value.designation,
        areaId: this.formGroup.value.areaId
      };
      this.subscription$ = this.sectionService.getJavaGenericService()
        .updateEntity(sectionToUpdate, this.idSectionOnUpdate)
        .subscribe(() => {
          this.growlService.successNotification(this.translate.instant(SectionConstant.SUCCESS_OPERATION));
          this.router.navigateByUrl(SectionConstant.URL_LIST);
        });
    } else {
      this.validationService.validateAllFormFields(this.formGroup);
    }
  }

  saveSectionClick() {
    if (this.formGroup.valid) {
      const sectionToSave = {
        reference: this.formGroup.value.reference,
        designation: this.formGroup.value.designation,
        areaId: this.formGroup.value.areaId
      };
      this.subscription$ = this.sectionService.getJavaGenericService()
        .saveEntity(sectionToSave)
        .subscribe(data => {
          if (this.idSectionOnUpdate === 0) {
            this.rowMachinesList.forEach(machineToSave => {
              const machine = {
                id: machineToSave.id,
                description: machineToSave.description,
                costPerHour: machineToSave.costPerHour,
                sectionId: data.id,
                responsibleId: machineToSave.responsibleId,
                stateMachine: machineToSave.stateMachine,
              };
              this.machineService.getJavaGenericService().updateEntity(machine, machineToSave.id, MachineConstant.MACHINE_URL).subscribe();
            });
            this.growlService.successNotification(this.translate.instant(SectionConstant.SUCCESS_OPERATION));
            this.router.navigateByUrl(SectionConstant.URL_LIST);
          }
        });
    } else {
      this.validationService.validateAllFormFields(this.formGroup);
    }
  }

  save() {
    if (this.isUpdateMode) {
      this.editSectionClick();
    } else {
      this.saveSectionClick();
    }
  }

  selectedAreaId($event) {
    if ($event.areaFiltredList && $event.form && $event.form.value[MachineConstant.AREA_ID]) {
      this.currentArea = ($event.areaFiltredList.filter(c => c.id === $event.form.value[MachineConstant.AREA_ID])[0]);
      this.formGroup.controls[SectionConstant.AREA_ID].setValue(this.currentArea.designation);
    }
  }

  public addHandler({sender}) {
    this.closeEditor(sender);
    this.createMachineLineForm(new Machine());
    sender.addRow(this.machineFormGroup);
    this.btnEditVisible = false;
  }

  private closeEditor(grid: { closeRow: (arg0: number) => void; }, rowIndex = this.editedRowIndex) {
    if (rowIndex !== undefined) {
      grid.closeRow(rowIndex);
      this.editedRowIndex = undefined;
      this.machineFormGroup = undefined;
    }
  }

  private createMachineLineForm(machine?: Machine): void {
    this.isEditingMode = true;
    this.machineFormGroup = new FormGroup({
      description: new FormControl(machine.id, Validators.required),
      costPerHour: new FormControl({value: machine ? machine.costPerHour : '', disabled: true}),
      responsibleId: new FormControl({value: machine ? machine.responsibleId : '', disabled: true}),
      stateMachine: new FormControl({value: machine ? machine.stateMachine : '', disabled: true}),
      responsibleFullName: new FormControl({value: machine ? machine.responsibleFullName : '', disabled: true}),
      machineId: new FormControl(machine.id, Validators.required),
    });
  }

  saveHandler({sender, rowIndex, formGroup, isNew}) {
    if (this.machineFormGroup.valid) {
    if (this.idSectionOnUpdate > 0) {
      this.selectedMachine.sectionId = this.idSectionOnUpdate;
      this.subscription$ = this.machineService.getJavaGenericService()
        .updateEntity(this.selectedMachine, this.selectedMachine.id, MachineConstant.MACHINE_URL)
        .subscribe((data) => {
          this.employeeService.getById(this.selectedMachine.responsibleId).subscribe(res => {
            this.selectedMachine.responsibleName = res[MachineConstant.FULLNAME];
          });
          this.rowMachinesList.push(this.selectedMachine);
          this.dataStateChange(this.gridStateSections);
          this.closeEditor(sender, rowIndex);
          this.growlService.successNotification(this.translate.instant(NomenclaturesConstant.SUCCESS_OPERATION));
        });
    } else {
      this.employeeService.getById(this.selectedMachine.responsibleId).subscribe(res => {
        this.selectedMachine.responsibleName = res[MachineConstant.FULLNAME];
      });
      this.rowMachinesList.push(this.selectedMachine);
      this.dataStateChange(this.gridStateSections);
      this.closeEditor(sender, rowIndex);
    }
    } else {
    this.validationService.validateAllFormFields(this.machineFormGroup);
    }
  }

  removeMachineHandler(event: any) {
    this.swalWarrings.CreateSwal().then((result) => {
      if (result.value) {
        const index: number = this.rowMachinesList.indexOf(event.dataItem);
        if (index !== -1) {
          this.rowMachinesList.splice(index, 1);
        }
        this.dataStateChange(this.gridStateSections);
        if (this.idSectionOnUpdate > 0) {
          this.subscription$ = this.machineService.getJavaGenericService()
            .updateEntity({
              id: event.dataItem.id,
              description: event.dataItem.description,
              costPerHour: event.dataItem.costPerHour,
              sectionId: null,
              responsibleId: event.dataItem.responsibleId,
              stateMachine: event.dataItem.stateMachine,
            }, event.dataItem.id, MachineConstant.MACHINE_URL)
            .subscribe((data) => {
              this.growlService.successNotification(this.translate.instant(GammeConstant.SUCCESS_OPERATION));
            });
        }
      }
    });
  }

  cancelHandler({sender, rowIndex}) {
    this.closeEditor(sender, rowIndex);
    this.btnEditVisible = true;
    this.dataStateChange(this.gridStateSections);
  }

  onselectedMachineId($event) {
    if ($event !== undefined) {
    this.machineService.getJavaGenericService().getEntityById($event, MachineConstant.MACHINE_URL).subscribe(machine => {
      this.selectedMachine = machine;
      this.employeeService.getById(this.selectedMachine.responsibleId).subscribe(res => {
        this.selectedMachine.responsibleFullName = res[MachineConstant.FULLNAME];
      this.machineFormGroup.patchValue(this.selectedMachine);
      });
    });
    }
  }

  createSectionForm(section: Section) {
    this.formGroup = new FormGroup({
      'reference': new FormControl(section.reference, Validators.required),
      'designation': new FormControl(section.designation, Validators.required),
      areaId: new FormControl(section.areaId, Validators.required),
      operationLines: new FormControl(this.rowMachinesList)
    });
  }

}

