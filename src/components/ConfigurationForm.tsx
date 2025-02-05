
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useConfigStore } from "@/lib/generator/config-store"
import { GeneratorConfig } from "@/lib/generator/types"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { BasicConfigForm } from "./config/BasicConfigForm"
import { ThreadXConfigForm } from "./config/ThreadXConfigForm"
import { MiddlewareConfigForm } from "./config/MiddlewareConfigForm"
import { DebugConfigForm } from "./config/DebugConfigForm"

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
  
  // Initialize with complete required values
  const defaultValues: GeneratorConfig = {
    selectedFamily: config.selectedFamily || '',
    azureRTOSVersion: config.azureRTOSVersion || '',
    outputPath: config.outputPath || '',
    ipMode: config.ipMode || "standalone",
    templatePath: config.templatePath,
    advancedSettings: {
      threadxConfig: {
        maxThreads: config.advancedSettings?.threadxConfig?.maxThreads ?? 8,
        stackSize: config.advancedSettings?.threadxConfig?.stackSize ?? 1024,
        preemptionThreshold: config.advancedSettings?.threadxConfig?.preemptionThreshold ?? 4,
        timeSlice: config.advancedSettings?.threadxConfig?.timeSlice ?? 10,
      },
      middlewareConfig: {
        fileX: config.advancedSettings?.middlewareConfig?.fileX ?? false,
        netXDuo: config.advancedSettings?.middlewareConfig?.netXDuo ?? false,
        usbX: config.advancedSettings?.middlewareConfig?.usbX ?? false,
        guix: config.advancedSettings?.middlewareConfig?.guix ?? false,
      },
      debugConfig: {
        traceEnabled: config.advancedSettings?.debugConfig?.traceEnabled ?? false,
        performanceMetrics: config.advancedSettings?.debugConfig?.performanceMetrics ?? false,
        stackMonitoring: config.advancedSettings?.debugConfig?.stackMonitoring ?? false,
      },
    },
  }
  
  const form = useForm<GeneratorConfig>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setConfig(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <BasicConfigForm form={form} />
        
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="threadx-config">
            <AccordionTrigger>ThreadX Configuration</AccordionTrigger>
            <AccordionContent>
              <ThreadXConfigForm form={form} />
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="middleware-config">
            <AccordionTrigger>Middleware Configuration</AccordionTrigger>
            <AccordionContent>
              <MiddlewareConfigForm form={form} />
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="debug-config">
            <AccordionTrigger>Debug Configuration</AccordionTrigger>
            <AccordionContent>
              <DebugConfigForm form={form} />
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
