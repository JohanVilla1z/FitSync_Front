import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { User } from "../../constants";
import UserTable from "./UserTable";

const UserList = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get<User[]>("/user/all");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Lista de Usuarios</h2>
      <UserTable isLoading={isLoading} users={users} />
    </div>
  );
};

export default UserList;
