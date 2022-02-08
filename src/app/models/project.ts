export interface Project {
  id: number;
  name: string;
  poNumber: string;
  description: string;
  contractor: string;
  status: number;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectUnit {
  id: number;
  unitId: number | string;
  unitNumber: string;
  unitName: string;
  projectId: number;
  startDate: string;
  endDate: string;
  days: string;
  estimatedExpense: number;
  estimatedProfit: number;
  estimatedAmount: number;
  status: string;
  budgetTMH: string;
  budgetHMH: string;
  actualTMH: string;
  actualHMH: string;
  description: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}
