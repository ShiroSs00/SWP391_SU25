// Achievement Management Types
export interface Achievement {
  achievementName: string;
  description: string;
  minValue: number;
  maxValue: number;
}

export interface AchievementApiResponse {
  success: boolean;
  message: string;
  data: Achievement[];
  errors: {
    additionalProp1?: string;
    additionalProp2?: string;
    additionalProp3?: string;
  };
}
