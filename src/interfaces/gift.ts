
export interface IGift {
  assigned_gifts: IAssignedGift[]
  created_at: string;
  description: string;
  id: number;
  product_name: string;
  reference_link: string;
  section: string;
}

export interface IAssignedGift {
  id: number;
  invitation_id: number
}