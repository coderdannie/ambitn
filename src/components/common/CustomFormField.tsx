'use client';
import { useState } from 'react';
import { Control, FieldValues, Path } from 'react-hook-form';
import { Input } from '../ui/input'; // Your ShadCN Input component
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'; // Your ShadCN Form components
import { FaEye } from 'react-icons/fa';
import { BiHide } from 'react-icons/bi';

type CustomFormFieldProps<T extends FieldValues> = {
  name: Path<T>;
  control?: Control<T>;
  showPasswordToggle?: boolean;
  isPassword?: boolean;
  placeholder?: string;
  value?: string;
  label: string;
  onFocus?: () => void;
  onBlur?: () => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  icon?: React.ReactNode;
  readOnly?: boolean;
};

export function CustomFormField<T extends FieldValues>({
  name,
  control,
  showPasswordToggle = false,
  isPassword = false,
  placeholder,
  onFocus,
  onBlur,
  onChange,
  error,
  icon,
  value,
  label,
  readOnly = false,
}: CustomFormFieldProps<T>) {
  const [showPassword, setShowPassword] = useState(false);

  // If control is not provided, render a simple read-only input
  if (!control) {
    return (
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
            {icon}
          </div>
        )}
        <Input
          type={isPassword ? (showPassword ? 'text' : 'password') : 'text'}
          value={value}
          placeholder={placeholder}
          readOnly={readOnly}
          className={`w-full h-[56px] text-[#34006A]
            ${error ? 'border-red-500' : ''} 
            ${value ? 'bg-[#f9f9f9f7] ' : 'bg-[#F5F5F3F7] '}
            focus:outline-none focus:border-transparent focus:ring-0 
            focus-visible:ring-0 focus-visible:border-transparent rounded-[9px]`}
        />
        {isPassword && showPasswordToggle && (
          <div
            className="absolute right-2 text-lg top-5 cursor-pointer"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? (
              <FaEye color="#4F4F4F" />
            ) : (
              <BiHide color="#4F4F4F" />
            )}
          </div>
        )}
      </div>
    );
  }

  // If control is provided, render the FormField
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel
            htmlFor={name}
            className="capitalize text-[#00072D] font-medium text-sm md:text-base"
          >
            {String(label)}
          </FormLabel>
          <FormControl>
            <div className="relative">
              {icon && (
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                  {icon}
                </div>
              )}
              <Input
                {...field}
                type={
                  isPassword ? (showPassword ? 'text' : 'password') : 'text'
                }
                id={name}
                value={value}
                placeholder={placeholder}
                onChange={(e) => {
                  field.onChange(e); // React Hook Form's handler
                  onChange?.(e); // Custom handler, if provided
                }}
                onFocus={onFocus}
                onBlur={onBlur}
                readOnly={readOnly}
                className={`w-full h-[48px] md:h-[56px] text-primary border
                  ${error ? 'border-red-500' : ''} 
                  ${
                    field.value
                      ? 'bg-[#f9f9f9f7] focus-visible:border-[#1A202C] border-[#1A202C]'
                      : 'bg-white focus-visible:border-[#b8b8b8] border-[#b8b8b8]'
                  }
                  focus:outline-none focus:border focus:ring-0 
                  focus-visible:ring-0  rounded-[9px]  placeholder:text-sm placeholder:md:text-base `}
              />
              {isPassword && showPasswordToggle && (
                <div
                  className="absolute right-2 text-lg top-5 cursor-pointer"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? (
                    <FaEye color="#4F4F4F" />
                  ) : (
                    <BiHide color="#4F4F4F" />
                  )}
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
