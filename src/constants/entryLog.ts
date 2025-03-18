export interface EntryLog {
  logId: number;
  timestamp: string;
  userName: string;
  borrowedEquipment: string[];
  editable: boolean;
}
