import { Review } from "../entitytypes";

export type CreateUpdateReview = Omit<Review, 'id' | 'date_created' | 'date_updated'>;