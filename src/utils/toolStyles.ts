export interface ToolGradientStyle {
  bg: string;
  shadow: string;
  accent: string;
}

export const TOOL_GRADIENTS: Record<string, ToolGradientStyle> = {
  'converse-qa': {
    bg: 'linear-gradient(135deg, #2563EB 0%, #0284C7 100%)',
    shadow: 'rgba(37, 99, 235, 0.35)',
    accent: '#2563EB'
  },
  'solo-report': {
    bg: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
    shadow: 'rgba(16, 185, 129, 0.35)',
    accent: '#059669'
  },
  'review-flow': {
    bg: 'linear-gradient(135deg, #D97706 0%, #F59E0B 100%)',
    shadow: 'rgba(245, 158, 11, 0.35)',
    accent: '#D97706'
  },
  'commit-track': {
    bg: 'linear-gradient(135deg, #DB2777 0%, #EC4899 100%)',
    shadow: 'rgba(236, 72, 153, 0.35)',
    accent: '#DB2777'
  },
  'invoice-verify': {
    bg: 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 100%)',
    shadow: 'rgba(139, 92, 246, 0.35)',
    accent: '#7C3AED'
  },
  'order-hub': {
    bg: 'linear-gradient(135deg, #0D9488 0%, #14B8A6 100%)',
    shadow: 'rgba(20, 184, 166, 0.35)',
    accent: '#0D9488'
  },
  'ca-docflow': {
    bg: 'linear-gradient(135deg, #EA580C 0%, #F97316 100%)',
    shadow: 'rgba(249, 115, 22, 0.35)',
    accent: '#EA580C'
  },
  'support-lens': {
    bg: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
    shadow: 'rgba(99, 102, 241, 0.35)',
    accent: '#4F46E5'
  }
};

export const DEFAULT_TOOL_GRADIENT: ToolGradientStyle = {
  bg: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)',
  shadow: 'rgba(37, 99, 235, 0.35)',
  accent: '#2563EB'
};

export function getToolGradient(slug?: string | null): ToolGradientStyle {
  if (!slug) return DEFAULT_TOOL_GRADIENT;
  return TOOL_GRADIENTS[slug] ?? DEFAULT_TOOL_GRADIENT;
}

