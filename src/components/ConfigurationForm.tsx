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
import { useConfigStore } from "@/lib/generator/config-store"

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
})

export function ConfigurationForm() {
  const { config, setConfig } = useConfigStore()
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      selectedFamily: config.selectedFamily,
      azureRTOSVersion: config.azureRTOSVersion,
      outputPath: config.outputPath,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setConfig({
      selectedFamily: values.selectedFamily,
      azureRTOSVersion: values.azureRTOSVersion,
      outputPath: values.outputPath,
    })
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
                  <SelectItem value="STM32F7">STM32F7</SelectItem>
                  <SelectItem value="STM32H7">STM32H7</SelectItem>
                  <SelectItem value="STM32L4">STM32L4</SelectItem>
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
        
        <Button type="submit">Save Configuration</Button>
      </form>
    </Form>
  )
}