
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { UseFormReturn } from "react-hook-form"
import { GeneratorConfig } from "@/lib/generator/types"
import { Card } from "@/components/ui/card"
import { Cpu, Layers, Clock, Timer } from "lucide-react"

interface ThreadXConfigFormProps {
  form: UseFormReturn<GeneratorConfig>
}

export function ThreadXConfigForm({ form }: ThreadXConfigFormProps) {
  return (
    <div className="space-y-6">
      <Card className="p-4 bg-white/5 border-white/10">
        <div className="flex items-center gap-2 mb-4">
          <Cpu className="w-4 h-4 text-blue-500" />
          <FormField
            control={form.control}
            name="advancedSettings.threadxConfig.maxThreads"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="text-gradient font-semibold">Max Threads</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field} 
                    onChange={e => field.onChange(parseInt(e.target.value))}
                    className="bg-white/5 border-white/10 focus:border-blue-500/50 focus:ring-blue-500/30"
                  />
                </FormControl>
                <FormDescription className="text-gray-400">
                  Maximum number of threads (1-32)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </Card>

      <Card className="p-4 bg-white/5 border-white/10">
        <div className="flex items-center gap-2 mb-4">
          <Layers className="w-4 h-4 text-blue-500" />
          <FormField
            control={form.control}
            name="advancedSettings.threadxConfig.stackSize"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="text-gradient font-semibold">Stack Size</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field} 
                    onChange={e => field.onChange(parseInt(e.target.value))}
                    className="bg-white/5 border-white/10 focus:border-blue-500/50 focus:ring-blue-500/30"
                  />
                </FormControl>
                <FormDescription className="text-gray-400">
                  Thread stack size in bytes (1024-32768)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </Card>

      <Card className="p-4 bg-white/5 border-white/10">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-blue-500" />
          <FormField
            control={form.control}
            name="advancedSettings.threadxConfig.preemptionThreshold"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="text-gradient font-semibold">Preemption Threshold</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field} 
                    onChange={e => field.onChange(parseInt(e.target.value))}
                    className="bg-white/5 border-white/10 focus:border-blue-500/50 focus:ring-blue-500/30"
                  />
                </FormControl>
                <FormDescription className="text-gray-400">
                  Thread preemption threshold (0-31)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </Card>

      <Card className="p-4 bg-white/5 border-white/10">
        <div className="flex items-center gap-2 mb-4">
          <Timer className="w-4 h-4 text-blue-500" />
          <FormField
            control={form.control}
            name="advancedSettings.threadxConfig.timeSlice"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="text-gradient font-semibold">Time Slice</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field} 
                    onChange={e => field.onChange(parseInt(e.target.value))}
                    className="bg-white/5 border-white/10 focus:border-blue-500/50 focus:ring-blue-500/30"
                  />
                </FormControl>
                <FormDescription className="text-gray-400">
                  Thread time slice in ticks (0-1000)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </Card>
    </div>
  )
}
