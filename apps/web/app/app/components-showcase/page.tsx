import { requireAuth } from '@/lib/auth'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { StatusPill } from '@/components/ui/status-pill'
import { EmptyState } from '@/components/ui/empty-state'
import { AutosaveIndicator } from '@/components/ui/autosave-indicator'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Bot } from 'lucide-react'
import { ClientTest } from './client-test'

export default async function ComponentsShowcasePage() {
  await requireAuth()

  return (
    <div className="space-y-8">
      <div>
        <Breadcrumbs
          items={[
            { label: 'Components', href: '/app/components-showcase' },
          ]}
        />
        <h1 className="text-3xl font-bold mt-4 mb-2">UI Components Showcase</h1>
        <p className="text-muted-foreground">
          All shared UI components are displayed here for verification.
        </p>
      </div>

      <Tabs defaultValue="base" className="w-full">
        <TabsList>
          <TabsTrigger value="base">Base Components</TabsTrigger>
          <TabsTrigger value="custom">Custom Components</TabsTrigger>
          <TabsTrigger value="forms">Form Components</TabsTrigger>
        </TabsList>

        <TabsContent value="base" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Buttons</CardTitle>
              <CardDescription>Various button variants</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Button variant="default">Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Badges</CardTitle>
              <CardDescription>Status indicators</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="destructive">Destructive</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Alerts</CardTitle>
              <CardDescription>Notification messages</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertTitle>Info</AlertTitle>
                <AlertDescription>This is an informational alert.</AlertDescription>
              </Alert>
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>This is an error alert.</AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="custom" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status Pills</CardTitle>
              <CardDescription>Status indicators with variants</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <StatusPill status="Active" variant="success" />
              <StatusPill status="Pending" variant="warning" />
              <StatusPill status="Error" variant="danger" />
              <StatusPill status="Info" variant="info" />
              <StatusPill status="Default" variant="default" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Autosave Indicator</CardTitle>
              <CardDescription>Shows save status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <span>Idle:</span>
                <AutosaveIndicator status="idle" />
              </div>
              <div className="flex items-center gap-4">
                <span>Saving:</span>
                <AutosaveIndicator status="saving" />
              </div>
              <div className="flex items-center gap-4">
                <span>Saved:</span>
                <AutosaveIndicator status="saved" />
              </div>
              <div className="flex items-center gap-4">
                <span>Error:</span>
                <AutosaveIndicator status="error" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Empty State</CardTitle>
              <CardDescription>Empty state component</CardDescription>
            </CardHeader>
            <CardContent>
              <EmptyState
                icon={Bot}
                title="No agents yet"
                description="Get started by creating your first agent."
              />
              <div className="mt-4">
                <ClientTest />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forms" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Form Components</CardTitle>
              <CardDescription>Input fields and textareas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Input</label>
                <Input placeholder="Enter text..." />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Textarea</label>
                <Textarea placeholder="Enter longer text..." rows={4} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

