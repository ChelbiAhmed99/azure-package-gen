
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ConfigurationForm } from "@/components/ConfigurationForm"
import { GenerationLogs } from "@/components/GenerationLogs"
import { GenerationControls } from "@/components/GenerationControls"
import { useConfigStore } from "@/lib/generator/config-store"
import { CircuitBoard, FileCode, Terminal, Download, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"

const Index = () => {
  const { status, config, setConfig } = useConfigStore()

  const handleExportConfig = () => {
    const configJson = JSON.stringify(config, null, 2)
    const blob = new Blob([configJson], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'ACTIA_azure_rtos_config.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast({
      title: "Configuration Exported",
      description: "Your configuration has been exported successfully.",
    })
  }

  const handleImportConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importedConfig = JSON.parse(e.target?.result as string)
          setConfig(importedConfig)
          toast({
            title: "Configuration Imported",
            description: "Your configuration has been imported successfully.",
          })
        } catch (error) {
          console.error('Error parsing config file:', error)
          toast({
            variant: "destructive",
            title: "Import Failed",
            description: "Failed to import configuration. Please check the file format.",
          })
        }
      }
      reader.readAsText(file)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1A1F2C] to-[#403E43]">
      <div className="container mx-auto p-4 space-y-6">
        <header className="py-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#9b87f5] to-[#D6BCFA]">
                ACTIA ENGINEERING SERVICES - X-CUBE AZURE RTOS AUTOGEN
              </h1>
              <p className="text-[#8E9196] mt-2">
                Automated Package Generator for STM32 Azure RTOS
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={handleExportConfig} 
                className="flex items-center gap-2 bg-white/5 border-white/20 hover:bg-white/10"
              >
                <Download className="w-4 h-4" />
                Export Config
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center gap-2 bg-white/5 border-white/20 hover:bg-white/10" 
                onClick={() => document.getElementById('config-import')?.click()}
              >
                <Upload className="w-4 h-4" />
                Import Config
              </Button>
              <input
                id="config-import"
                type="file"
                accept=".json"
                onChange={handleImportConfig}
                className="hidden"
              />
            </div>
          </div>
        </header>
        
        <Tabs defaultValue="config" className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px] bg-white/5 border border-white/20">
            <TabsTrigger value="config" className="flex items-center gap-2 data-[state=active]:bg-white/10">
              <CircuitBoard className="w-4 h-4" />
              Configuration
            </TabsTrigger>
            <TabsTrigger value="generate" className="flex items-center gap-2 data-[state=active]:bg-white/10">
              <FileCode className="w-4 h-4" />
              Generate
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center gap-2 data-[state=active]:bg-white/10">
              <Terminal className="w-4 h-4" />
              Logs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="config">
            <Card className="p-6 bg-white/5 backdrop-blur-lg border border-white/20">
              <ConfigurationForm />
            </Card>
          </TabsContent>

          <TabsContent value="generate">
            <Card className="p-6 bg-white/5 backdrop-blur-lg border border-white/20">
              <h2 className="text-2xl font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#9b87f5] to-[#D6BCFA]">
                Generate Package
              </h2>
              <GenerationControls />
            </Card>
          </TabsContent>

          <TabsContent value="logs">
            <Card className="p-6 bg-white/5 backdrop-blur-lg border border-white/20">
              <h2 className="text-2xl font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#9b87f5] to-[#D6BCFA]">
                Generation Logs
              </h2>
              <GenerationLogs />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default Index
