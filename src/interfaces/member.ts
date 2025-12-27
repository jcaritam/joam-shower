
export interface IMember {
  id?: number;
  created_at?: string;
  name: string;
  is_attending: boolean | null;
  is_child: boolean | null;
  invitation_id?: number;
}

//   id?: number;
//   name: string;
//   is_attending: boolean;
//   is_child: boolean;
//   invitation_id?: number;