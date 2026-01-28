import {
  PageSection,
  Spinner,
  EmptyState,
  EmptyStateBody,
  EmptyStateVariant,
  EmptyStateActions,
  EmptyStateFooter,
  Button,
  Alert,
} from '@patternfly/react-core';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom-v5-compat';
import { useDashboard } from '../../hooks/useDashboard';
import { DashboardRenderer } from './DashboardRenderer';

interface DashboardViewParams {
  namespace: string;
  name: string;
}

/**
 * Route component for viewing a dashboard.
 * Route: /genie/dashboard/:namespace/:name
 */
export const DashboardViewPage: React.FC = () => {
  const { t } = useTranslation('plugin__genie-web-client');
  const navigate = useNavigate();
  const { namespace, name } = useParams<
    keyof DashboardViewParams
  >() as DashboardViewParams;

  const { dashboard, loaded, error } = useDashboard({ name, namespace });

  const handleBackToLibrary = () => {
    navigate('/genie/test_dashboard');
  };

  if (!loaded) {
    return (
      <PageSection isFilled>
        <EmptyState variant={EmptyStateVariant.lg}>
          <Spinner size="xl" />
          <EmptyStateBody>
            {t('dashboardRenderer.loading')}
          </EmptyStateBody>
        </EmptyState>
      </PageSection>
    );
  }

  if (error) {
    return (
      <PageSection>
        <Alert variant="danger" title={t('dashboardRenderer.error.title')}>
          {t('dashboardRenderer.error.description', { error: error.message })}
        </Alert>
        <Button
          variant="primary"
          onClick={handleBackToLibrary}
          style={{ marginTop: 'var(--pf-t--global--spacer--md)' }}
        >
          {t('dashboardRenderer.backToLibrary')}
        </Button>
      </PageSection>
    );
  }

  if (!dashboard) {
    return (
      <PageSection isFilled>
        <EmptyState
          variant={EmptyStateVariant.lg}
          titleText={t('dashboardRenderer.notFound.title')}
          headingLevel="h2"
        >
          <EmptyStateBody>
            {t('dashboardRenderer.notFound.description', { name, namespace })}
          </EmptyStateBody>
          <EmptyStateFooter>
            <EmptyStateActions>
              <Button variant="primary" onClick={handleBackToLibrary}>
                {t('dashboardRenderer.backToLibrary')}
              </Button>
            </EmptyStateActions>
          </EmptyStateFooter>
        </EmptyState>
      </PageSection>
    );
  }

  return (
    <PageSection isFilled padding={{ default: 'padding' }}>
      <DashboardRenderer dashboard={dashboard} />
    </PageSection>
  );
};
