
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
import { Card } from "@/components/ui/card"
import { Settings, Cpu, Network, Bug } from "lucide-react"

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
    const completeConfig: GeneratorConfig = {
      selectedFamily: values.selectedFamily,
      azureRTOSVersion: values.azureRTOSVersion,
      outputPath: values.outputPath,
      ipMode: values.ipMode,
      templatePath: values.templatePath,
      advancedSettings: {
        threadxConfig: {
          maxThreads: values.advancedSettings.threadxConfig.maxThreads,
          stackSize: values.advancedSettings.threadxConfig.stackSize,
          preemptionThreshold: values.advancedSettings.threadxConfig.preemptionThreshold,
          timeSlice: values.advancedSettings.threadxConfig.timeSlice,
        },
        middlewareConfig: {
          fileX: values.advancedSettings.middlewareConfig.fileX,
          netXDuo: values.advancedSettings.middlewareConfig.netXDuo,
          usbX: values.advancedSettings.middlewareConfig.usbX,
          guix: values.advancedSettings.middlewareConfig.guix,
        },
        debugConfig: {
          traceEnabled: values.advancedSettings.debugConfig.traceEnabled,
          performanceMetrics: values.advancedSettings.debugConfig.performanceMetrics,
          stackMonitoring: values.advancedSettings.debugConfig.stackMonitoring,
        },
      },
    }
    setConfig(completeConfig)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="p-6 bg-white/10 backdrop-blur-lg border border-white/20">
          <div className="space-y-2 mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">Basic Configuration</h2>
            <p className="text-gray-500 dark:text-gray-400">Configure the basic settings for your Azure RTOS package.</p>
          </div>
          <BasicConfigForm form={form} />
        </Card>
        
        <Accordion type="single" collapsible className="w-full space-y-4">
          <AccordionItem value="threadx-config" className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg">
            <AccordionTrigger className="px-6">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-blue-500" />
                <span>ThreadX Configuration</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <ThreadXConfigForm form={form} />
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="middleware-config" className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg">
            <AccordionTrigger className="px-6">
              <div className="flex items-center gap-2">
                <Network className="w-5 h-5 text-green-500" />
                <span>Middleware Configuration</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <MiddlewareConfigForm form={form} />
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="debug-config" className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg">
            <AccordionTrigger className="px-6">
              <div className="flex items-center gap-2">
                <Bug className="w-5 h-5 text-orange-500" />
                <span>Debug Configuration</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <DebugConfigForm form={form} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        <Card className="p-6 bg-white/10 backdrop-blur-lg border border-white/20">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="w-5 h-5 text-purple-500" />
            <h3 className="text-lg font-semibold">Advanced Settings</h3>
          </div>
          <FormField
            control={form.control}
            name="templatePath"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Template Path (Optional)</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="/path/to/templates" 
                    {...field} 
                    className="bg-white/5 border-white/10 focus:border-blue-500/50 focus:ring-blue-500/30"
                  />
                </FormControl>
                <FormDescription className="text-gray-500 dark:text-gray-400">
                  Optional path to custom templates directory.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </Card>
        
        <Button 
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 hover:scale-[1.02]"
        >
          Save Configuration
        </Button>
      </form>
    </Form>
  )
}
