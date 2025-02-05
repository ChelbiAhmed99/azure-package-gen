
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { STM32_FAMILIES } from "@/lib/generator/stm32-families"
import { UseFormReturn } from "react-hook-form"
import { GeneratorConfig } from "@/lib/generator/types"

interface BasicConfigFormProps {
  form: UseFormReturn<GeneratorConfig>
}

export function BasicConfigForm({ form }: BasicConfigFormProps) {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="selectedFamily"
        render={({ field }) => (
          <FormItem>
            <FormLabel>STM32 Family</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a family" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {Object.keys(STM32_FAMILIES).map((family) => (
                  <SelectItem key={family} value={family}>
                    {family}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              Select the STM32 family for which to generate the package.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="azureRTOSVersion"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Azure RTOS Version</FormLabel>
            <FormControl>
              <Input placeholder="6.2.0" {...field} />
            </FormControl>
            <FormDescription>
              Specify the Azure RTOS version to use.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="outputPath"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Output Path</FormLabel>
            <FormControl>
              <Input placeholder="/path/to/output" {...field} />
            </FormControl>
            <FormDescription>
              Specify where to save the generated files.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="ipMode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>IP Mode</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select IP mode" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="standalone">Standalone</SelectItem>
                <SelectItem value="middleware">Middleware</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              Choose between standalone or middleware IP mode.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
