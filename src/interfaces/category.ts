export interface Category {
  id: number;
  name: string;
  active: boolean;
  createdAt: Date;
}

export interface CategoriesResponse {
  data: Category[];
  message: string;
}
