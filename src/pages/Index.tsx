import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
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
            <h2 className="text-xl font-semibold mb-4">Project Configuration</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">STM32 Family</label>
                <Select>
                  <option value="STM32F7">STM32F7</option>
                  <option value="STM32H7">STM32H7</option>
                  <option value="STM32L4">STM32L4</option>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Azure RTOS Version</label>
                <Input type="text" placeholder="6.2.0" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Output Directory</label>
                <Input type="text" placeholder="/output/path" />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="generate">
          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-4">Generate Package</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Button>Generate PDSC</Button>
                <Button>Generate IP Mode</Button>
                <Button>Generate IP Config</Button>
              </div>
              <div>
                <Button className="w-full">Generate Complete Package</Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-4">Generation Logs</h2>
            <div className="bg-gray-100 p-4 rounded-md h-64 overflow-y-auto">
              <pre className="text-sm">
                {/* Logs will be displayed here */}
              </pre>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;