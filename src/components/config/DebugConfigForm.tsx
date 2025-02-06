
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { UseFormReturn } from "react-hook-form"
import { GeneratorConfig } from "@/lib/generator/types"
import { Card } from "@/components/ui/card"
import { Bug, ActivitySquare, BarChart3 } from "lucide-react"

interface DebugConfigFormProps {
  form: UseFormReturn<GeneratorConfig>
}

export function DebugConfigForm({ form }: DebugConfigFormProps) {
  return (
    <div className="space-y-4">
      <Card className="p-4 bg-white/5 border-white/10">
        <FormField
          control={form.control}
          name="advancedSettings.debugConfig.traceEnabled"
          render={({ field }) => (
            <FormItem className="flex items-start space-x-4 space-y-0">
              <FormControl>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                  />
                  <div className="flex items-center space-x-2">
                    <ActivitySquare className="w-4 h-4 text-blue-500" />
                    <FormLabel className="text-gradient font-semibold cursor-pointer">
                      Enable Tracing
                    </FormLabel>
                  </div>
                </div>
              </FormControl>
              <FormDescription className="text-gray-400 mt-1">
                Enable ThreadX trace buffer
              </FormDescription>
            </FormItem>
          )}
        />
      </Card>

      <Card className="p-4 bg-white/5 border-white/10">
        <FormField
          control={form.control}
          name="advancedSettings.debugConfig.performanceMetrics"
          render={({ field }) => (
            <FormItem className="flex items-start space-x-4 space-y-0">
              <FormControl>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                  />
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="w-4 h-4 text-green-500" />
                    <FormLabel className="text-gradient font-semibold cursor-pointer">
                      Performance Metrics
                    </FormLabel>
                  </div>
                </div>
              </FormControl>
              <FormDescription className="text-gray-400 mt-1">
                Enable performance monitoring
              </FormDescription>
            </FormItem>
          )}
        />
      </Card>

      <Card className="p-4 bg-white/5 border-white/10">
        <FormField
          control={form.control}
          name="advancedSettings.debugConfig.stackMonitoring"
          render={({ field }) => (
            <FormItem className="flex items-start space-x-4 space-y-0">
              <FormControl>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                  />
                  <div className="flex items-center space-x-2">
                    <Bug className="w-4 h-4 text-purple-500" />
                    <FormLabel className="text-gradient font-semibold cursor-pointer">
                      Stack Monitoring
                    </FormLabel>
                  </div>
                </div>
              </FormControl>
              <FormDescription className="text-gray-400 mt-1">
                Enable stack usage monitoring
              </FormDescription>
            </FormItem>
          )}
        />
      </Card>
    </div>
  )
}
