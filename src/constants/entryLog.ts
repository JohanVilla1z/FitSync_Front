export interface EntryLog {
  logId: number;
  timestamp: string;
  userName: string;
  userLastName: string;
  borrowedEquipment: string[];
  editable: boolean;
}
