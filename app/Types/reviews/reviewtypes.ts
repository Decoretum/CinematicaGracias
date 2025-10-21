import { Review } from "../entitytypes";

export type CreateUpdateReview = Omit<Review, 'id' | 'date_updated'>;