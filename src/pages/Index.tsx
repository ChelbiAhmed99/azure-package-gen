import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ConfigurationForm } from "@/components/ConfigurationForm"
import { GenerationLogs } from "@/components/GenerationLogs"
import { useConfigStore } from "@/lib/generator/config-store"

const Index = () => {
  const { status, setStatus, addLog } = useConfigStore()

  const handleGenerate = async (type: string) => {
    setStatus({ status: "generating", message: `Generating ${type}...` })
    addLog(`Starting ${type} generation...`)
    
    // TODO: Implement actual generation logic
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    addLog(`${type} generation completed`)
    setStatus({ status: "success", message: `${type} generated successfully` })
  }

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
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Button 
                  onClick={() => handleGenerate("PDSC")}
                  disabled={status.status === "generating"}
                >
                  Generate PDSC
                </Button>
                <Button 
                  onClick={() => handleGenerate("IP Mode")}
                  disabled={status.status === "generating"}
                >
                  Generate IP Mode
                </Button>
                <Button 
                  onClick={() => handleGenerate("IP Config")}
                  disabled={status.status === "generating"}
                >
                  Generate IP Config
                </Button>
              </div>
              <div>
                <Button 
                  className="w-full"
                  onClick={() => handleGenerate("Complete Package")}
                  disabled={status.status === "generating"}
                >
                  Generate Complete Package
                </Button>
              </div>
            </div>
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