import type { IMember } from "./member";


export interface IInvitations {
    id?: number;
  family_name: string;
  family_name_snake_case: string;
  custom_message: string;
  members?: IMember[];
  created_at?: string;
}
