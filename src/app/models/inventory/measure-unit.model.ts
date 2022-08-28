import { Resource } from '../shared/ressource.model';

export class MeasureUnit extends Resource {
  Label: string; MeasureUnitCode: string;
  Description: string;
  IsDecomposable: boolean;
  DigitsAfterComma: number;
}
