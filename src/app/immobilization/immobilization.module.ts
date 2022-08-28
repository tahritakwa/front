import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ListActiveComponent } from './active/list-active/list-active.component';
import { CategoryDropdownComponent } from './components/category-dropdown/category-dropdown.component';
import { AddActiveComponent } from './active/add-active/add-active.component';
import { StatusComboboxComponent } from './components/status-combobox/status-combobox.component';
import { ActiveDropdownComponent } from './components/active-dropdown/active-dropdown.component';
import { AddCategoryComponent } from './category/add-category/add-category.component';
import { ImmobilizationTypeComboboxComponent } from './components/immobilization-type-combobox/immobilization-type-combobox.component';
import { ActiveAssignmentComponent } from './active-assignment/active-assignment.component';
import { CategoryService } from './services/category/category.service';
import { ActiveService } from './services/active/active.service';
import { ActiveAssignmentService } from './services/active-assignment/active-assignment.service';
import { StarkPermissionsGuard } from '../stark-permissions/stark-permissions.module';
import {ImmobilizationRoutingModule} from './immobilization.routing.module';
import {AcquisationDateDatepickerComponent} from './components/acquisation-date-datepicker/acquisation-date-datepicker.component';
import { AddEmployeeComponent } from '../payroll/employee/add-employee/add-employee.component';
import { ContractService } from '../payroll/services/contract/contract.service';
import { QualificationService } from '../payroll/services/qualification/qualification.service';

@NgModule({
  imports: [
    SharedModule,
    ImmobilizationRoutingModule
  ],
  declarations: [
    ActiveAssignmentComponent,
    ActiveDropdownComponent,
    AddCategoryComponent,
    ImmobilizationTypeComboboxComponent,
    AcquisationDateDatepickerComponent,
    CategoryDropdownComponent,
    StatusComboboxComponent,
    ListActiveComponent,
    AddActiveComponent

  ],
  exports: [
    AcquisationDateDatepickerComponent,
    CategoryDropdownComponent,
    StatusComboboxComponent,
    ImmobilizationTypeComboboxComponent,
    ListActiveComponent,
    AddActiveComponent,
    AddCategoryComponent
  ],
  providers: [
    CategoryService,
    ActiveService,
    ActiveAssignmentService,
    StarkPermissionsGuard,
    ContractService,
    QualificationService
  ],
  entryComponents: [AddCategoryComponent,
    AddEmployeeComponent]
})
export class ImmobilizationModule {
}

