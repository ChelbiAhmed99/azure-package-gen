
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useConfigStore } from "@/lib/generator/config-store"
import { Generator } from "@/lib/generator/generator"
import { toast } from "@/hooks/use-toast"
import { Download, FileDown, Settings2, FileCode, Github } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function GenerationControls() {
  const { config, status, setStatus, addLog, updateProgress } = useConfigStore()

  const handleGenerate = async (type: 'pdsc' | 'ip_mode' | 'ip_config' | 'all') => {
    if (!config.outputPath) {
      toast({
        variant: "destructive",
        title: "Missing Output Path",
        description: "Please specify an output path before generating files."
      });
      return;
    }

    setStatus({ status: 'generating', message: `Generating ${type}...` })
    updateProgress(0)
    
    const generator = new Generator(config)
    
    try {
      let result;
      
      switch (type) {
        case 'pdsc':
          addLog('Starting PDSC generation...')
          result = await generator.generatePDSC()
          updateProgress(100)
          break
          
        case 'ip_mode':
          addLog('Starting IP Mode generation...')
          result = await generator.generateIPMode()
          updateProgress(100)
          break
          
        case 'ip_config':
          addLog('Starting IP Config generation...')
          result = await generator.generateIPConfig()
          updateProgress(100)
          break
          
        case 'all':
          addLog('Starting complete package generation...')
          updateProgress(25)
          result = await generator.generateAll()
          updateProgress(100)
          break
      }
      
      if (result.success) {
        setStatus({ 
          status: 'success',
          message: result.message
        })
        toast({
          title: "Generation Successful",
          description: result.message
        })
      } else {
        throw new Error(result.message)
      }
      
    } catch (error) {
      setStatus({ 
        status: 'error',
        message: error instanceof Error ? error.message : 'Generation failed'
      })
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: error instanceof Error ? error.message : 'An error occurred during generation'
      })
    }
  }

  const handleOpenReference = () => {
    window.open(`https://github.com/STMicroelectronics/x-cube-azrtos-${config.selectedFamily.toLowerCase()}`, '_blank');
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-500">
          Package Generation
        </h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon"
                onClick={handleOpenReference}
                className="bg-white/5 border-white/20 hover:bg-white/10"
              >
                <Github className="h-[1.2rem] w-[1.2rem]" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View Reference Implementation</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="group relative overflow-hidden p-4 hover:shadow-lg transition-all duration-300 bg-white/5 backdrop-blur-lg border border-white/20">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Button 
            onClick={() => handleGenerate('pdsc')}
            disabled={status.status === 'generating'}
            className="w-full flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 hover:scale-[1.02] transition-all duration-300"
          >
            <FileDown className="w-4 h-4" />
            <span>Generate PDSC</span>
          </Button>
          <p className="mt-2 text-xs text-gray-400">Generates Package Description file for STM32 Azure RTOS.</p>
        </Card>

        <Card className="group relative overflow-hidden p-4 hover:shadow-lg transition-all duration-300 bg-white/5 backdrop-blur-lg border border-white/20">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Button 
            onClick={() => handleGenerate('ip_mode')}
            disabled={status.status === 'generating'}
            className="w-full flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 hover:scale-[1.02] transition-all duration-300"
          >
            <Settings2 className="w-4 h-4" />
            <span>Generate IP Mode</span>
          </Button>
          <p className="mt-2 text-xs text-gray-400">Creates ThreadX and Middleware configuration.</p>
        </Card>

        <Card className="group relative overflow-hidden p-4 hover:shadow-lg transition-all duration-300 bg-white/5 backdrop-blur-lg border border-white/20">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Button 
            onClick={() => handleGenerate('ip_config')}
            disabled={status.status === 'generating'}
            className="w-full flex items-center space-x-2 bg-gradient-to-r from-cyan-600 to-blue-500 hover:from-cyan-700 hover:to-blue-600 hover:scale-[1.02] transition-all duration-300"
          >
            <FileCode className="w-4 h-4" />
            <span>Generate IP Config</span>
          </Button>
          <p className="mt-2 text-xs text-gray-400">Generates configurations for selected IP components.</p>
        </Card>
      </div>
        
      <Card className="group relative overflow-hidden p-6 hover:shadow-lg transition-all duration-300 bg-white/5 backdrop-blur-lg border border-white/20">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-200">Complete Package Generation</h4>
          <p className="text-xs text-gray-400">
            Generates a complete Azure RTOS package including PDSC, IP Mode configurations, and all selected middleware components.
          </p>
          <Button 
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-500 hover:from-purple-700 hover:via-blue-600 hover:to-cyan-600 hover:scale-[1.02] transition-all duration-300"
            onClick={() => handleGenerate('all')}
            disabled={status.status === 'generating'}
          >
            <Download className="w-4 h-4" />
            <span>Generate Complete Package</span>
          </Button>
        </div>
      </Card>
      
      {status.status === 'generating' && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-blue-400 font-medium">{status.message}</span>
            <span className="text-cyan-400 font-medium">{status.progress}%</span>
          </div>
          <Progress 
            value={status.progress} 
            className="h-2 bg-white/10"
          />
        </div>
      )}
    </div>
  )
}
