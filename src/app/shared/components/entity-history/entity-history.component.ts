import { Component, OnInit, Input, OnChanges, SimpleChanges, SimpleChange, OnDestroy, AfterContentInit, AfterViewInit } from '@angular/core';
import { EntityHistoryService } from '../../services/entity-history/entity-history.service';
import { ComponentsConstant } from '../../../constant/shared/components.constant';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfig } from '../../../../COM/config/app.config';
import { ChangedProperty } from '../../../models/shared/changed-property.model';
import { Entityhistory } from '../../../models/shared/entity-history.model';
import { GenericServiceJava } from '../../../../COM/config/app-config.serviceJava';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { Operation } from '../../../../COM/Models/operations';
import { CategoryService } from '../../../crm/services/category/category.service';
import { StatusCrm } from '../../../models/crm/statusCrm.model';
import { CurrencyService } from '../../../administration/services/currency/currency.service';
import { Employee } from '../../../models/payroll/employee.model';
import { EmployeeService } from '../../../payroll/services/employee/employee.service';
import { DatePipe } from '@angular/common';
import { OpportunityService } from '../../../crm/services/opportunity.service';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { debounceTime } from 'rxjs/operators/debounceTime';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-entity-history',
  templateUrl: './entity-history.component.html',
  styleUrls: ['./entity-history.component.scss'],
})
export class EntityHistoryComponent implements OnInit {

  // CRM or accounting Or .Net or production etc
  @Input() sectionType: number;

  @Input() entityType: string;

  @Input() entityId: string;

  @Input() historyTitle: string;



  public formatDate = this.translate.instant(SharedConstant.DATE_FORMAT);

  public changedProperties: Array<string>;
  public changedProperty: ChangedProperty;
  public allTemporaryHistory = new Array<any>();
  public allHistory = new Array<any>();
  private entityHistoryService: EntityHistoryService;
  private genericServiceJava: GenericServiceJava;
  constructor(private httpClient: HttpClient,
    private appConfig: AppConfig, private translate: TranslateService,
    private objectifService: CategoryService,
    private currencyService: CurrencyService,
    private employeeService: EmployeeService,
    public datepipe: DatePipe,
    private oppService: OpportunityService
  ) { }

     getHistory() {

    this.entityHistoryService.getGenericService().callService(Operation.GET,
      ComponentsConstant.BASE_ENTITY_TYPE.concat(this.entityType, '/', this.entityId)).finally(() => {
        this.allTemporaryHistory.forEach(element => {
            this.refactorOpportunityAttributes(element);
           this.allHistory.push(element);
        });
      })
      .subscribe(data => {

        data.forEach(entity => {

          entity.entityType = entity.entityType.split('.')[entity.entityType.split('.').length - NumberConstant.ONE];
          entity.entityValue = JSON.parse(entity.entityValue);
          entity.modification = JSON.parse(entity.modification);
          entity.modifiedDate = new Date(entity.modifiedDate[NumberConstant.ZERO],
            entity.modifiedDate[NumberConstant.ONE] - NumberConstant.ONE, entity.modifiedDate[NumberConstant.TWO]);
          this.employeeService.getById(entity.entityValue.responsableUser.id).subscribe((employee: Employee) => {
            if (employee.PictureFileInfo) {
              entity.entityValue.employee.pictureEmployesSrc = `data:image/png;base64,  ${employee.PictureFileInfo.Data}`;
            }

          });
          //specific for opportunity
          this.allTemporaryHistory.push(entity);
        });
      });

  }

  private refactorOpportunityAttributes(entity: any) {
    if (entity.modification) {
      this.createdDateFormat(entity.modification);
      this.endDateFormat(entity.modification);
      if (entity.modification.currentPositionPipe) {
        this.getStatusByPosition(entity.entityValue.objectif.id, entity.modification.currentPositionPipe, true);
        this.getStatusByPosition(entity.entityValue.objectif.id, entity.modification.currentPositionPipe, false);
      }
      this.currencyService.list().subscribe(currencies => {
        if (entity.modification.currencyId) {
          entity.modification.currencyId.old = currencies.find(x => x.Id === entity.modification.currencyId.old).Code;
          entity.modification.currencyId.new = currencies.find(x => x.Id === entity.modification.currencyId.new).Code;
        }
      });
    }

  }

  private getStatusByPosition(objectifId, currentPositionPipe: any, flag: boolean) {
    if (flag) {
      this.objectifService.callService(Operation.GET, `${objectifId}/${currentPositionPipe.old}`)
      .subscribe((status: StatusCrm) => {
          currentPositionPipe.old = status.title;
        });
      } else {
      this.objectifService.callService(Operation.GET, `${objectifId}/${currentPositionPipe.new}`)
      .subscribe((status: StatusCrm) => {
          currentPositionPipe.new = status.title;

        });
      }

  }

  private createdDateFormat(entity: any) {
    if (entity.opportunityCreatedDate) {
      const oldDate = new Date(entity.opportunityCreatedDate.old[NumberConstant.ZERO],
        entity.opportunityCreatedDate.old[NumberConstant.ONE] - NumberConstant.ONE, entity.opportunityCreatedDate.old[NumberConstant.TWO]);
      entity.opportunityCreatedDate.old = this.datepipe.transform(oldDate, this.formatDate);
      const newDate = new Date(entity.opportunityCreatedDate.new[NumberConstant.ZERO],
        entity.opportunityCreatedDate.new[NumberConstant.ONE] - NumberConstant.ONE, entity.opportunityCreatedDate.new[NumberConstant.TWO]);
      entity.opportunityCreatedDate.new = this.datepipe.transform(newDate, this.formatDate);
    }
  }

  private endDateFormat(entity: any) {
    if (entity.opportunityEnddDate) {
      const oldDate = new Date(entity.opportunityEnddDate.old[NumberConstant.ZERO],
        entity.opportunityEndDate.old[NumberConstant.ONE] - NumberConstant.ONE, entity.opportunityEndDate.old[NumberConstant.TWO]);
      entity.opportunityEndDate.old = this.datepipe.transform(oldDate, this.formatDate);
      const newDate = new Date(entity.opportunityEndDate.new[NumberConstant.ZERO],
        entity.opportunityEndDate.new[NumberConstant.ONE] - NumberConstant.ONE, entity.opportunityEndDate.new[NumberConstant.TWO]);
      entity.opportunityEndDate.new = this.datepipe.transform(newDate, this.formatDate);
    }
  }

  getChangedProperties(id: number): string[] | undefined {
    const entityhistory = this.allHistory.find(x => x.id === id);
    const changedArray = entityhistory.modification;
    if (changedArray != null) {
      return Object.keys(changedArray);

    }
  }

  public getChangedValuesByIdAndPropertyAndEntityHistory(id: number, property: string, entityhistory: Entityhistory): string {
    const changedArray = entityhistory.modification;
    return changedArray[property];
  }

  ngOnInit() {

    if (this.sectionType === ComponentsConstant.CRM_SECTION_TYPE) {
      this.entityHistoryService = new EntityHistoryService(
        this.httpClient, this.appConfig, ComponentsConstant.CRM_END_POINT, ComponentsConstant.CRM_SECTION);
      this.genericServiceJava = new GenericServiceJava(this.httpClient, this.appConfig,
        ComponentsConstant.CRM_SECTION, ComponentsConstant.CRM_END_POINT, new HttpHeaders);
    }

    this.changedProperties = [];
    this.getHistory();
    this.oppService.oppSaved.pipe(debounceTime(NumberConstant.FIVE_HUNDRED)).subscribe((data) => {
      this.allHistory = [];
      this.allTemporaryHistory = [];
      this.getHistory();

    });
    this.changedProperty = new ChangedProperty();

  }


}

