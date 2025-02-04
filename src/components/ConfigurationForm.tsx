import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useConfigStore } from "@/lib/generator/config-store"
import { STM32_FAMILIES } from "@/lib/generator/stm32-families"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const formSchema = z.object({
  selectedFamily: z.string({
    required_error: "Please select an STM32 family.",
  }),
  azureRTOSVersion: z.string().min(5, {
    message: "Azure RTOS version must be at least 5 characters.",
  }),
  outputPath: z.string().min(1, {
    message: "Please specify an output path.",
  }),
  ipMode: z.enum(["standalone", "middleware"], {
    required_error: "Please select an IP mode.",
  }),
  templatePath: z.string().optional(),
  advancedSettings: z.object({
    threadxConfig: z.object({
      maxThreads: z.number().min(1).max(32),
      stackSize: z.number().min(1024).max(32768),
      preemptionThreshold: z.number().min(0).max(31),
      timeSlice: z.number().min(0).max(1000),
    }),
    middlewareConfig: z.object({
      fileX: z.boolean(),
      netXDuo: z.boolean(),
      usbX: z.boolean(),
      guix: z.boolean(),
    }),
    debugConfig: z.object({
      traceEnabled: z.boolean(),
      performanceMetrics: z.boolean(),
      stackMonitoring: z.boolean(),
    }),
  }),
})

export function ConfigurationForm() {
  const { config, setConfig } = useConfigStore()
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      selectedFamily: config.selectedFamily,
      azureRTOSVersion: config.azureRTOSVersion,
      outputPath: config.outputPath,
      ipMode: config.ipMode || "standalone",
      templatePath: config.templatePath,
      advancedSettings: {
        threadxConfig: {
          maxThreads: 8,
          stackSize: 1024,
          preemptionThreshold: 4,
          timeSlice: 10,
        },
        middlewareConfig: {
          fileX: false,
          netXDuo: false,
          usbX: false,
          guix: false,
        },
        debugConfig: {
          traceEnabled: false,
          performanceMetrics: false,
          stackMonitoring: false,
        },
      },
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setConfig(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
        
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="threadx-config">
            <AccordionTrigger>ThreadX Configuration</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="advancedSettings.threadxConfig.maxThreads"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Threads</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
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
                        <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
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
                        <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
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
                        <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                      </FormControl>
                      <FormDescription>
                        Thread time slice in ticks (0-1000)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="middleware-config">
            <AccordionTrigger>Middleware Configuration</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="advancedSettings.middlewareConfig.fileX"
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
                          FileX Support
                        </FormLabel>
                        <FormDescription>
                          Enable FileX file system support
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="advancedSettings.middlewareConfig.netXDuo"
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
                          NetX Duo Support
                        </FormLabel>
                        <FormDescription>
                          Enable NetX Duo networking support
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="advancedSettings.middlewareConfig.usbX"
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
                          USBX Support
                        </FormLabel>
                        <FormDescription>
                          Enable USBX device/host support
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="advancedSettings.middlewareConfig.guix"
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
                          GUIX Support
                        </FormLabel>
                        <FormDescription>
                          Enable GUIX UI framework support
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="debug-config">
            <AccordionTrigger>Debug Configuration</AccordionTrigger>
            <AccordionContent>
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
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        <FormField
          control={form.control}
          name="templatePath"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Template Path (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="/path/to/templates" {...field} />
              </FormControl>
              <FormDescription>
                Optional path to custom templates directory.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit">Save Configuration</Button>
      </form>
    </Form>
  )
}