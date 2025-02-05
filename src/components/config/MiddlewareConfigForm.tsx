
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { UseFormReturn } from "react-hook-form"
import { GeneratorConfig } from "@/lib/generator/types"

interface MiddlewareConfigFormProps {
  form: UseFormReturn<GeneratorConfig>
}

export function MiddlewareConfigForm({ form }: MiddlewareConfigFormProps) {
  return (
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
  )
}
