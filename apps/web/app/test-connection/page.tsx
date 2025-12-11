import { testSupabaseConnection, checkEnvVariables } from '@/lib/supabase/test-connection'

export default async function TestConnectionPage() {
  const envCheck = checkEnvVariables()
  const connectionTest = await testSupabaseConnection()

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Supabase Connection Test</h1>
      
      {/* Environment Variables Check */}
      <div className="mb-8 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
        {envCheck.allPresent ? (
          <div className="text-green-600">
            ✅ All required environment variables are set
          </div>
        ) : (
          <div className="text-red-600">
            ❌ Missing environment variables:
            <ul className="list-disc list-inside mt-2">
              {envCheck.missing.map((key) => (
                <li key={key}>{key}</li>
              ))}
            </ul>
          </div>
        )}
        <div className="mt-4 text-sm text-gray-600">
          <p>Present variables:</p>
          <ul className="list-disc list-inside">
            {envCheck.present.map((key) => (
              <li key={key}>{key}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Connection Test */}
      <div className="p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Connection Test</h2>
        {connectionTest.success ? (
          <div className="text-green-600">
            {connectionTest.message}
          </div>
        ) : (
          <div className="text-red-600">
            {connectionTest.message}
            {connectionTest.error ? (
              <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                {connectionTest.error instanceof Error
                  ? connectionTest.error.message
                  : typeof connectionTest.error === 'string'
                  ? connectionTest.error
                  : JSON.stringify(connectionTest.error, null, 2)}
              </pre>
            ) : null}
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold mb-2">Next Steps:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>If environment variables are missing, check your <code className="bg-gray-100 px-1 rounded">.env.local</code> file</li>
          <li>Make sure you&apos;ve copied the complete keys from Supabase dashboard</li>
          <li>Restart the dev server after updating <code className="bg-gray-100 px-1 rounded">.env.local</code></li>
          <li>Once connection is successful, proceed to Phase 1.2 (Database Schema)</li>
        </ol>
      </div>
    </div>
  )
}

