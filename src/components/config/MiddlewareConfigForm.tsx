
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { UseFormReturn } from "react-hook-form"
import { GeneratorConfig } from "@/lib/generator/types"
import { Card } from "@/components/ui/card"
import { FileText, Globe, Usb, Layout } from "lucide-react"

interface MiddlewareConfigFormProps {
  form: UseFormReturn<GeneratorConfig>
}

export function MiddlewareConfigForm({ form }: MiddlewareConfigFormProps) {
  return (
    <div className="space-y-4">
      <Card className="p-4 bg-white/5 border-white/10">
        <FormField
          control={form.control}
          name="advancedSettings.middlewareConfig.fileX"
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
                    <FileText className="w-4 h-4 text-blue-500" />
                    <FormLabel className="text-gradient font-semibold cursor-pointer">
                      FileX Support
                    </FormLabel>
                  </div>
                </div>
              </FormControl>
              <FormDescription className="text-gray-400 mt-1">
                Enable FileX file system support
              </FormDescription>
            </FormItem>
          )}
        />
      </Card>

      <Card className="p-4 bg-white/5 border-white/10">
        <FormField
          control={form.control}
          name="advancedSettings.middlewareConfig.netXDuo"
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
                    <Globe className="w-4 h-4 text-green-500" />
                    <FormLabel className="text-gradient font-semibold cursor-pointer">
                      NetX Duo Support
                    </FormLabel>
                  </div>
                </div>
              </FormControl>
              <FormDescription className="text-gray-400 mt-1">
                Enable NetX Duo networking support
              </FormDescription>
            </FormItem>
          )}
        />
      </Card>

      <Card className="p-4 bg-white/5 border-white/10">
        <FormField
          control={form.control}
          name="advancedSettings.middlewareConfig.usbX"
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
                    <Usb className="w-4 h-4 text-purple-500" />
                    <FormLabel className="text-gradient font-semibold cursor-pointer">
                      USBX Support
                    </FormLabel>
                  </div>
                </div>
              </FormControl>
              <FormDescription className="text-gray-400 mt-1">
                Enable USBX device/host support
              </FormDescription>
            </FormItem>
          )}
        />
      </Card>

      <Card className="p-4 bg-white/5 border-white/10">
        <FormField
          control={form.control}
          name="advancedSettings.middlewareConfig.guix"
          render={({ field }) => (
            <FormItem className="flex items-start space-x-4 space-y-0">
              <FormControl>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                  />
                  <div className="flex items-center space-x-2">
                    <Layout className="w-4 h-4 text-orange-500" />
                    <FormLabel className="text-gradient font-semibold cursor-pointer">
                      GUIX Support
                    </FormLabel>
                  </div>
                </div>
              </FormControl>
              <FormDescription className="text-gray-400 mt-1">
                Enable GUIX UI framework support
              </FormDescription>
            </FormItem>
          )}
        />
      </Card>
    </div>
  )
}
