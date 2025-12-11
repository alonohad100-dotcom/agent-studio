/**
 * Capabilities Types
 * Defines the structure for agent capabilities
 */

export interface CapabilitiesJSON {
  information: {
    enabled: boolean
    web_search?: boolean
    knowledge_base?: boolean
  }
  production: {
    enabled: boolean
    code_generation?: boolean
    content_creation?: boolean
  }
  decision_support: {
    enabled: boolean
    analysis?: boolean
    recommendations?: boolean
  }
  automation: {
    enabled: boolean
    api_calls?: boolean
    file_operations?: boolean
  }
  domain_specific: {
    enabled: boolean
    tags: string[]
  }
}

export const DEFAULT_CAPABILITIES: CapabilitiesJSON = {
  information: {
    enabled: false,
    web_search: false,
    knowledge_base: false,
  },
  production: {
    enabled: false,
    code_generation: false,
    content_creation: false,
  },
  decision_support: {
    enabled: false,
    analysis: false,
    recommendations: false,
  },
  automation: {
    enabled: false,
    api_calls: false,
    file_operations: false,
  },
  domain_specific: {
    enabled: false,
    tags: [],
  },
}

