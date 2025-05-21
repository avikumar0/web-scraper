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
import { useQuery } from '@tanstack/react-query';
import { GetCredentialsForUser } from '@/actions/credentials/getCredentialsForUser';





export default function CredentialsParam({ param, updateNodeParamValue, value }: ParamProps) {
  const id = useId();
  const query = useQuery({
    queryKey: ['credentials-for-user'],
    queryFn: () => GetCredentialsForUser(),
    refetchInterval: 10000,
    
  })
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
            <SelectLabel>Credentials</SelectLabel>
            {query.data?.map((option) => (
              <SelectItem key={option.id} value={option.id}>
                {option.name}
              </SelectItem>
            ))} 
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
