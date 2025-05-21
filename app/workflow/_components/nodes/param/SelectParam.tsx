"use client";

import { ParamProps } from '@/types/appNode';
import React, { useId } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from '@/components/ui/label';


type OptionType = {
  label: string;
  value: string;
}


export default function SelectParam({ param, updateNodeParamValue, value }: ParamProps) {
  const id = useId();
  return (
    <div className="flex flex-col w-full gap-1">
      <Label htmlFor={id} className='text-sm flex'>
        {param.name}
        {param.required && <p className='text-red-500 px-2'>*</p>}
      </Label>
      <Select
        onValueChange={(value) => {
          updateNodeParamValue(value);
        }}
        defaultValue={value}
      >
        <SelectTrigger className='w-full'>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Options</SelectLabel>
            {param.options.map((option: OptionType) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
