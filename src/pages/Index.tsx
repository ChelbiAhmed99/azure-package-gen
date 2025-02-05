
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ConfigurationForm } from "@/components/ConfigurationForm"
import { GenerationLogs } from "@/components/GenerationLogs"
import { GenerationControls } from "@/components/GenerationControls"
import { useConfigStore } from "@/lib/generator/config-store"
import { CircuitBoard, FileCode, Terminal, Download, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"

const Index = () => {
  const { status, config } = useConfigStore()

  const handleExportConfig = () => {
    const configJson = JSON.stringify(config, null, 2)
    const blob = new Blob([configJson], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'azure-rtos-config.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleImportConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importedConfig = JSON.parse(e.target?.result as string)
          // Add validation here if needed
          setConfig(importedConfig)
        } catch (error) {
          console.error('Error parsing config file:', error)
        }
      }
      reader.readAsText(file)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto p-4 space-y-6">
        <header className="py-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400">
                X-CUBE AZURE RTOS AUTOGEN
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Automated Package Generator for STM32 Azure RTOS
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleExportConfig} className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export Config
              </Button>
              <Button variant="outline" className="flex items-center gap-2" onClick={() => document.getElementById('config-import')?.click()}>
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
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="config" className="flex items-center gap-2">
              <CircuitBoard className="w-4 h-4" />
              Configuration
            </TabsTrigger>
            <TabsTrigger value="generate" className="flex items-center gap-2">
              <FileCode className="w-4 h-4" />
              Generate
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center gap-2">
              <Terminal className="w-4 h-4" />
              Logs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="config">
            <Card className="p-6">
              <ConfigurationForm />
            </Card>
          </TabsContent>

          <TabsContent value="generate">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-6">Generate Package</h2>
              <GenerationControls />
            </Card>
          </TabsContent>

          <TabsContent value="logs">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-6">Generation Logs</h2>
              <GenerationLogs />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default Index
