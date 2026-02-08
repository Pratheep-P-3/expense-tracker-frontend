import { CategoryApplicableTo } from './category-applicable-to.enum';

export interface Category {
  categoryId: number;
  name: string;
  applicableTo: CategoryApplicableTo;
}
