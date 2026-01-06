// types/index.ts
export interface Location {
  id: string;
  name: string;
}

export interface AndonCall {
  id: string;
  locationId: string;
  category: string;
  status: 'pending' | 'responded' | 'resolved';
  calledAt: string; // or Date if parsed
  respondedAt?: string;
  resolvedAt?: string;
}