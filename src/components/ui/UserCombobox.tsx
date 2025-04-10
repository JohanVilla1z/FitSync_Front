import { useState } from 'react';
import { User } from '../../constants/User';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './command';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

interface UserComboboxProps {
  users: User[];
  selectedUser: string | null;
  setSelectedUser: (userId: string | null) => void;
  register: any;
  errors: any;
}

export const UserCombobox = ({
  users,
  selectedUser,
  setSelectedUser,
  errors,
}: UserComboboxProps) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const safeUsers = Array.isArray(users) ? users : [];

  const filteredUsers = safeUsers.filter((user) => {
    if (!searchQuery) return true;

    const fullName = `${user.name} ${user.lastName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  const selectedUserName = selectedUser
    ? safeUsers.find((user) => user.id.toString() === selectedUser)?.name ||
      'Seleccionar usuario'
    : 'Seleccionar usuario';

  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
          >
            {selectedUserName}
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-full p-0 bg-white dark:bg-gray-800"
          align="start"
        >
          <Command className="bg-transparent">
            <CommandInput
              placeholder="Buscar usuario..."
              className="border-none focus:ring-0 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList className="text-gray-900 dark:text-gray-200">
              <CommandEmpty className="text-gray-600 dark:text-gray-300">
                No se encontraron usuarios.
              </CommandEmpty>
              <CommandGroup>
                {filteredUsers.map((user) => (
                  <CommandItem
                    key={user.id}
                    value={`${user.name} ${user.lastName}`}
                    onSelect={() => {
                      setSelectedUser(user.id.toString());
                      setOpen(false);
                      setSearchQuery('');
                    }}
                    className="text-gray-900 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {user.name} {user.lastName}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {errors?.userId && (
        <p className="text-red-500 text-sm mt-1">{errors.userId.message}</p>
      )}
    </div>
  );
};
