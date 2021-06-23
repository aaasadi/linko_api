export interface UserRO {
  id: string;
  email: string;
  created_at: Date;
  update_at: Date;
  token?: string;
}
