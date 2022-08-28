import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {MessageService} from 'primeng/components/common/messageservice';
import {TreeNode} from 'primeng/components/common/api';
import {EmployeeService} from '../../services/employee/employee.service';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-organization-chart-employee',
  templateUrl: './organization-chart-employee.component.html',
  styleUrls: ['./organization-chart-employee.component.scss'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class OrganizationChartEmployeeComponent implements OnInit, OnDestroy {
  dataOrganizationChart: TreeNode[];
  dataParentNode: TreeNode;
  classNode;
  organizations: any[] = new Array<any>();
  public uuid = Math.floor(Math.random() * NumberConstant.ONE_THOUSAND);
  private subscriptions: Subscription[] = [];

  constructor(private employeeService: EmployeeService) {
  }

  ngOnInit() {
    this.subscriptions.push(this.employeeService.getAllEmployeesWithInferiors().subscribe(data => {
      data.forEach((x) => {
        this.prepareDataToShow(x);
      });
    }));
  }

  reccursivePrepareNode(data) {
    if (data && data.children && data.children.length > NumberConstant.ZERO) {
      data.children.forEach((x) => {
        this.prepareNodes(x);
        this.reccursivePrepareNode(x);
      });
    }
  }

  prepareNodes(node) {
    if (node) {
      if (node.data.idEmployee === NumberConstant.ZERO) {
        node.data['classNodeContent'] = 'node-content-empty-employee';
      }
      if (node.hasChildren) {
        node.data['classNodeContent'] = 'node-content-selected';
      }
      if (!node.hasChildren) {
        node.data.classNode = 'hidden-node';
      } else {
        node.data.classNode = this.getClassNode(node.expanded);
        node.selectable = true;
      }
      if (!node.data['function']) {
        node.data['function'] = '-';
      }
      if (!node.data['team']) {
        node.data['team'] = '-';
      }
      if (node.data.img) {
        node.data.img = 'data:image/png;base64,' + node.data.img;
      } else {
        node.data.img = '../../../../assets/image/user-new-icon.png';
      }
      node.type = 'person';
      node.styleClass = 'ui-person';
    }
  }

  getClassNode(expanded): string {
    return expanded ? 'fa fa-chevron-down' : 'fa fa-chevron-up';
  }

  /**
   * On node select open one level
   * @param event
   */
  onNodeSelect(event) {
    if (event && event.node && event.node.data && event.node.hasChildren) {
      event.node.expanded = !event.node.expanded;
    }
  }

  public onChangeValueEmployee(event) {
    if (event) {
      this.organizations = [];
      if (!event.selectedEmployee) {
        this.subscriptions.push(this.employeeService.getAllEmployeesWithInferiors().subscribe(data => {
          data.forEach((x) => {
            this.prepareDataToShow(x);
          });
        }));
      } else {
        this.subscriptions.push(this.employeeService.selectedEmployeesWithInferiors(event.selectedEmployee).subscribe(result => {
          this.prepareDataToShow(result);
        }));
      }
    }
  }

  prepareDataToShow(data) {
    this.dataParentNode = data;
    this.prepareNodes(this.dataParentNode);
    this.reccursivePrepareNode(this.dataParentNode);
    this.dataOrganizationChart = new Array<TreeNode>();
    this.dataOrganizationChart.push(this.dataParentNode);
    this.organizations.push(this.dataOrganizationChart);
  }

  ngOnDestroy(): void {
    if (this.subscriptions !== undefined) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
  }
}
