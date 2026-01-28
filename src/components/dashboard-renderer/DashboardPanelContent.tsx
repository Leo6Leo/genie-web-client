import { Spinner, Alert, EmptyState, EmptyStateBody } from '@patternfly/react-core';
import DynamicComponent from '@rhngui/patternfly-react-renderer';
import { useTranslation } from 'react-i18next';
import type { DashboardPanel as DashboardPanelType } from '../../types/dashboard';
import { getMockNguiSpec } from './mockPanelData';
import './dashboard-renderer.css';

export interface DashboardPanelContentProps {
  /** Panel configuration from the dashboard CRD */
  panel: DashboardPanelType;
  /** Whether the panel is loading data */
  isLoading?: boolean;
  /** Error message if data fetch failed */
  error?: string | null;
  /** Optional NGUI spec override (for future real data integration) */
  nguiSpec?: Record<string, unknown> | null;
}

/**
 * Renders the content of a dashboard panel.
 * Uses mock NGUI specs for now, with support for real data in the future.
 */
export const DashboardPanelContent: React.FC<DashboardPanelContentProps> = ({
  panel,
  isLoading = false,
  error = null,
  nguiSpec,
}) => {
  const { t } = useTranslation('plugin__genie-web-client');

  if (isLoading) {
    return (
      <div className="dashboard-panel--loading">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-panel--error">
        <Alert variant="danger" title={t('dashboardRenderer.panel.error')} isInline>
          {error}
        </Alert>
      </div>
    );
  }

  // Use provided NGUI spec or fall back to mock data
  const spec = nguiSpec ?? getMockNguiSpec(panel.component);

  if (!spec) {
    return (
      <EmptyState variant="sm">
        <EmptyStateBody>
          {t('dashboardRenderer.panel.noContent')}
        </EmptyStateBody>
      </EmptyState>
    );
  }

  return <DynamicComponent config={spec} />;
};
