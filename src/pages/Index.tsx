
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ConfigurationForm } from "@/components/ConfigurationForm"
import { GenerationLogs } from "@/components/GenerationLogs"
import { GenerationControls } from "@/components/GenerationControls"
import { useConfigStore } from "@/lib/generator/config-store"
import { CircuitBoard, FileCode, Terminal } from "lucide-react"

const Index = () => {
  const { status } = useConfigStore()

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto p-4 space-y-6">
        <header className="py-6">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400">
            STM32 Azure RTOS Package Generator
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Generate custom Azure RTOS packages for STM32 microcontrollers
          </p>
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
