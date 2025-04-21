import axiosInstance from '../api/axiosInstance';
import { Equipment } from '../constants/equipment';

export interface EquipmentPage {
  content: Equipment[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}

export async function fetchEquipments(
  page = 0,
  size = 10,
  search?: string,
  status?: string
): Promise<EquipmentPage> {
  const params: any = { page, size };
  if (search) params.search = search;
  if (status && status !== 'todos') params.status = status;
  try {
    const response = await axiosInstance.get('/equipment', { params });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
}

export async function createEquipment(
  newEquipment: Omit<Equipment, 'id'>
): Promise<Equipment> {
  const response = await axiosInstance.post('/equipment', newEquipment);
  return response.data;
}

export async function updateEquipment(
  updatedEquipment: Equipment
): Promise<Equipment> {
  const { id, ...equipmentData } = updatedEquipment;
  const response = await axiosInstance.put(`/equipment/${id}`, equipmentData);
  return response.data;
}
