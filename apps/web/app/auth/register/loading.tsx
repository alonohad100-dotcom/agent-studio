import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function RegisterLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 px-4 py-12">
      <Card className="w-full max-w-md mx-auto shadow-xl">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-8 w-40" />
          </div>
          <Skeleton className="h-4 w-72" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          </div>
          <Skeleton className="h-11 w-full rounded-md" />
          <Skeleton className="h-4 w-full" />
        </CardContent>
      </Card>
    </div>
  )
}
