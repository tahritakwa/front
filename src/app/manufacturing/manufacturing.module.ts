import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {ManufacturingRoutingModule} from './manufacturing-routing.module';
import {SharedModule} from '../shared/shared.module';
import {TooltipModule} from 'ng2-tooltip-directive';
import {AdministrationModule} from '../administration/administration.module';
import {ListNomenclatureComponent} from './nomenclature/list-nomenclature/list-nomenclature.component';
import {NomenclatureService} from './service/nomenclature.service';
import {ProductNomenclatureService} from './service/product-nomenclature.service';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {AddNomenclatureComponent} from './nomenclature/add-nomenclature/add-nomenclature.component';
import {ListMachineComponent} from './machine/list-machine/list-machine.component';
import {DocumentAccountService} from '../accounting/services/document-account/document-account.service';
import {MachineService} from './service/machine.service';
import {AddMachineComponent} from './machine/add-machine/add-machine.component';
import {MachineSpareService} from './service/machine-spare.service';
import {AddFabicationArrangementComponent} from './fabricationArrangement/add-fabication-arrangement/add-fabication-arrangement.component';
import {ListFabricationArrangementComponent} from './fabricationArrangement/list-fabrication-arrangement/list-fabrication-arrangement.component';
import {FabricationArrangementService} from './service/fabrication-arrangement.service';
import {ListAreaComponent} from './area/list-area/list-area.component';
import {AreaService} from './service/area.service';
import {TreeTableModule} from 'ng-treetable';
import {NomenclatureDropdownComponent} from './nomenclature/nomenclature-dropdown/nomenclature-dropdown.component';
import {MachineDropdownComponent} from './machine-dropdown/machine-dropdown.component';
import {GammeDropDownComponent} from './gamme/gamme-drop-down/gamme-drop-down.component';
import {GammeService} from './service/gamme.service';
import {GammeListComponent} from './gamme/gamme-list/gamme-list.component';
import {AddGammeComponent} from './gamme/add-gamme/add-gamme.component';
import {OperationService} from './service/operation.service';
import {BodyModule, GridModule, PDFModule} from '@progress/kendo-angular-grid';
import {TreeNomenclatureComponent} from './nomenclature/composants/tree-nomenclature/tree-nomenclature.component';
import {DetailOperationService} from './service/detail-operation.service';
import {DetailOperationCardComponent} from './components/detail-operation-card/detail-operation-card.component';
import {PDFExportModule} from '@progress/kendo-angular-pdf-export';
import {PurchaseRequestService} from '../purchase/services/purchase-request/purchase-request.service';
import {OperationDropdownComponent} from './components/operation-dropdown/operation-dropdown.component';
import {SectionService} from './service/section.service';
import {ListSectionComponent} from './section/list-section/list-section.component';
import {AddSectionComponent} from './section/add-section/add-section.component';
import {SectionDropdownComponent} from './section/section-dropdown/section-dropdown.component';
import {FabGanttDiagramComponent} from './timeline/fab-gantt-diagram/fab-gantt-diagram.component';
import {DayPilotModule} from 'daypilot-pro-angular';
import {
  ButtonModule,
  CalendarModule,
  CheckboxModule,
  DialogModule,
  DragDropModule,
  InputTextareaModule,
  InputTextModule,
  SelectButtonModule,
  ToggleButtonModule
} from 'primeng/primeng';
import {ScheduleModule} from 'primeng/schedule';
import {MeasureUnitService} from '../shared/services/mesure-unit/measure-unit.service';
import {SideNavManufService} from './service/side-nav-manuf.service';
import {ChartsComponent} from './charts/charts.component';
import {ChartService} from './service/chart.service';
import {ChartsModule} from 'ng2-charts';
import {OperationListComponent} from './operation/operation-list/operation-list.component';
import {AddOperationComponent} from './operation/add-operation/add-operation.component';
import {DetailOfService} from './service/detail-of.service';
import {OfService } from './service/of.service';
import {ContractService} from '../payroll/services/contract/contract.service';
import {GammeVisualisationComponent} from './gamme-visualisation/gamme-visualisation.component';
import {LaunchFabricationArrangementComponent} from './fabricationArrangement/launch-fabrication-arrangement/launch-fabrication-arrangement.component';
import { ModalFabricationArrangement } from './fabricationArrangement/modal-fabrication-arragement/modal-fabrication-arrangement.component';
import {NeedsPerOperationComponent} from './needs-per-operation/needs-per-operation.component';
import { OperationsGammeDropdownComponent } from './components/operations-dropdown/operations-gamme-dropdown/operations-gamme-dropdown.component';
import { DropdownAreaComponent } from './dropdown-area/dropdown-area.component';
import {GammeOperationService} from './service/gamme-operation.service';
import {AdvancedSearchProductionService} from './advanced-search-shared/advanced-search-production.service';
import {AddMeasureUnitComponent} from '../inventory/components/add-measure-unit/add-measure-unit.component';
import {UnitOfMesureJavaService} from './service/unit-of-mesure-java-service.service';
import {ManufacturingConfigurationService} from './configuration/manufacturing-configuration.service';
import {GammeFlowchartComponent} from './gamme-visualisation/flowchart/gamme-flowchart.component';
import {
  DataBindingService,
  DiagramAllModule,
  DiagramModule,
  HierarchicalTreeService,
  OverviewAllModule, PrintAndExport
} from '@syncfusion/ej2-angular-diagrams';
import {BrowserModule} from '@angular/platform-browser';

// @ts-ignore
@NgModule({
  imports: [
    CommonModule,
    ManufacturingRoutingModule,
    SharedModule.forRoot(),
    NgbModule.forRoot(),
    TooltipModule,
    AdministrationModule,
    TreeTableModule,
    GridModule,
    PDFModule,
    PDFExportModule,
    DayPilotModule,
    ScheduleModule, DialogModule, CalendarModule, ToggleButtonModule,
    DragDropModule, ButtonModule, InputTextareaModule, CheckboxModule, InputTextModule, SelectButtonModule,
    ChartsModule, BodyModule,
    DiagramModule, DiagramAllModule, OverviewAllModule
  ],
  providers: [
    HierarchicalTreeService, DataBindingService,
    ManufacturingConfigurationService,
    AdvancedSearchProductionService,
    GammeOperationService,
    MeasureUnitService,
    PurchaseRequestService,
    NomenclatureService,
    ProductNomenclatureService,
    AreaService,
    FabricationArrangementService,
    DocumentAccountService,
    MachineService,
    SectionService,
    MachineSpareService,
     GammeService,
     GammeOperationService,
    OperationService,
    DatePipe,
    DetailOperationService,
    SideNavManufService,
    ChartService,
    ContractService,
    DetailOfService,
    OfService,
    UnitOfMesureJavaService
  ],
  declarations: [
    GammeFlowchartComponent,
    NeedsPerOperationComponent,
    GammeVisualisationComponent,
    ListNomenclatureComponent,
    AddNomenclatureComponent,
    ListAreaComponent,
    AddFabicationArrangementComponent,
    ListFabricationArrangementComponent,
    ListMachineComponent,
    AddMachineComponent,
    ListSectionComponent,
    AddSectionComponent,
    SectionDropdownComponent,
    NomenclatureDropdownComponent,
    MachineDropdownComponent,
    GammeDropDownComponent,
    GammeListComponent,
    AddGammeComponent,
    TreeNomenclatureComponent,
    DetailOperationCardComponent,
    OperationDropdownComponent,
    FabGanttDiagramComponent,
    ChartsComponent,
    OperationListComponent,
    AddOperationComponent,
    LaunchFabricationArrangementComponent,
    ModalFabricationArrangement,
    OperationsGammeDropdownComponent,
    DropdownAreaComponent,

  ],
  entryComponents: [
     ModalFabricationArrangement, AddMeasureUnitComponent
  ]

})

export class ManufacturingModule {

}
