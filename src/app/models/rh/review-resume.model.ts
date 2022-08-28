import { Resource } from '../shared/ressource.model';
import { Review } from './Review.model';

export class ReviewResume extends Resource {
  ResumeType: number;
  Description: string;
  IdReview: number;
  IdReviewNavigation: Review;
}
