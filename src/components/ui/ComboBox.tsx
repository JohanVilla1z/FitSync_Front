import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@radix-ui/react-popover';
import {
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from 'cmdk';
import { Check, ChevronsUpDown, Command } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';
import { cn } from '../../lib/utils';
import { Button } from './Button';

interface ComboBoxProps<T> {
  items: T[];
  selectedItem: string | null;
  setSelectedItem: Dispatch<SetStateAction<string | null>>;
  register: any;
  name: string;
  label: string;
  placeholder: string;
  searchPlaceholder: string;
  errors: any;
  getItemValue: (item: T) => string;
  getItemLabel: (item: T) => string;
  filterItems: (items: T[], searchTerm: string) => T[];
  onSelect?: (value: string) => void;
}

export function ComboBox<T>({
  items,
  selectedItem,
  setSelectedItem,
  register,
  name,
  label,
  placeholder,
  searchPlaceholder,
  errors,
  getItemValue,
  getItemLabel,
  filterItems,
  onSelect,
}: ComboBoxProps<T>) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium mb-1">
        {label}
      </label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={!!selectedItem}
            className="w-full justify-between"
          >
            {selectedItem
              ? getItemLabel(
                  items.find((item) => getItemValue(item) === selectedItem) as T
                )
              : placeholder}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput
              placeholder={searchPlaceholder}
              onInput={(e) => {
                const searchTerm = e.currentTarget.value.toLowerCase();
                filterItems(items, searchTerm);
              }}
            />
            <CommandList>
              <CommandEmpty>No se encontraron resultados.</CommandEmpty>
              <CommandGroup>
                {items.map((item) => {
                  const value = getItemValue(item);
                  return (
                    <CommandItem
                      key={value}
                      value={value}
                      onSelect={() => {
                        setSelectedItem(value);
                        register(name).onChange?.({
                          target: { value },
                        });
                        if (onSelect) onSelect(value);
                      }}
                    >
                      {getItemLabel(item)}
                      <Check
                        className={cn(
                          'ml-auto',
                          selectedItem === value ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {errors[name] && (
        <p className="text-sm text-red-600 mt-1">{errors[name].message}</p>
      )}
    </div>
  );
}
