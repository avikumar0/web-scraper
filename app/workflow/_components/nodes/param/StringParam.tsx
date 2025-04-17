"use client";

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ParamProps } from '@/types/appNode';
import React, { useEffect, useId, useState } from 'react'


function StringParam({param,value,updateNodeParamValue,disabled}:ParamProps) {
    const [internalValue, setInternalValue] = useState(value);
    const id = useId();
    useEffect(() => {
        setInternalValue(value);
    },[value])

    let Component:any = Input;
    if(param.variant === 'textarea'){
        Component = Textarea;
    }
    
    return (
        <div className='w-full p-1 space-y-1'>
            <Label htmlFor={id} className='text-xs flex '>
                {param.name}
                {param.required && <span className='text-red-500 px-2'>*</span>}
            </Label>
            <Component disabled={disabled} id={id} className='text-xs' value={internalValue} placeholder='Enter value here' onChange={(e:any)=>setInternalValue(e.target.value)} onBlur={(e:any)=>updateNodeParamValue(e.target.value)}/>
            {param.helperText && <p className='text-xs text-muted-foreground'>{param.helperText}</p>}
        </div>
    )
}

export default StringParam