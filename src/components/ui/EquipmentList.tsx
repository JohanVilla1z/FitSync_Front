import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { Equipment } from "../../constants/equipment";
import EquipmentTable from "./EquipmentTable";

const EquipmentList = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [equipment, setEquipment] = useState<Equipment[]>([]);

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get<Equipment[]>("/equipment");
        setEquipment(response.data);
      } catch (error) {
        console.error("Error fetching equipment:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEquipment();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Lista de Equipos</h2>
      <EquipmentTable isLoading={isLoading} equipment={equipment} />
    </div>
  );
};

export default EquipmentList;
