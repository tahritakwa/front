import { Project } from './project.model';
import { AdrDetail } from './adr-detail';
import { Document } from './document.model';

export class ProjectDetail {
    Project: Project;
    AdrDetails: AdrDetail[];
    IdDocument: number;
    IdDocumentNavigation: Document;
}
