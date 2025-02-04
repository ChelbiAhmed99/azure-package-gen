import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useConfigStore } from "@/lib/generator/config-store"
import { Generator } from "@/lib/generator/generator"
import { toast } from "@/hooks/use-toast"

export function GenerationControls() {
  const { config, status, setStatus, addLog, updateProgress } = useConfigStore()

  const handleGenerate = async (type: 'pdsc' | 'ip_mode' | 'ip_config' | 'all') => {
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

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Button 
            onClick={() => handleGenerate('pdsc')}
            disabled={status.status === 'generating'}
          >
            Generate PDSC
          </Button>
          <Button 
            onClick={() => handleGenerate('ip_mode')}
            disabled={status.status === 'generating'}
          >
            Generate IP Mode
          </Button>
          <Button 
            onClick={() => handleGenerate('ip_config')}
            disabled={status.status === 'generating'}
          >
            Generate IP Config
          </Button>
        </div>
        
        <Button 
          className="w-full"
          onClick={() => handleGenerate('all')}
          disabled={status.status === 'generating'}
        >
          Generate Complete Package
        </Button>
      </div>
      
      {status.status === 'generating' && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Generating...</span>
            <span>{status.progress}%</span>
          </div>
          <Progress value={status.progress} />
        </div>
      )}
    </div>
  )
}