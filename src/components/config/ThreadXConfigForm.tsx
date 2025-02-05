
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { UseFormReturn } from "react-hook-form"
import { GeneratorConfig } from "@/lib/generator/types"

interface ThreadXConfigFormProps {
  form: UseFormReturn<GeneratorConfig>
}

export function ThreadXConfigForm({ form }: ThreadXConfigFormProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="advancedSettings.threadxConfig.maxThreads"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Max Threads</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                {...field} 
                onChange={e => field.onChange(parseInt(e.target.value))} 
              />
            </FormControl>
            <FormDescription>
              Maximum number of threads (1-32)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="advancedSettings.threadxConfig.stackSize"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Stack Size</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                {...field} 
                onChange={e => field.onChange(parseInt(e.target.value))} 
              />
            </FormControl>
            <FormDescription>
              Thread stack size in bytes (1024-32768)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="advancedSettings.threadxConfig.preemptionThreshold"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Preemption Threshold</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                {...field} 
                onChange={e => field.onChange(parseInt(e.target.value))} 
              />
            </FormControl>
            <FormDescription>
              Thread preemption threshold (0-31)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="advancedSettings.threadxConfig.timeSlice"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Time Slice</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                {...field} 
                onChange={e => field.onChange(parseInt(e.target.value))} 
              />
            </Control>
            <FormDescription>
              Thread time slice in ticks (0-1000)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
