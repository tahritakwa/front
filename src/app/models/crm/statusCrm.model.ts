export class StatusCrm {
  id: number;
  title: string;
  color: string;
  positionInPipe: number;

  constructor(id: number, title: string, color: string, positionInPipe?: number) {
    this.id = id;
    this.title = title;
    this.color = color;
    this.positionInPipe = positionInPipe ? positionInPipe : undefined;

  }
}
