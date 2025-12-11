'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Lightbulb, AlertCircle } from 'lucide-react'
import { recommendCapabilities } from '@core/capabilities/recommendations'
import type { SpecJSON } from '@core/types/spec'

interface CapabilityRuleHintsProps {
  spec: SpecJSON
  onApplyRecommendation?: (category: string, capability: string) => void
}

export function CapabilityRuleHints({ spec, onApplyRecommendation }: CapabilityRuleHintsProps) {
  const recommendations = recommendCapabilities(spec)

  if (recommendations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Recommendations
          </CardTitle>
          <CardDescription>AI-powered capability suggestions</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No specific recommendations at this time. Review your spec to enable relevant capabilities.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          Recommendations
        </CardTitle>
        <CardDescription>AI-powered capability suggestions based on your spec</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {recommendations.map((rec) => (
          <div
            key={`${rec.category}-${rec.capability}`}
            className="flex items-start justify-between p-3 rounded-lg border bg-card"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm">{rec.capability.replace('_', ' ')}</span>
                <Badge
                  variant={
                    rec.confidence === 'high' ? 'default' : rec.confidence === 'medium' ? 'secondary' : 'outline'
                  }
                >
                  {rec.confidence}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{rec.reason}</p>
            </div>
            {onApplyRecommendation && (
              <button
                onClick={() => onApplyRecommendation(rec.category, rec.capability)}
                className="text-xs text-primary hover:underline ml-2"
              >
                Apply
              </button>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

