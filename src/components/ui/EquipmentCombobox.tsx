import { useState } from 'react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './command';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

interface EquipmentComboboxProps {
  equipment: any[];
  selectedEquipment: string | null;
  setSelectedEquipment: (equipmentId: string | null) => void;
  register: any;
  errors: any;
}

export const EquipmentCombobox = ({
  equipment,
  selectedEquipment,
  setSelectedEquipment,
  errors,
}: EquipmentComboboxProps) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const safeEquipment = Array.isArray(equipment) ? equipment : [];

  const availableEquipment = safeEquipment.filter(
    (item) => item.available === true
  );

  const filteredEquipment = availableEquipment.filter((item) => {
    if (!searchQuery) return true;

    const equipmentText =
      `${item.name} ${item.description || ''}`.toLowerCase();
    return equipmentText.includes(searchQuery.toLowerCase());
  });

  const selectedEquipmentName = selectedEquipment
    ? safeEquipment.find((item) => item.id.toString() === selectedEquipment)
        ?.name || 'Seleccionar equipo'
    : 'Seleccionar equipo';

  const comboboxId = 'equipment-combobox';

  return (
    <div className="relative">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            id={comboboxId}
            role="combobox"
            aria-expanded={open}
            aria-haspopup="listbox"
            aria-controls={`${comboboxId}-list`}
            aria-label="Seleccionar equipo"
            className="w-full justify-between bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
          >
            {selectedEquipmentName}
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-full p-0 bg-white dark:bg-gray-800"
          align="start"
        >
          <Command className="bg-transparent">
            <CommandInput
              placeholder="Buscar equipo..."
              className="border-none focus:ring-0 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
              value={searchQuery}
              onValueChange={setSearchQuery}
              aria-autocomplete="list"
            />
            <CommandList
              id={`${comboboxId}-list`}
              className="text-gray-900 dark:text-gray-200"
            >
              <CommandEmpty className="text-gray-600 dark:text-gray-300">
                No hay equipos disponibles.
              </CommandEmpty>
              <CommandGroup>
                {filteredEquipment.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={item.name}
                    role="option"
                    aria-selected={selectedEquipment === item.id.toString()}
                    onSelect={() => {
                      setSelectedEquipment(item.id.toString());
                      setOpen(false);
                      setSearchQuery('');
                    }}
                    className="text-gray-900 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700 cursor-pointer"
                  >
                    {item.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {errors?.equipmentId && (
        <p className="text-red-500 text-sm mt-1" role="alert">
          {errors.equipmentId.message}
        </p>
      )}
    </div>
  );
};
