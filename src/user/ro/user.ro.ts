export interface UserRO {
  id: string;
  name: string;
  email: string;
  verified: boolean;
  created_at: Date;
  update_at: Date;
  verifyID?: string;
  token?: string;
}
