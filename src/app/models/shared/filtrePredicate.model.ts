export class FiltrePredicateModel {
  label: string;
  reference: string;
  type: string;
  columnName: string;
  isSpecificFiltre: boolean;
  module: string;
  model: string;
  propertyOfParentEntity: string;
  filtreProp: string;
  documentType: string;
  placeHolder: string;
  checkedInput: boolean;
  parentID: number;

  /**
   *
   * @param label
   * @param type
   * @param columnName
   * @param isSpecificFiltre
   * @param module
   * @param model
   * @param propertyOfParentEntity
   * @param filtreProp
   * @param documentType
   * @param placeHolder
   * @param checkedInput
   */
  constructor(label: string, type?: string, columnName?: string, isSpecificFiltre?: boolean
    , module?: string, model?: string, propertyOfParentEntity?: string, filtreProp?: string
    , documentType?: string, placeHolder?: string, checkedInput?: boolean) {
    this.label = label;
    this.type = type;
    this.columnName = columnName;
    this.isSpecificFiltre = isSpecificFiltre;
    this.module = module;
    this.model = model;
    this.propertyOfParentEntity = propertyOfParentEntity;
    this.filtreProp = filtreProp;
    this.documentType = documentType;
    this.placeHolder = placeHolder;
    this.checkedInput = checkedInput;
  }
}
