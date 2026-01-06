// Types untuk return values dari server actions

export interface Machine {
  id: string;
  name: string;
  locationId: string;
  location: {
    id: string;
    name: string;
    adminId: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Call {
  id: string;
  machineId: string;
  requestedRole: string;
  status: "OPEN" | "IN_PROGRESS" | "CLOSED";
  note: string | null;
  responderId: string | null;
  latitude: number | null;
  longitude: number | null;
  createdAt: Date;
  acceptedAt: Date | null;
  closedAt: Date | null;
  updatedAt: Date;
  machine?: Machine;
  responder?: {
    id: string;
    name: string | null;
    email: string | null;
  } | null;
}

export interface ActionResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}

// Specific response types
export type MachineResponse = ActionResponse<Machine>;
export type CallResponse = ActionResponse<Call>;
export type CallsResponse = ActionResponse<Call[]>;