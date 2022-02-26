export interface Project {
  id: number;
  name: string;
  poNumber: string;
  description: string;
  contractor: string;
  status: number;
  pinned: number;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectUnit {
  id: number;
  unitId: number | string;
  unitNumber: string;
  modelName: string;
  projectId: number;
  startDate: string;
  endDate: string;
  days: string;
  budgetTMH: string;
  budgetHMH: string;
  actualTMH: string;
  actualHMH: string;
  unitValue: number;
  adminCost: number;
  estimatedCost: number;
  estimatedProfit: number;
  actualCost: number;
  actualProfit: number;
  status: string;
  description: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}
