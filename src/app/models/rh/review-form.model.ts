import { Resource } from '../shared/ressource.model';
import { Objective } from './objective.model';
import { ReviewFormation } from './review-formation.model';
import { ReviewSkills } from './review-skills.model';
import { Review } from './Review.model';
import { Interview } from './interview.model';

export class ReviewForm extends Resource {
    Review: Review;
    PastObjective: Objective[];
    FutureObjective: Objective[];
    PastFormation: ReviewFormation[];
    FutureFormation: ReviewFormation[];
    PastReviewSkills: ReviewSkills[];
    FutureReviewSkills: ReviewSkills[];
    Interview: Interview[];
}
