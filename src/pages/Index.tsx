import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ConfigurationForm } from "@/components/ConfigurationForm"
import { GenerationLogs } from "@/components/GenerationLogs"
import { GenerationControls } from "@/components/GenerationControls"
import { useConfigStore } from "@/lib/generator/config-store"

const Index = () => {
  const { status } = useConfigStore()

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">STM32 Azure RTOS Package Generator</h1>
      
      <Tabs defaultValue="config" className="w-full">
        <TabsList>
          <TabsTrigger value="config">Configuration</TabsTrigger>
          <TabsTrigger value="generate">Generate</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="config">
          <Card className="p-4">
            <ConfigurationForm />
          </Card>
        </TabsContent>

        <TabsContent value="generate">
          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-4">Generate Package</h2>
            <GenerationControls />
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-4">Generation Logs</h2>
            <GenerationLogs />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Index