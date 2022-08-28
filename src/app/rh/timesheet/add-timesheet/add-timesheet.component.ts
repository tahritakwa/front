import { DatePipe, Time } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { ProjectConstant } from '../../../constant/rh/project.constant';
import { TimeSheetConstant } from '../../../constant/rh/timesheet.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { LocalStorageService } from '../../../login/Authentification/services/local-storage-service';
import { documentStatusCode } from '../../../models/enumerators/document.enum';
import { TimeSheetStatusEnumerator } from '../../../models/enumerators/timeSheet-status-enumerator.enum';
import { Employee } from '../../../models/payroll/employee.model';
import { TimeSheetDay } from '../../../models/rh/timesheet-day.model';
import { TimeSheetLine } from '../../../models/rh/timesheet-line.model';
import { TimeSheet } from '../../../models/rh/timesheet.model';
import { Document } from '../../../models/sales/document.model';
import { ObjectToSend } from '../../../models/sales/object-to-save.model';
import { Project } from '../../../models/sales/project.model';
import { Comment } from '../../../models/shared/comment.model';
import { CreatedData } from '../../../models/shared/created-data.model';
import { Dictionnay } from '../../../models/shared/dictionnary';
import { FileInfo, ObjectToSave } from '../../../models/shared/objectToSend';
import { EmployeeService } from '../../../payroll/services/employee/employee.service';
import {
  ProjectTimesheetDropdownComponent
} from '../../../shared/components/project-timesheet-dropdown/project-timesheet-dropdown.component';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { FileService } from '../../../shared/services/file/file-service.service';
import { CommentService } from '../../../shared/services/signalr/comment/comment.service';
import { InformationTypeEnum } from '../../../shared/services/signalr/information/information.enum';
import { ValidationService } from '../../../shared/services/validation/validation.service';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { TimeSheetService } from '../../services/timesheet/timesheet.service';

@Component({
  selector: 'app-add-timesheet',
  templateUrl: './add-timesheet.component.html',
  styleUrls: ['./add-timesheet.component.scss']
})

export class AddTimesheetComponent implements OnInit, OnDestroy {
  @ViewChild(ProjectTimesheetDropdownComponent)
  projectDropDown: ProjectTimesheetDropdownComponent;
  addTimeSheetFormGroup: FormGroup;
  reportFormGroup: FormGroup;
  public timeSheet: TimeSheet;
  public timeDataSource: Time[];
  public timeFiltredDataSource: Time[];
  projectDataSource: Project[];
  documents: Document[];
  // employee selected in dropdwon
  public employeeAssociated: Employee;
  /**
   * Enum  Waiting , Accepted , Refused
   */
  public statusCode = TimeSheetStatusEnumerator;
  /**
   * True if the connected user has the right to update or to validate the request
   */
  public hasRight = false;
  /**
   * If update mode or not
   */
  public isUpdateMode = false;
  /**
   * Is my timesheet or not
   */
  public myTimeSheet = false;
  /**
   * True if timesheet is validate or not
   */
  public timeSheetAlreadyValidate = false;
  /**
   * Employee timesheet documents associated
   */
  public timeSheetAttachementFileInfo: Array<FileInfo>;
  /**
   * Variable of control to determine if the CRA is for a coming month and savable or not.
   */
  public printableProjectName: string;
  /**
   * True if can update file
   */
  public canNotUpdateFile = false;
  objectToSend: ObjectToSave;
  idEmployee: number;
  month: number;
  year: number;
  reportObject: ObjectToSave;
  datePipe = new DatePipe('en-US');
  dateFormat = this.translate.instant(SharedConstant.DATE_FORMAT);
  weekDictionnary: { [id: string]: string; } = {};
  dayDictionnary: { [id: string]: Dictionnay; } = {};
  public canAddOrDeleteTimeSheetLine = false;
  idCommentToEdit = NumberConstant.ZERO;
  toEditComent: Comment;
  private isSaveOperation = false;
  private subscriptions: Subscription[]= [];
  private connectedEmplyeeId: number;
  @ViewChild('BackToList') backToList: ElementRef;
  /**
   * The sys date
   */
  public currentDate = new Date();
  public statusCodeDocument = documentStatusCode;
  public commentsData: Comment[] = [];
  public hasValidatePermission: boolean;
  public hasAddPermission: boolean;
  public hasUpdatePermission: boolean;
  public hasCorrectionPermission: boolean;
  public hasPrintPermission: boolean;
  public hasShowDocumentPermission: boolean;
  public isUpperHierrarchyOrTeamManager = false;
  public connectedEmployeeId = false;
  public id = 0;
  public connectedUser;

  /**
   * Constructor
   * @param fb
   * @param validationService
   * @param timeSheetService
   * @param companyService
   * @param projectService
   * @param employeeService
   * @param activatedRoute
   */
  constructor(
    private fb: FormBuilder, private validationService: ValidationService, public timeSheetService: TimeSheetService,
    private employeeService: EmployeeService, private commentService: CommentService,
    private activatedRoute: ActivatedRoute, private router: Router, private translate: TranslateService,
      private swalWarrings: SwalWarring, private growlService: GrowlService, private localStorageService: LocalStorageService,
    private fileServiceService: FileService, public authService: AuthService) {
    // check if is an update case
    this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
      this.id = params[SharedConstant.ID_LOWERCASE] || 0;
      this.isUpdateMode = this.id > NumberConstant.ZERO;
      this.idEmployee = params[TimeSheetConstant.ID_EMPLOYEE_LOWERCASE];
      this.month = params[TimeSheetConstant.MONTH_LOWERCASE];
      this.year = params[TimeSheetConstant.YEAR_LOWERCASE];
      this.timeSheetAttachementFileInfo = new Array<FileInfo>();
    }));
  }

  get Month(): FormControl {
    return this.addTimeSheetFormGroup.get(TimeSheetConstant.MONTH) as FormControl;
  }

  get TimeSheetDay(): FormArray {
    return this.addTimeSheetFormGroup.get(TimeSheetConstant.TIMESHEET_DAY) as FormArray;
  }

  get TimeSheetLine(): FormArray {
    return this.addTimeSheetFormGroup.get(TimeSheetConstant.TIMESHEET_LINE) as FormArray;
  }

  get StartTime(): FormControl {
    return this.addTimeSheetFormGroup.get(TimeSheetConstant.START_TIME) as FormControl;
  }

  get EndTime(): FormControl {
    return this.addTimeSheetFormGroup.get(TimeSheetConstant.END_TIME) as FormControl;
  }

  get Details(): FormControl {
    return this.addTimeSheetFormGroup.get(TimeSheetConstant.DETAILS) as FormControl;
  }

  get IdEmployee(): FormControl {
    return this.addTimeSheetFormGroup.get(TimeSheetConstant.ID_EMPLOYEE) as FormControl;
  }

  get Id(): FormControl {
    return this.addTimeSheetFormGroup.get(SharedConstant.ID) as FormControl;
  }

  get IdProject(): FormControl {
    return this.reportFormGroup.get(TimeSheetConstant.ID_PROJECT) as FormControl;
  }

  get Message(): FormControl {
    return this.addTimeSheetFormGroup.get(SharedConstant.MESSAGE) as FormControl;
  }

  /**
   * Ng onInit
   */
  ngOnInit() {
    this.hasValidatePermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.VALIDATE_TIMESHEET);
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.ADD_TIMESHEET);
    this.hasUpdatePermission =  this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.UPDATE_TIMESHEET);
    this.hasCorrectionPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.CORRECT_TIMESHEET);
    this.hasPrintPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.PRINT_TIMESHEET);
    this.hasShowDocumentPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.SHOW_INVOICE_SALES)
      || this.authService.hasAuthority(PermissionConstant.CommercialPermissions.UPDATE_INVOICE_SALES);
    this.createAddTimeSheetFormGroup();
    this.createReportFormGroup();
    if (this.isUpdateMode && !this.hasUpdatePermission) {
      this.addTimeSheetFormGroup.disable();
      this.reportFormGroup.disable();
    }
    this.connectedUser = this.localStorageService.getUser();
    if (!this.isUpdateMode) {
      this.IdEmployee.setValue(this.idEmployee);
      this.Month.setValue(new Date(this.year, this.month, NumberConstant.ZERO));
    }
    this.subscriptions.push(this.employeeService.getConnectedEmployee().subscribe(res => {
      this.connectedEmployeeId = res.Id;
      this.getTimeSheet();
      this.commentService.initCommentHubConnection();
      this.subscribeOnCommentList();
    }));
  }

  private isConnectedEmployeeTimesheet() {
    this.myTimeSheet = this.IdEmployee.value === this.connectedEmployeeId ? true : false;
  }


  ngOnDestroy(): void {
    this.commentService.destroyCommentHubConnection();
    if (this.subscriptions !== undefined) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
  }

  /**
   * Jasper report print version
   */
  public onPrintJasperClick(): void {
    if (this.reportFormGroup.valid) {
      const params = {
        idTimeSheet: this.timeSheet.Id,
        idProject: this.IdProject.value,
      };
      const documentName = this.translate.instant(TimeSheetConstant.TIMESHEET_UPPERCASE)
        .concat(SharedConstant.UNDERSCORE).concat(this.employeeAssociated.FirstName)
        .concat(SharedConstant.UNDERSCORE).concat(this.employeeAssociated.LastName)
        .concat(SharedConstant.UNDERSCORE)
        .concat(this.translate.instant(this.datePipe.transform(new Date(this.Month.value), 'MMMM').toUpperCase()))
        .concat(SharedConstant.UNDERSCORE).concat(this.datePipe.transform(new Date(this.Month.value), 'yyyy'))
        .concat(SharedConstant.UNDERSCORE).concat(this.printableProjectName);
      const dataToSend = {
        'reportName': TimeSheetConstant.TIMESHEET_REPORT_NAME,
        'documentName': documentName,
        'reportFormatName': 'pdf',
        'printCopies': 1,
        'reportType': 'pdf',
        'reportparameters': params
      };
      this.subscriptions.push(this.timeSheetService.downloadJasperReport(dataToSend).subscribe(
        res => {
          this.fileServiceService.downLoadFile(res.objectData);
        }));

    } else {
      this.validationService.validateAllFormFields(this.reportFormGroup);
    }
  }

  /**
   * Get the TimeSheet
   * If the id is sent, retrieve the TimeSheet corresponding to this Id, otherwise create back side
   * a blank TimeSheet and retrieve it
   */
  private getTimeSheet() {
    if (this.isUpdateMode) {
      this.subscriptions.push(this.timeSheetService.getById(this.id).subscribe((data: TimeSheet) => {
        if (data) {
          this.timeSheet = data;
          this.isUpperHierrarchyOrTeamManager = this.timeSheet.IsConnectedUserInHierarchy;
          this.employeeAssociated = data.IdEmployeeNavigation;
          if (this.timeSheet.Document && this.timeSheet.Document.length > 0) {
            this.documents = this.timeSheet.Document;
          }
          this.currentDate =  this.employeeAssociated && this.employeeAssociated.ResignationDate != null
          ? new Date(this.employeeAssociated.ResignationDate) : new Date();
          this.addTimeSheetFormGroup.controls[TimeSheetConstant.MONTH].setValue(this.currentDate);
          this.getTimeSheetData();
          this.prepareCommentsList();
        }
      }));
    } else {
      this.subscriptions.push(this.timeSheetService.getEmployeeTimeSheet(this.IdEmployee.value,
        this.year && this.month ? new Date(this.year, this.month, NumberConstant.ZERO) : this.currentDate)
        .subscribe((data: TimeSheet) => {
          this.timeSheet = data;
          this.isUpperHierrarchyOrTeamManager = this.timeSheet.IsConnectedUserInHierarchy;
          this.employeeAssociated = data.IdEmployeeNavigation;
          this.currentDate = data &&
          data.ResignationDateEmployee != null ? new Date(data.ResignationDateEmployee) : new Date();
          this.addTimeSheetFormGroup.controls[TimeSheetConstant.MONTH].setValue(this.currentDate);
          this.getTimeSheetData();
        }));
    }
  }


  /**
   * Get Timesheet data construction entry point of the CRA form
   * Create the first embedded formArray based on TimeSheetDay
   */
  private getTimeSheetData() {
    let index = NumberConstant.ZERO;
    this.checkRights();
    this.checkIfTimeSheetHasBeenAlreadyValidated();
    const currentWeekNumber = this.getCurrentWeek();
    this.Id.patchValue(this.timeSheet.Id);
    this.Month.patchValue(new Date(this.timeSheet.Month));
    this.IdEmployee.patchValue(this.timeSheet.IdEmployee);
    this.isConnectedEmployeeTimesheet();
    this.timeSheet.TimeSheetDay.forEach((timeSheetDay: TimeSheetDay) => {
      this.TimeSheetDay.push(
        this.fb.group({
          Day: timeSheetDay.Day,
          WeekNumberInYear: timeSheetDay.WeekNumberInYear,
          Hide: [timeSheetDay.WeekNumberInYear === currentWeekNumber ? false : true],
          Hollidays: [timeSheetDay.Hollidays ? timeSheetDay.Hollidays : false],
          WaitingLeave: [timeSheetDay.WaitingLeave ? timeSheetDay.WaitingLeave : undefined],
          WaitingLeaveTypeName: [timeSheetDay.WaitingLeaveTypeName ? timeSheetDay.WaitingLeaveTypeName : undefined],
          TimeSheetLine: this.setTimeSheetLine(timeSheetDay, this.timeSheet.Status),
          Hours: this.setTimeSheetHours(timeSheetDay.Hours),
          Project: this.setTimeSheetProject(timeSheetDay.Project)
        }));
      if (this.weekDictionnary[timeSheetDay.WeekNumberInYear] === undefined) {
        this.getWeekDetails(timeSheetDay);
      }
      const date = new Date(timeSheetDay.Day).toString().split(' ');
      this.dayDictionnary[index++] = { Key: +date[NumberConstant.TWO], Value: date[NumberConstant.ZERO] };
    });
    if (this.timeSheet.TimeSheetFileInfo) {
      this.timeSheetAttachementFileInfo = this.timeSheet.TimeSheetFileInfo;
    }
    // If the current timesheet is for a month less or equal than the current month, set to true otherwise false
    this.canAddOrDeleteTimeSheetLine = (this.hasAddPermission || this.hasUpdatePermission)
      && (this.myTimeSheet || this.timeSheet.IsConnectedUserInHierarchy)
      && (this.timeSheet.Status < this.statusCode.Sended || this.timeSheet.Status === this.statusCode.ToReWork);
    // Prepare report object
    if (this.timeSheet.Status === this.statusCode.Validated) {
      const data: any = {};
      this.IdProject.patchValue(undefined);
      data[ProjectConstant.START_DATE] = new Date(this.timeSheet.Month);
      data[ProjectConstant.ID_EMPLOYEE] = this.timeSheet.IdEmployee;
      this.reportObject = new ObjectToSend(data, null);
    }
  }

  /**
   * Get week details: startDate of Week in timlesheet and endDate
   */
  private getWeekDetails(timeSheetDay: TimeSheetDay) {
    const selectedMonth = new Date(this.Month.value);
    const dt = new Date(timeSheetDay.Day);
    const currentWeekDay = dt.getDay();
    const lessDays = currentWeekDay === NumberConstant.ZERO ? NumberConstant.SIX : currentWeekDay - NumberConstant.ONE;
    let wkStart = new Date(new Date(dt).setDate(dt.getDate() - lessDays));
    let wkEnd = new Date(new Date(wkStart).setDate(wkStart.getDate() + NumberConstant.SIX));
    // If this is the first day of the CRA, initialize the day of the first banner to CRA startDate date
    // This results in an empty dictionary
    if (Object.keys(this.weekDictionnary).length === NumberConstant.ZERO) {
      wkStart = dt;
    }
    // If the first day of the week is part of the previous month, set the start date of the banner to the start date of the month
    if (wkStart.getMonth() < selectedMonth.getMonth()) {
      wkStart = selectedMonth;
    }
    // If the last day of the week is part of the following month, enter the end date of the banner at the end of the month.
    if (wkEnd.getMonth() > selectedMonth.getMonth()) {
      const currentMonth = selectedMonth;
      wkEnd = new Date(currentMonth.setMonth(currentMonth.getMonth() + NumberConstant.ONE));
      wkEnd.setDate(wkEnd.getDate() - NumberConstant.ONE);
    }
    this.weekDictionnary[timeSheetDay.WeekNumberInYear] = this.translate.instant(TimeSheetConstant.FROM) + ' ' +
      this.datePipe.transform(wkStart, this.translate.instant(this.dateFormat)).toString() + '   ' +
      this.translate.instant(TimeSheetConstant.TO) + ' ' +
      this.datePipe.transform(wkEnd, this.translate.instant(this.dateFormat)).toString();
  }

  /**
   * Get number of current week
   */
  private getCurrentWeek() {
    const date = new Date(Date.UTC(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDate.getDate()));
    date.setUTCDate(date.getUTCDate() + NumberConstant.FOUR - date.getUTCDay() || NumberConstant.SEVEN);
    return Math.ceil((((date.valueOf() - new Date(Date.UTC(date.getUTCFullYear(), NumberConstant.ZERO,
      NumberConstant.ONE)).valueOf()) / NumberConstant.EIGHTY_SIX_MILLION_FOUR_HUNDRED_THOUSAND) +
      NumberConstant.ONE) / NumberConstant.SEVEN);
  }


  /**
   * Takes a TimeSheetDay in parameter and builds a Formarray which contain
   * the TimesheetLine of this TimeSheetDay
   * @param timeSheetDay
   */
  private setTimeSheetLine(timeSheetDay: TimeSheetDay, status: TimeSheetStatusEnumerator) {
    const array = new FormArray([]);
    let lineFormGroup: FormGroup;
    timeSheetDay.TimeSheetLine.forEach((line: TimeSheetLine) => {
      lineFormGroup = this.fb.group({
        Id: [line.Id ? line.Id : NumberConstant.ZERO],
        StartTime: [line.StartTime ? line.StartTime : '', Validators.required],
        EndTime: [line.EndTime ? line.EndTime : '', Validators.required],
        Details: [line.Details ? line.Details : ''],
        IdProject: [line.IdProject ? line.IdProject : undefined, Validators.required],
        Day: [line.Day],
        LineTotalTime: [line.DayHour.Day > NumberConstant.ZERO ?
          line.DayHour.Day + ' ' + this.translate.instant(TimeSheetConstant.DAY_ABBREVIATED) :
          line.DayHour.Hour + ' ' + this.translate.instant(TimeSheetConstant.HOUR_ABBREVIATED)],
        Valid: [status === TimeSheetStatusEnumerator.Sended ? true : line.Valid],
        IsDeleted: [line.IsDeleted ? line.IsDeleted : false],
        Worked: [line.Worked ? line.Worked : false],
        WaitingLeaveTypeName: [line.WaitingLeaveTypeName ? line.WaitingLeaveTypeName : undefined],
      });
      if (line.IdLeave) {
        lineFormGroup.addControl(TimeSheetConstant.ID_LEAVE, this.fb.control(line.IdLeave));
        lineFormGroup.controls[TimeSheetConstant.ID_PROJECT].clearValidators();
        lineFormGroup.controls[TimeSheetConstant.ID_PROJECT].updateValueAndValidity();
      }
      if (line.IdDayOff) {
        lineFormGroup.addControl(TimeSheetConstant.ID_DAY_OFF, this.fb.control(line.IdDayOff));
        lineFormGroup.addControl(TimeSheetConstant.DAY_OFF_LABEL, this.fb.control(line.IdDayOffNavigation.Label));
        lineFormGroup.controls[TimeSheetConstant.ID_PROJECT].clearValidators();
        lineFormGroup.controls[TimeSheetConstant.ID_PROJECT].updateValueAndValidity();
      }
      if (line.Valid || (this.myTimeSheet && this.timeSheet.Status >= this.statusCode.Sended
          && this.timeSheet.Status <= this.statusCode.Validated) || (this.isUpdateMode && !this.hasUpdatePermission)) {
        lineFormGroup.disable();
        this.canNotUpdateFile = true;
      }
      array.push(lineFormGroup);
    });
    return array;
  }

  /**
   * Constructs a formArray containing the possible values for the hours dropdown
   * @param hours
   */
  private setTimeSheetHours(hours: Array<any>) {
    const array = new FormArray([]);
    hours.forEach(hour => {
      array.push(this.fb.group({
        Key: [hour.Key],
        Value: [hour.Value]
      }));
    });
    return array;
  }

  /**
   * Constructs a formArray containing the possible values for the projects dropdown
   * @param projects
   */
  private setTimeSheetProject(projects: Array<Project>) {
    const array = new FormArray([]);
    projects.forEach(project => {
      array.push(this.fb.group({
        Id: [project.Id],
        Name: [project.Name],
        ProjectLabel: [project.ProjectLabel]
      }));
    });
    return array;
  }

  /**
   * Add new TimeSheetLine in the specific formArray
   * if all controls of this formArray are valid
   * @param formArray
   */
  public addNewTimeSheetLine(timeSheetDay: FormControl) {
    if (this.timeSheet.Status !== this.statusCode.Validated) {
      if (timeSheetDay.valid) {
        const timeSheetLine: FormArray = timeSheetDay.get(TimeSheetConstant.TIMESHEET_LINE) as FormArray;
        // Possible times for this timeSheetLine as FormArray
        const hours: FormArray = timeSheetDay.get(TimeSheetConstant.HOURS) as FormArray;
        // Projects that can be affected this timeSheetLine as FormArray
        const project: FormArray = timeSheetDay.get(TimeSheetConstant.PROJECT) as FormArray;
        // Get the maximum end time for the timesheetday tuimesheetline and assign it to StartTime and EndTime
        const startTimeValue = timeSheetLine.value.filter(m => !m.IsDeleted).map(m => m.EndTime).sort((one, two) => (one > two ?
          -NumberConstant.ONE : NumberConstant.ONE))[NumberConstant.ZERO];
        // The possible hours that can accept a TimeSheetLine
        const HoursValue = this.setTimeSheetHours(hours.value);
        // The maximum value that can have a dropDown time of this line
        const endTimeValue = HoursValue.value[HoursValue.value.length - NumberConstant.ONE].Value;
        const lineFormGroup: FormGroup = this.fb.group({
          Id: [NumberConstant.ZERO],
          StartTime: [startTimeValue, Validators.required],
          EndTime: [endTimeValue, Validators.required],
          IdProject: [timeSheetLine.value[NumberConstant.ZERO].IdProject, Validators.required],
          Day: [timeSheetLine.controls[NumberConstant.ZERO].get(TimeSheetConstant.DAY).value],
          Details: [''],
          Valid: [false],
          IsDeleted: [false],
          Hours: HoursValue,
          Project: this.setTimeSheetProject(project.value),
        });
        this.subscriptions.push(this.timeSheetService.TimeValueChange(new Date(timeSheetDay.get(TimeSheetConstant.DAY).value),
          startTimeValue, endTimeValue).subscribe(data => {
          let time;
          if (data.objectData.Day !== NumberConstant.ZERO) {
            time = data.objectData.Day + ' ' + this.translate.instant(TimeSheetConstant.DAY_ABBREVIATED);
          } else {
            time = data.objectData.Hour + ' ' + this.translate.instant(TimeSheetConstant.HOUR_ABBREVIATED);
          }
          lineFormGroup.addControl(TimeSheetConstant.LINE_TOTAL_TIME, this.fb.control(time));
          timeSheetLine.push(lineFormGroup);
        }));
      } else {
        this.validationService.validateAllFormFields(this.addTimeSheetFormGroup);
      }
    } else {
      this.swalWarrings.CreateSwal(TimeSheetConstant.TIMESHEET_VALIDATED_MESSAGE, TimeSheetConstant.TIMESHEET_VALIDATED,
        SharedConstant.OKAY, null, true);
    }
  }

  /**
   * Deletes the TimeSheet Line at the index parameter of the corresponding formarray in parameter
   * @param formArray
   * @param index
   */
  public deleteTimeSheetLine(formArray: FormArray, index: number) {
    const form = (formArray.get(TimeSheetConstant.TIMESHEET_LINE) as FormArray);
    if (form.controls[index].value.Id > NumberConstant.ZERO) {
      form.controls[index].get(SharedConstant.IS_DELETED).setValue(true);
    } else {
      form.removeAt(index);
    }
  }

  /**
   * Return valid timeSheetLine
   * @param formArray
   */
  numberOfValideLines(formArray: FormArray): number {
    let size = NumberConstant.ZERO;
    (formArray.get(TimeSheetConstant.TIMESHEET_LINE) as FormArray).controls.forEach((control: FormControl) => {
      if (control.get(SharedConstant.IS_DELETED) !== null && control.get(SharedConstant.IS_DELETED).value === false) {
        size++;
      }
    });
    return size;
  }

  /**
   * Save the current TimeSheet
   */
  public save(status?: TimeSheetStatusEnumerator) {
    if (this.addTimeSheetFormGroup.valid || this.addTimeSheetFormGroup.disabled) {
      const timeSheetToSave = Object.assign({}, this.timeSheet, this.addTimeSheetFormGroup.getRawValue());
      // Save file
      if (this.timeSheetAttachementFileInfo.length !== NumberConstant.ZERO) {
        timeSheetToSave.TimeSheetFileInfo = this.timeSheetAttachementFileInfo;
      }
      if (status) {
        timeSheetToSave.Status = status;
      }
      this.isSaveOperation = true;
      this.subscriptions.push(this.timeSheetService.save(timeSheetToSave, !this.isUpdateMode)
        .subscribe((res) => {
          if (!this.isUpdateMode) {
            timeSheetToSave.Id = res.Id;
          }
          this.router.navigate([TimeSheetConstant.LIST_URL]);
        }));
    } else {
      this.validationService.validateAllFormFields(this.addTimeSheetFormGroup);
      // For any week including a control invalid, open the pannel if it is closed
      this.TimeSheetDay.controls.forEach((formGroup: FormGroup) => {
        if (formGroup.invalid && formGroup.controls[TimeSheetConstant.HIDE].value) {
          const value = formGroup.controls[TimeSheetConstant.WEEK_NUMBER_IN_YEAR].value;
          this.hideWeekBody(value);
        }
      });
    }
  }

  /**
   * Validation of TimeSheet
   */
  public Validate() {
    if (this.addTimeSheetFormGroup.valid) {
      this.swalWarrings.CreateSwal(SharedConstant.ARE_YOU_SURE_TO_CONTINUE, TimeSheetConstant.TITLE_SWAL_WARRING_VALIDATE_TIMESHEET,
        SharedConstant.VALIDATE, SharedConstant.NO).then((result) => {
        if (result.value) {
          const timeSheetToSave = Object.assign({}, this.timeSheet, this.addTimeSheetFormGroup.getRawValue());
          timeSheetToSave.Status = this.statusCode.PartiallyValidated;
          const objectToSend = new ObjectToSend(timeSheetToSave);
          this.isSaveOperation = true;
          this.subscriptions.push(this.timeSheetService.validateTimeSheet(objectToSend).subscribe((res) => {
            this.router.navigate([TimeSheetConstant.LIST_URL]);
          }));
        }
      });
    } else {
      this.validationService.validateAllFormFields(this.addTimeSheetFormGroup);
    }
  }

  /**
   * Timesheet fix request
   */
  public onTimeSheetFixRequestClick() {
    this.swalWarrings.CreateSwal(TimeSheetConstant.MAKE_FIX_REQUEST, undefined, SharedConstant.YES, SharedConstant.NO).then((result) => {
      if (result.value) {
        this.isSaveOperation = true;
        this.subscriptions.push(this.timeSheetService.timeSheetFixRequest(this.timeSheet.Id).subscribe(() => {
          this.router.navigate([TimeSheetConstant.LIST_URL]);
        }));
      }
    });
  }

  /**
   * if employee drowpdown value change
   * @param $event
   */
  public onChangeEmployee($event) {
    if ($event.form.controls[TimeSheetConstant.ID_EMPLOYEE].value === NumberConstant.ZERO
      || $event.form.controls[TimeSheetConstant.ID_EMPLOYEE].value === null
      || $event.form.controls[TimeSheetConstant.ID_EMPLOYEE].value === undefined) {
      this.IdEmployee.setValue(this.connectedEmployeeId);
    } else {
      this.clearAttachementFileInput();
      this.weekDictionnary = {};
      this.dayDictionnary = {};
    }
    if (this.IdEmployee.value) {
      this.getEmployeeTimeSheet();
      this.employeeAssociated = $event.employeeFiltredDataSource
        .filter(x => x.Id === this.addTimeSheetFormGroup.controls[TimeSheetConstant.ID_EMPLOYEE].value)[0];
      this.currentDate =  this.employeeAssociated.ResignationDate != null ? new Date(this.employeeAssociated.ResignationDate) : new Date();
      this.addTimeSheetFormGroup.controls[TimeSheetConstant.MONTH].setValue(this.currentDate);
    }
  }

  /**
   * If date change
   */
  public onChangeDate() {
    if (this.Month.value === null || this.Month.value === undefined) {
      this.addTimeSheetFormGroup.controls[TimeSheetConstant.MONTH].setValue(this.currentDate);
    } else {
      this.clearAttachementFileInput();
      this.weekDictionnary = {};
      this.dayDictionnary = {};
    }
    this.getEmployeeTimeSheet();
  }

  /**
   * At each change in the StartTime dropdown, recalculate  the number of hours worked
   * for the corresponding TimeSheetLine
   * @param startTime
   */
  public startTimeValueChange(startTime: Time, timeSheetLineFormGroup: FormControl, timeSheetDay: FormControl) {
    if (startTime) {
      if (startTime > timeSheetLineFormGroup.get(TimeSheetConstant.END_TIME).value) {
        const HoursPeriodOfDate = timeSheetDay.get(TimeSheetConstant.HOURS).value;
        timeSheetLineFormGroup.get(TimeSheetConstant.END_TIME).setValue(HoursPeriodOfDate[HoursPeriodOfDate.length - 1].Value);
      }
      this.checkTimeValidity(startTime, timeSheetLineFormGroup.get(TimeSheetConstant.END_TIME).value, timeSheetLineFormGroup, timeSheetDay);
    }
  }

  /**
   * At each change in the EndTime dropdown, recalculate  the number of hours worked
   * for the corresponding TimeSheetLine
   * @param startTime
   */
  public endTimeValueChange(endTime: Time, timeSheetLineFormGroup: FormControl, timeSheetDay: FormControl) {
    if (endTime) {
      if (endTime < timeSheetLineFormGroup.get(TimeSheetConstant.START_TIME).value) {
        const HoursPeriodOfDate = timeSheetDay.get(TimeSheetConstant.HOURS).value;
        timeSheetLineFormGroup.get(TimeSheetConstant.START_TIME).setValue(HoursPeriodOfDate[0].Value);
      }
      this.checkTimeValidity(timeSheetLineFormGroup.get(TimeSheetConstant.START_TIME).value, endTime, timeSheetLineFormGroup, timeSheetDay);
    }
  }


  /**
   * check validity between start time and end time
   */
  checkTimeValidity(startTime: Time, endTime: Time, timeSheetLineFormGroup: FormControl, timeSheetDay: FormControl) {
    this.subscriptions.push(this.timeSheetService.TimeValueChange(new Date(timeSheetDay.get(TimeSheetConstant.DAY).value),
      startTime, endTime).subscribe(data => {
      let time;
      if (data.objectData.Day !== NumberConstant.ZERO) {
        time = data.objectData.Day + ' ' + this.translate.instant(TimeSheetConstant.DAY_ABBREVIATED);
      } else {
        time = data.objectData.Hour + ' ' + this.translate.instant(TimeSheetConstant.HOUR_ABBREVIATED);
      }
      timeSheetLineFormGroup.get(TimeSheetConstant.LINE_TOTAL_TIME).patchValue(time);
    }));
  }

  /**
   * Hide week panel bony if it's opened or open it if it's closed
   * @param weekNumber
   */
  hideWeekBody(weekNumber: number) {
    for (const control of this.TimeSheetDay.controls) {
      if (control instanceof FormGroup && control.controls[TimeSheetConstant.WEEK_NUMBER_IN_YEAR].value === weekNumber) {
        control.controls[TimeSheetConstant.HIDE].setValue(!control.controls[TimeSheetConstant.HIDE].value);
      }
    }
  }

  /**
   * Check if employee has permission to validate timesheet or not
   */
  public checkRights() {
    // Check If the user has the right to validate
    // 1- check if the request is not for the connected user (user can not validate his own request)
    // 2- check if the connected user has the right to validate the request
    if (this.timeSheet.Status >= this.statusCode.Sended) {
      if ((!this.myTimeSheet && this.timeSheet.IsConnectedUserInHierarchy)
        || (this.isUpdateMode && this.myTimeSheet)) {
        this.hasRight = true;
      }
    }
  }

  /**
   * Check if timesheet has been already validated or refused
   */
  public checkIfTimeSheetHasBeenAlreadyValidated() {
    if (this.timeSheet.Status >= this.statusCode.Sended) {
      this.timeSheetAlreadyValidate = this.timeSheet.Status === this.statusCode.Validated ? true : false;
    }
  }

  /**
   * Receives the project name selected by the project selection component to be printed to build the DocumentName
   * @param $event
   */
  receivedMessage($event: string) {
    this.printableProjectName = $event;
  }

  /**
   * For refresh the current timeSheet
   * It reset the timesheet day form array
   */
  public refresh(): void {
    this.addTimeSheetFormGroup.setControl(TimeSheetConstant.TIMESHEET_DAY, this.fb.array([]));
    this.getTimeSheet();
  }

  subscribeOnCommentList(): void {
    this.subscriptions.push(this.commentService.listCommentSubject.subscribe((data: Comment) => {
      this.getSrcPictureEmployee(data);
      this.commentsData.push(data);
    }));
  }

  prepareCommentsList() {
    if (this.timeSheet.Comments) {
      this.commentsData = this.timeSheet.Comments;
      this.commentsData.forEach((x) => {
        this.getSrcPictureEmployee(x);
      });
    }
  }

  addComment(): void {
    if (this.Message.value) {
      const commentEntity: Comment = new Comment();
      commentEntity.Id = NumberConstant.ZERO;
      if (this.toEditComent) {
        Object.assign(commentEntity, this.toEditComent);
      }
      commentEntity.Message = (this.Message.value as string)
        .replace('\n', '<br>');
      commentEntity.CreationDate = new Date();
      commentEntity.IdEntityCreated = this.timeSheet.IdEmployee;
      commentEntity.IdCreator = this.localStorageService.getUserId();
      commentEntity.EntityName = TimeSheetConstant.ENTITY_NAME;
      this.commentService.save(commentEntity, this.idCommentToEdit === NumberConstant.ZERO).subscribe(res => {
        if (res) {
          const createdData: CreatedData = new CreatedData(this.timeSheet.Id, '');
          this.commentService.addCommentAndSendNotifTheSuperior(commentEntity, this.timeSheet.IdEmployee,
            createdData, InformationTypeEnum.ADD_COMMENT_TIMESHEET, true);
        }
        if (this.idCommentToEdit) {
          const index = this.commentsData.findIndex(x => x.Id === this.idCommentToEdit);
          this.commentsData[index] = commentEntity;
          this.idCommentToEdit = NumberConstant.ZERO;
          this.toEditComent = null;
          this.Message.reset();
        } else {
          res = this.getSrcPictureEmployee(res);
          this.Message.reset();
          this.commentsData.push(res);
        }
      });
    }
  }

  deletecomment(idComment: number) {
    const element = this.commentsData.find(x => x.Id === idComment);
    if (element && element.Employee.Id === this.connectedEmplyeeId) {
      this.commentService.remove(element).subscribe(() => {
        const index = this.commentsData.findIndex(x => x.Id === idComment);
        this.commentsData.splice(index, NumberConstant.ONE);
        this.Message.reset();
      });
    } else {
      this.growlService.warningNotification(this.translate.instant(SharedConstant.UNAUTHRIZED_ERROR_MSG));
    }
  }

  editcomment(idComment: number ) {
    const element = this.commentsData.find(x => x.Id === idComment);
    if (element && element.Employee.Id === this.connectedEmplyeeId) {
      this.Message.setValue(element.Message);
      this.idCommentToEdit = element.Id;
      this.toEditComent = element;
    } else {
      this.growlService.warningNotification(this.translate.instant(SharedConstant.UNAUTHRIZED_ERROR_MSG));
    }
  }

  validCommentary(): boolean {
    if (this.Message.value) {
      return this.Message.value.replace(/^\s+|\s+$/g, '') === '';
    } else {
      return true;
    }
  }

  isFormChanged(): boolean {
    if (this.addTimeSheetFormGroup.touched || this.timeSheetAttachementFileInfo.length !== NumberConstant.ZERO) {
      return true;
    }
    return false;
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

  /**
   * Create TimeSheet formGroup
   */
  private createAddTimeSheetFormGroup(timesheet?: TimeSheet) {
    this.addTimeSheetFormGroup = this.fb.group({
      Id: [timesheet && timesheet.Id ? timesheet.Id : NumberConstant.ZERO],
      Comment: [''],
      Message: [''],
      IdEmployee: [timesheet && timesheet.IdEmployee ? timesheet.IdEmployee : NumberConstant.ZERO, Validators.required],
      Month: [timesheet && timesheet.Month ? new Date(timesheet.Month) : this.currentDate, Validators.required],
      TimeSheetDay: this.fb.array([])
    });
  }

  private createReportFormGroup() {
    this.reportFormGroup = this.fb.group({
      IdProject: [undefined, Validators.required]
    });
  }


  /**
   * Empty anything related to the attached file component
   */
  private clearAttachementFileInput() {
    this.timeSheetAttachementFileInfo = new Array<FileInfo>();
    if (this.timeSheet) {
      this.timeSheet.TimeSheetFileInfo = this.timeSheetAttachementFileInfo;
    }
    this.canNotUpdateFile = false;
  }

  /**
   * Reload the interface with the new data of the selected employee or the selected month
   */
  private getEmployeeTimeSheet() {
    this.subscriptions.push(this.timeSheetService.getEmployeeTimeSheet(this.IdEmployee.value, new Date(this.Month.value))
      .subscribe((data: TimeSheet) => {
        this.isUpdateMode = data.Id > NumberConstant.ZERO;
        this.timeSheet = data;
        this.createAddTimeSheetFormGroup(this.timeSheet);
        this.getTimeSheetData();
      }));
  }

  private getSrcPictureEmployee(comment: Comment): Comment {
    if (comment.Employee && comment.Employee.PictureFileInfo && comment.Employee.PictureFileInfo.Data) {
      comment.SrcPictureEmployee = 'data:image/png;base64,'.concat(comment.Employee.PictureFileInfo.Data);
    } else {
      comment.SrcPictureEmployee = '../../../../assets/image/user-new-icon1.jpg';
    }
    return comment;
  }

}
