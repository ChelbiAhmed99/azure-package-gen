import { useEffect, useRef } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useConfigStore } from "@/lib/generator/config-store"

export function GenerationLogs() {
  const { status } = useConfigStore()
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [status.logs])

  return (
    <ScrollArea className="h-[400px] w-full rounded-md border p-4">
      <div ref={scrollRef} className="space-y-2">
        {status.logs.map((log, index) => (
          <div key={index} className="text-sm font-mono">
            {log}
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}