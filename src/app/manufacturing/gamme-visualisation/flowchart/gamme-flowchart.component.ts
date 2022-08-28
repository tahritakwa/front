import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {
  ConnectorModel,
  DiagramComponent,
  DiagramConstraints,
  DiagramTools,
  IExportOptions,
  NodeModel,
  Rect,
  ScrollSettingsModel,
  SnapConstraints,
  SnapSettingsModel
} from '@syncfusion/ej2-angular-diagrams';
import {DataManager} from '@syncfusion/ej2-data';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-gamme-flowchart',
  templateUrl: './gamme-flowchart.component.html',
  styleUrls: ['./gamme-flowchart.component.css']
})
export class GammeFlowchartComponent implements OnInit {
  @ViewChild('diagram') public diagram: DiagramComponent;
  @Input() gammeToBeDisplayedInGraph;
  public tool: DiagramTools = DiagramTools.None;
  public snapSettings: SnapSettingsModel = {constraints: SnapConstraints.None};
  public scrollSettings: ScrollSettingsModel = {scrollLimit: 'Infinity'};
  private exportFileName = '';
  public flowshapes = [
    {type: 'Flow', shape: 'Extract'},
    {type: 'Flow', shape: 'Merge'},
    {type: 'Flow', shape: 'Decision'},
    {type: 'Image', source: '../../../../assets/image/cut.jfif'},
    {type: 'Basic', shape: 'Ellipse'},
    {type: 'Flow', shape: 'Process'},
  ];
  public graphData: Object[] = [];

  public nodeDefaults(node: NodeModel): NodeModel {
    const codes: Object = {
      MP: 'rgb(0, 139,139)',
      Operation: 'rgb(80, 255,215)',
      ProductNomenclature: 'rgb(91, 207, 131)',
      Machine: 'rgb(190, 237, 230)',
      Responsible: 'rgb(126, 179, 36)',
    };
    node.width = 80;
    node.height = 60;
    node.annotations = [
      {
        offset: (node.data as ChartInfo).Type === 'Operation' || (node.data as ChartInfo).Type === 'Machine' ? {x: 0.5, y: 0.5} :
          (node.data as ChartInfo).Type === 'ProductNomenclature' ? {x: 1, y: 1} : {x: 0.5, y: 1},
        content: (node.data as ChartInfo).Name,
        verticalAlignment: (node.data as ChartInfo).Type === 'ProductNomenclature' ? 'Bottom' : 'Center',
        horizontalAlignment: (node.data as ChartInfo).Type === 'MP' ? 'Left' :
          (node.data as ChartInfo).Type === 'ProductNomenclature' ? 'Right' : 'Center',
        style: {
          color: 'black', textAlign: 'Justify',
          textOverflow: 'Wrap',
          textWrapping: 'WrapWithOverflow',
          fontSize: 14,
          bold: true,
        },
      }
    ];
    node.style.fill = codes[(node.data as ChartInfo).Type];
    node.shape = (node.data as ChartInfo).Shape;
    return node;
  }

  constructor(private translateService: TranslateService) {
  }

  public connDefaults(connector: ConnectorModel): void {
    connector.type = 'Orthogonal';
    connector.cornerRadius = 7;
    connector.targetDecorator.height = 7;
    connector.targetDecorator.width = 7;
    connector.style.strokeColor = '#6d6d6d';
  }

  ngOnInit(): void {
    this.diagram.constraints = DiagramConstraints.None;
    this.getGammeData();
    this.setDataToDiagram();
    this.addBackgroundImageToGraphVue();
    this.getFileName();
  }

  getFileName() {
    this.exportFileName = this.translateService.instant('GRAPH_VUE') +
      this.gammeToBeDisplayedInGraph.reference + '(' + this.gammeToBeDisplayedInGraph.article + ')';
  }

  setDataToDiagram() {
    this.diagram.layout = {
      type: 'ComplexHierarchicalTree',
      enableAnimation: true,
      horizontalSpacing: 60,
      verticalSpacing: 50,
      horizontalAlignment: 'Center',
      verticalAlignment: 'Center',
    };
    this.diagram.dataSourceSettings = {
      id: 'Name',
      parentId: 'ParentNode',
      dataManager: new DataManager(this.graphData)
    };
  }

  addBackgroundImageToGraphVue() {
    // Defines the pageSettings for the diagram
    this.diagram.pageSettings = {
      orientation: 'Portrait',
      // Defines the background Image source
      background: {
        source: '../../../../assets/image/Visualisation_gamme.png',
        // Defines the scale values for the background image
        scale: 'Meet',
        // Defines the align values for the background image
        align: 'XMinYMid'
      },
      boundaryConstraints: 'Infinity',
      width: 150,
      height: 400,
    };
  }

  getGammeData() {
    for (let index = 0; index < this.gammeToBeDisplayedInGraph.gammeOperations.length; index++) {
      this.pushOperationToGraphVue(index);
      this.pushProductNomenclatureToGraphVue(index);
      this.pushMaterialToGraphVue(index);
      this.pushPersonsToGraphVue(index);
    }
    /******* push PF ****/
    this.graphData.push({
      Name: this.gammeToBeDisplayedInGraph.article,
      ParentNode: this.gammeToBeDisplayedInGraph.gammeOperations
        [this.gammeToBeDisplayedInGraph.gammeOperations.length - NumberConstant.ONE].operation.description,
      Type: 'MP',
      Shape: this.flowshapes[1]
    });
  }

  pushOperationToGraphVue(index) {
    this.graphData.push({
      Name: this.gammeToBeDisplayedInGraph.gammeOperations[index].operation.description,
      ParentNode: this.prepareOperationParentID(index),
      Type: 'Operation',
      Shape: this.flowshapes[4]
    });
  }

  prepareOperationParentID(index) {
    const parentNodeData = [];
    if (index > 0) {
      parentNodeData.push(this.gammeToBeDisplayedInGraph.gammeOperations[index - NumberConstant.ONE].operation.description);
    }
    if (this.gammeToBeDisplayedInGraph.gammeOperations[index].productNomenclatures.length > NumberConstant.ZERO) {
      this.gammeToBeDisplayedInGraph.gammeOperations[index].productNomenclatures.forEach(product => {
        parentNodeData.push(product.articleName.replaceAll('\'', ' '));
      });
    }
    if (this.gammeToBeDisplayedInGraph.gammeOperations[index].responsibles.length > NumberConstant.ZERO) {
      this.gammeToBeDisplayedInGraph.gammeOperations[index].responsibles.forEach(responsible => {
        parentNodeData.push(responsible.email.replaceAll('\'', ' '));
      });
    }
    if (this.gammeToBeDisplayedInGraph.gammeOperations[index].machines.length > NumberConstant.ZERO) {
      this.gammeToBeDisplayedInGraph.gammeOperations[index].machines.forEach(machine => {
        parentNodeData.push(machine.description.replaceAll('\'', ' '));
      });
    }
    return parentNodeData;
  }

  pushProductNomenclatureToGraphVue(index) {
    if (this.gammeToBeDisplayedInGraph.gammeOperations[index].productNomenclatures.length > NumberConstant.ZERO) {
      this.gammeToBeDisplayedInGraph.gammeOperations[index].productNomenclatures.forEach(product => {
        this.graphData.push({
          Name: product.articleName.replaceAll('\'', ' '),
          Type: 'ProductNomenclature',
          Shape: this.flowshapes[0]
        });
      });
    }
  }

  pushMaterialToGraphVue(index) {
    if (this.gammeToBeDisplayedInGraph.gammeOperations[index].machines.length > NumberConstant.ZERO) {
      this.gammeToBeDisplayedInGraph.gammeOperations[index].machines.forEach(machine => {
        this.graphData.push({
          Name: machine.description.replaceAll('\'', ' '),
          Type: 'Machine',
          Shape: this.flowshapes[5]
        });
      });
    }
  }

  pushPersonsToGraphVue(index) {
    if (this.gammeToBeDisplayedInGraph.gammeOperations[index].responsibles.length > NumberConstant.ZERO) {
      this.gammeToBeDisplayedInGraph.gammeOperations[index].responsibles.forEach(responsible => {
        this.graphData.push({
          Name: responsible.email.replaceAll('\'', ' '),
          Type: 'Responsible',
          Shape: this.flowshapes[2]
        });
      });
    }
  }


  exportDiagramAsPng() {
    const options: IExportOptions = {};
    options.mode = 'Download';
    options.format = 'SVG';
    options.fileName = this.exportFileName;
    options.multiplePage = false;
    options.margin = { left: 10, right: 10, top: 10, bottom: 10 };
    options.region = 'CustomBounds';
    options.bounds = new Rect(0, 0, 1500, 1500);
    options.pageHeight = 700;
    options.pageWidth = 700;
    this.diagram.exportDiagram(options);
  }
}

export interface ChartInfo {
  Name: string;
  Type: string;
  Color: string;
  Shape;
}
