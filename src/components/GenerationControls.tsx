
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
        title: "Chemin de sortie manquant",
        description: "Veuillez spécifier un chemin de sortie avant de générer les fichiers."
      });
      return;
    }

    try {
      // Show starting toast
      toast({
        title: "Génération en cours",
        description: `Début de la génération ${type === 'all' ? 'complète' : type}...`,
      });

      setStatus({ status: 'generating', message: `Génération ${type}...` })
      updateProgress(0)
      
      const generator = new Generator(config)
      let result;
      
      switch (type) {
        case 'pdsc':
          addLog('Démarrage de la génération PDSC...')
          updateProgress(25)
          result = await generator.generatePDSC()
          updateProgress(75)
          if (result.success) {
            await generator.generateZip(`${config.selectedFamily.toLowerCase()}_pdsc.zip`)
          }
          break
          
        case 'ip_mode':
          addLog('Démarrage de la génération IP Mode...')
          updateProgress(25)
          result = await generator.generateIPMode()
          updateProgress(75)
          if (result.success) {
            await generator.generateZip(`${config.selectedFamily.toLowerCase()}_ip_mode.zip`)
          }
          break
          
        case 'ip_config':
          addLog('Démarrage de la génération IP Config...')
          updateProgress(25)
          result = await generator.generateIPConfig()
          updateProgress(75)
          if (result.success) {
            await generator.generateZip(`${config.selectedFamily.toLowerCase()}_ip_config.zip`)
          }
          break
          
        case 'all':
          addLog('Démarrage de la génération du package complet...')
          updateProgress(25)
          result = await generator.generateAll()
          updateProgress(75)
          if (result.success) {
            await generator.generateZip(`${config.selectedFamily.toLowerCase()}_complete_package.zip`)
          }
          break
      }
      
      updateProgress(100)
      
      if (result.success) {
        setStatus({ 
          status: 'success',
          message: result.message
        })
        toast({
          title: "Génération réussie",
          description: `Les fichiers ${type} ont été générés et téléchargés avec succès.`
        })
      } else {
        throw new Error(result.message)
      }
      
    } catch (error) {
      setStatus({ 
        status: 'error',
        message: error instanceof Error ? error.message : 'La génération a échoué'
      })
      toast({
        variant: "destructive",
        title: "Échec de la génération",
        description: error instanceof Error ? error.message : 'Une erreur est survenue pendant la génération'
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
          Génération du Package
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
              <p>Voir l'implémentation de référence</p>
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
            <span>Générer PDSC</span>
          </Button>
          <p className="mt-2 text-xs text-gray-400">Génère le fichier de description du package pour STM32 Azure RTOS.</p>
        </Card>

        <Card className="group relative overflow-hidden p-4 hover:shadow-lg transition-all duration-300 bg-white/5 backdrop-blur-lg border border-white/20">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Button 
            onClick={() => handleGenerate('ip_mode')}
            disabled={status.status === 'generating'}
            className="w-full flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 hover:scale-[1.02] transition-all duration-300"
          >
            <Settings2 className="w-4 h-4" />
            <span>Générer IP Mode</span>
          </Button>
          <p className="mt-2 text-xs text-gray-400">Crée la configuration ThreadX et Middleware.</p>
        </Card>

        <Card className="group relative overflow-hidden p-4 hover:shadow-lg transition-all duration-300 bg-white/5 backdrop-blur-lg border border-white/20">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Button 
            onClick={() => handleGenerate('ip_config')}
            disabled={status.status === 'generating'}
            className="w-full flex items-center space-x-2 bg-gradient-to-r from-cyan-600 to-blue-500 hover:from-cyan-700 hover:to-blue-600 hover:scale-[1.02] transition-all duration-300"
          >
            <FileCode className="w-4 h-4" />
            <span>Générer IP Config</span>
          </Button>
          <p className="mt-2 text-xs text-gray-400">Génère les configurations pour les composants IP sélectionnés.</p>
        </Card>
      </div>
        
      <Card className="group relative overflow-hidden p-6 hover:shadow-lg transition-all duration-300 bg-white/5 backdrop-blur-lg border border-white/20">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-200">Génération du Package Complet</h4>
          <p className="text-xs text-gray-400">
            Génère un package Azure RTOS complet incluant PDSC, configurations IP Mode, et tous les composants middleware sélectionnés.
          </p>
          <Button 
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-500 hover:from-purple-700 hover:via-blue-600 hover:to-cyan-600 hover:scale-[1.02] transition-all duration-300"
            onClick={() => handleGenerate('all')}
            disabled={status.status === 'generating'}
          >
            <Download className="w-4 h-4" />
            <span>Générer le Package Complet</span>
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
