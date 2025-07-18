// Types for /api/accounts endpoint
export interface Account {
  accountId: string;
  userName: string;
  email: string;
  password: string;
  role: string;
  profileId: string;
  creationDate: string;
}

export interface AccountsResponse {
  success: boolean;
  message: string;
  data: Account[];
  errors?: {
    additionalProp1?: string;
    additionalProp2?: string;
    additionalProp3?: string;
  };
}

// Account Roles - chỉ 3 roles như bạn yêu cầu
export const AccountRole = {
  MEMBER: 'MEMBER',
  STAFF: 'STAFF',
  ADMIN: 'ADMIN'
} as const;

export type AccountRoleType = typeof AccountRole[keyof typeof AccountRole];
