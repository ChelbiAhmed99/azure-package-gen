
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { UseFormReturn } from "react-hook-form"
import { GeneratorConfig } from "@/lib/generator/types"

interface DebugConfigFormProps {
  form: UseFormReturn<GeneratorConfig>
}

export function DebugConfigForm({ form }: DebugConfigFormProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="advancedSettings.debugConfig.traceEnabled"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>
                Enable Tracing
              </FormLabel>
              <FormDescription>
                Enable ThreadX trace buffer
              </FormDescription>
            </div>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="advancedSettings.debugConfig.performanceMetrics"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>
                Performance Metrics
              </FormLabel>
              <FormDescription>
                Enable performance monitoring
              </FormDescription>
            </div>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="advancedSettings.debugConfig.stackMonitoring"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>
                Stack Monitoring
              </FormLabel>
              <FormDescription>
                Enable stack usage monitoring
              </FormDescription>
            </div>
          </FormItem>
        )}
      />
    </div>
  )
}
