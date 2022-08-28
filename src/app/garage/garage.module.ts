import { NgModule } from '@angular/core';
import { CldrIntlService, IntlService } from '@progress/kendo-angular-intl';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { PDFModule, SchedulerModule } from '@progress/kendo-angular-scheduler';
import { SharedModule } from '../shared/shared.module';
import { AddPostComponent } from './components/add-post/add-post.component';
import { GarageDropdownComponent } from './components/garage-dropdown/garage-dropdown.component';
import { GridMachineComponent } from './components/grid-machine/grid-machine.component';
import { GridOperationComponent } from './components/grid-operation/grid-operation.component';
// tslint:disable-next-line: max-line-length
import { InterventionOrderTypeDropdownComponent } from './components/intervervention-order-type-dropdown/intervention-order-type-dropdown.component';
// tslint:disable-next-line: max-line-length
import { ListOperationGridForHistoryComponent } from './components/list-operation-grid-for-history/list-operation-grid-for-history.component';
import { MachineDropdownComponent } from './components/machine-dropdown/machine-dropdown.component';
import { MachineStateDropdownComponent } from './components/machine-state-dropdown/machine-state-dropdown.component';
import { OperationDropdownComponent } from './components/operation-dropdown/operation-dropdown.component';
// tslint:disable-next-line:max-line-length
import { VehicleInformationComponent } from './components/vehicle-information/vehicle-information.component';
import { VehicleInterventionListComponent } from './components/vehicle-intervention-list/vehicle-intervention-list.component';
import { WorkerDropdownComponent } from './components/worker-dropdown/worker-dropdown.component';
import { GarageRoutingModule } from './garage-routing.module';
import { AddGarageComponent } from './garage/add-garage/add-garage.component';
import { ListGarageComponent } from './garage/list-garage/list-garage.component';
import { AddInterventionOrderComponent } from './intervention-order/add-intervention-order/add-intervention-order.component';
import { ListInterventionOrderComponent } from './intervention-order/list-intervention-order/list-intervention-order.component';
import { AddMachineComponent } from './machine/add-machine/add-machine.component';
import { ListMachineComponent } from './machine/list-machine/list-machine.component';
import { AddOperationComponent } from './operation/add-operation/add-operation.component';
import { ListOperationComponent } from './operation/list-operation/list-operation.component';
import { InterventionService } from './services/intervention/intervention.service';
import { WorkerService } from './services/worker/worker.service';
import { MachineService } from './services/machine/machine.service';
import { ListUnitComponent } from './unit/list-unit/list-unit.component';
import { AddUnitComponent } from './unit/add-unit/add-unit.component';
import { UnitService } from './services/unit/unit.service';
import { UnitTypeDropdownComponent } from './components/unit-type-dropdown/unit-type-dropdown.component';
import { CanDeactivateGuard } from '../shared/services/can-deactivate-guard.service';
import { WorkerTypeDropdownComponent } from './components/worker-type-dropdown/worker-type-dropdown.component';
import { OperationService } from './services/operation/operation.service';
import { VehicleService } from './services/vehicle/vehicle.service';
import { ListWorkerComponent } from './worker/list-worker/list-worker.component';
import { AddWorkerComponent } from './worker/add-worker/add-worker.component';
import { AddVehicleModelComponent } from './vehicle-model/add-vehicle-model/add-vehicle-model.component';
import { ListVehicleModelComponent } from './vehicle-model/list-vehicle-model/list-vehicle-model.component';
import { AddVehicleBrandComponent } from './vehicle-brand/add-vehicle-brand/add-vehicle-brand.component';
import { ListVehicleBrandComponent } from './vehicle-brand/list-vehicle-brand/list-vehicle-brand.component';
import { MachineOperationsComponent } from './components/machine-operations/machine-operations.component';
import { UnitDropdownComponent } from './components/unit-dropdown/unit-dropdown.component';
import { ListOperationTypeComponent } from './operation-type/list-operation-type/list-operation-type.component';
import { AddOperationTypeComponent } from './operation-type/add-operation-type/add-operation-type.component';
import { OperationTypeService } from './services/operation-type/operation-type.service';
import { OperationTypeDropdownComponent } from './components/operation-type-dropdown/operation-type-dropdown.component';
import { EnergyDropdownComponent } from './components/energy-dropdown/energy-dropdown.component';
import { VehicleTypeDropdownComponent } from './components/vehicle-type-dropdown/vehicle-type-dropdown.component';
import { VehicleTypeService } from './services/vehicle-type/vehicle-type.service';
import { VehicleEnergyService } from './services/vehicle-energy/vehicle-energy.service';
import { VehicleBrandService } from './services/vehicle-brand/vehicle-brand.service';
import { VehicleModelService } from './services/vehicle-model/vehicle-model.service';
import { GarageService } from './services/garage/garage.service';
import { GridWorkerComponent } from './components/grid-worker/grid-worker.component';
import { MachineGarageDropdownComponent } from './components/machine-garage-dropdown/machine-garage-dropdown.component';
import { ReceptionForOrderInterventionComponent
} from './components/reception-for-order-intervention/reception-for-order-intervention.component';
import { BarRatingModule } from 'ngx-bar-rating';
import { ImageDrawingModule } from 'ngx-image-drawing';
import { ImageDrawingVehiculeForOrderInterventionPopUpComponent
 } from './components/image-drawing-vehicule-for-order-intervention-pop-up/image-drawing-vehicule-for-order-intervention-pop-up.component';
import { OperationsProposedPopUpComponent } from './components/operations-proposed-pop-up/operations-proposed-pop-up.component';
import { MileageService } from './services/mileage/mileage.service';
import { MileageDropdownComponent } from './components/mileage-dropdown/mileage-dropdown.component';
import { OperationStatusDropdownComponent } from './components/operation-status-dropdown/operation-status-dropdown.component';
import { OperationValidateByDropdownComponent } from './components/operation-validate-by-dropdown/operation-validate-by-dropdown.component';
import { InterventionOperationEditorComponent } from './components/intervention-operation-editor/intervention-operation-editor.component';
import { InterventionOperationService } from './services/intervention-operation.service';
import { OperationForInterventionOrderComponent
 } from './intervention-order/operation-for-intervention-order/operation-for-intervention-order.component';
import { OperationsProposedGridComponent } from './components/operations-proposed-grid/operations-proposed-grid.component';
import { HistoryForOrderInterventionComponent } from './components/history-for-order-intervention/history-for-order-intervention.component';
// tslint:disable-next-line:max-line-length
import { TimelineForOrderInterventionComponent } from './components/timeline-for-order-intervention/timeline-for-order-intervention.component';
import { AddInterventionOperationsComponent } from './components/add-intervention-operations/add-intervention-operations.component';
import { SparePartForInterventionComponent } from './components/spare-part-for-intervention/spare-part-for-intervention.component';
import { SearchItemAddComponent } from '../sales/search-item/search-item-add/search-item-add.component';
import { StockDocumentsService } from '../inventory/services/stock-documents/stock-documents.service';
import { AddOperationProposedComponent } from './operation-proposed/add-operation-proposed/add-operation-proposed.component';
import { ListCustomerVehicleComponent } from './vehicle/customer-vehicle/list-customer-vehicle/list-customer-vehicle.component';
import { AddVehicleComponent } from './components/add-vehicle/add-vehicle.component';
import { AddCustomerVehicleComponent } from './vehicle/customer-vehicle/add-customer-vehicle/add-customer-vehicle.component';
import { ListLoanVehicleComponent } from './vehicle/loan-vehicle/list-loan-vehicle/list-loan-vehicle.component';
import { AddLoanVehicleComponent } from './vehicle/loan-vehicle/add-loan-vehicle/add-loan-vehicle.component';
import { ListOperationKitComponent } from './operation-kit/list-operation-kit/list-operation-kit.component';
import { AddOperationKitComponent } from './operation-kit/add-operation-kit/add-operation-kit.component';
import { GridSparePartsComponent } from './components/grid-spare-parts/grid-spare-parts.component';
import { OperationKitService } from './services/operation-kit/operation-kit.service';
import { OperationKitItemService } from './services/operation-kit-item/operation-kit-item.service';
import { OperationKitOperationService } from './services/operation-kit-operation/operation-kit-operation.service';
import { ListOperationProposedComponent } from './operation-proposed/list-operation-proposed/list-operation-proposed.component';
import { OperationForKitOperationComponent } from './components/operation-for-kit-operation/operation-for-kit-operation.component';
import { OperationKitDropdownComponent } from './components/operation-kit-dropdown/operation-kit-dropdown.component';
import { OprationKitMultiselectComponent } from './components/opration-kit-multiselect/opration-kit-multiselect.component';
import { OperationKitSelectedComponent } from './components/operation-kit-selected/operation-kit-selected.component';
import { OperationKitOperationPopUpComponent } from './components/operation-kit-operation-pop-up/operation-kit-operation-pop-up.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { GridCustomerPartComponent } from './components/grid-customer-part/grid-customer-part.component';
import { AddInterventionLoanVehicleComponent } from './components/add-intervention-loan-vehicle/add-intervention-loan-vehicle.component';
import { InterventionLoanVehicleService } from './services/intervention-loan-vehicle/intervention-loan-vehicle.service';
import { LoanVehicleHistoryComponent } from './components/loan-vehicle-history/loan-vehicle-history.component';
import { CustomerVehicleHistoryComponent } from './components/customer-vehicle-history/customer-vehicle-history.component';
import { AppointmentRequestComponent } from './planning/appointment/appointment-request/appointment-request.component';
import { ResourceAllocationComponent } from './planning/resource-allocation/resource-allocation/resource-allocation.component';
import { PostDropdownComponent } from './components/post-dropdown/post-dropdown.component';
import { PostService } from './services/post/post.service';
import { AddAppointmentPopUpComponent } from './components/add-appointment-pop-up/add-appointment-pop-up.component';
import { AppointmentService } from './services/appointment/appointment.service';
import { Ng2TelInputModule } from 'ng2-tel-input';
import { WorkerResolverService } from './resolvers/worker-resolver.service';
import { GarageResolverService } from './resolvers/garage-resolver.service';
import { GarageSettingsService } from './services/garage-settings/garage-settings.service';
import { LoanVehicleDropdownComponent } from './components/loan-vehicle-dropdown/loan-vehicle-dropdown.component';
import { OemService } from '../inventory/services/oem/oem.service';
import { AddRepairOrderComponent } from './repair-order/add-repair-order/add-repair-order.component';
import { RepairOrderService } from './services/repair-order/repair-order.service';
import { RepairOrderItemService } from './services/repair-order-item/repair-order-item.service';
import { RepairOrderOperationService } from './services/repair-order-operation/repair-order-operation.service';
import { RepairOrderOperationKitService } from './services/repair-order-operation-kit/repair-order-operation-kit.service';
import { ListRepairOrderComponent } from './repair-order/list-repair-order/list-repair-order.component';
import { OperationToBePerformedComponent } from './components/operation-to-be-performed/operation-to-be-performed.component';
import { SendReminderSmsComponent } from './components/reminder-sms/send-reminder-sms/send-remider-sms.component';
import { SmsService } from './services/sms/sms.service';
import { ReminderSmsListComponent } from './components/reminder-sms/reminder-sms-list/reminder-sms-list.component';
import { SmsBodyEditorComponent } from './components/sms-body-editor/sms-body-editor.component';
import { SmsTiersService } from './services/sms-tiers/sms-tiers.service';
@NgModule({
    imports: [
        SharedModule.forRoot(),
        GarageRoutingModule,
        BarRatingModule,
        SchedulerModule,
        PDFModule,
        LayoutModule,
        ImageDrawingModule,
        NgMultiSelectDropDownModule,
        Ng2TelInputModule
    ],
    declarations: [
        AddVehicleComponent,
        ListOperationComponent,
        ListMachineComponent,
        AddOperationComponent,
        ListGarageComponent,
        AddMachineComponent,
        GridOperationComponent,
        OperationDropdownComponent,
        MachineStateDropdownComponent,
        GridMachineComponent,
        MachineDropdownComponent,
        AddPostComponent,
        AddGarageComponent,
        VehicleInterventionListComponent,
        ListOperationGridForHistoryComponent,
        ListInterventionOrderComponent,
        AddInterventionOrderComponent,
        InterventionOrderTypeDropdownComponent,
        VehicleInformationComponent,
        WorkerDropdownComponent,
        ListUnitComponent,
        AddUnitComponent,
        UnitTypeDropdownComponent,
        ListWorkerComponent,
        AddWorkerComponent,
        WorkerTypeDropdownComponent,
        MachineOperationsComponent,
        UnitDropdownComponent,
        OperationTypeDropdownComponent,
        ListOperationTypeComponent,
        AddOperationTypeComponent,
        AddVehicleBrandComponent,
        ListVehicleBrandComponent,
        AddVehicleModelComponent,
        ListVehicleModelComponent,
        EnergyDropdownComponent,
        VehicleTypeDropdownComponent,
        GridWorkerComponent,
        MachineGarageDropdownComponent,
        ReceptionForOrderInterventionComponent,
        ImageDrawingVehiculeForOrderInterventionPopUpComponent,
        OperationsProposedPopUpComponent,
        MileageDropdownComponent,
        OperationForInterventionOrderComponent,
        AddInterventionOperationsComponent,
        OperationsProposedGridComponent,
        OperationStatusDropdownComponent,
        OperationValidateByDropdownComponent,
        HistoryForOrderInterventionComponent,
        TimelineForOrderInterventionComponent,
        InterventionOperationEditorComponent,
        SparePartForInterventionComponent,
        ListOperationProposedComponent,
        AddOperationProposedComponent,
        AddLoanVehicleComponent,
        ListLoanVehicleComponent,
        AddCustomerVehicleComponent,
        ListCustomerVehicleComponent,
        ListOperationKitComponent,
        AddOperationKitComponent,
        GridSparePartsComponent,
        OperationForKitOperationComponent,
        OperationKitDropdownComponent,
        OprationKitMultiselectComponent,
        OperationKitSelectedComponent,
        OperationKitOperationPopUpComponent,
        GridCustomerPartComponent,
        ListCustomerVehicleComponent,
        AddInterventionLoanVehicleComponent,
        LoanVehicleHistoryComponent,
        CustomerVehicleHistoryComponent,
        AppointmentRequestComponent,
        ResourceAllocationComponent,
        PostDropdownComponent,
        AddAppointmentPopUpComponent,
        LoanVehicleDropdownComponent,
        ListRepairOrderComponent,
        AddRepairOrderComponent,
        OperationToBePerformedComponent,
        SendReminderSmsComponent,
        ReminderSmsListComponent,
        SmsBodyEditorComponent,
    ],
    providers: [
        {
            provide: IntlService,
            useExisting: CldrIntlService
        },
        StockDocumentsService,
        CanDeactivateGuard,
        InterventionService,
        MachineService,
        WorkerService,
        UnitService,
        OperationService,
        OperationTypeService,
        VehicleService,
        VehicleModelService,
        VehicleBrandService,
        VehicleTypeService,
        VehicleEnergyService,
        GarageService,
        MileageService,
        InterventionOperationService,
        OperationKitService,
        OperationKitItemService,
        OperationKitOperationService,
        InterventionLoanVehicleService,
        PostService,
        AppointmentService,
        WorkerResolverService,
        GarageResolverService,
        GarageSettingsService,
        OemService,
        RepairOrderService,
        RepairOrderItemService,
        RepairOrderOperationService,
        RepairOrderOperationKitService,
        SmsService,
        SmsTiersService
    ],
    entryComponents: [
        MachineOperationsComponent,
        ImageDrawingVehiculeForOrderInterventionPopUpComponent,
        OperationsProposedPopUpComponent,
        AddInterventionOperationsComponent,
        InterventionOperationEditorComponent,
        SearchItemAddComponent,
        OperationKitOperationPopUpComponent,
        OperationKitSelectedComponent,
        AddInterventionLoanVehicleComponent,
        AddAppointmentPopUpComponent,
        SmsBodyEditorComponent,
        SendReminderSmsComponent
    ]
})
export class GarageModule { }
