import {
  PageSection,
  Title,
  Card,
  CardBody,
  CardTitle,
  Gallery,
  GalleryItem,
  Spinner,
  EmptyState,
  EmptyStateBody,
  EmptyStateVariant,
  EmptyStateActions,
  EmptyStateFooter,
  Button,
  Label,
  LabelGroup,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  Alert,
  Split,
  SplitItem,
  TextInput,
  FormGroup,
} from '@patternfly/react-core';
import { PlusCircleIcon } from '@patternfly/react-icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom-v5-compat';
import { useDashboards, useDashboardActions } from '../../hooks/useDashboard';
import type { AladdinDashboard } from '../../types/dashboard';

const DEFAULT_NAMESPACE = 'default';

export const TestDashboardView: React.FC = () => {
  const { t } = useTranslation('plugin__genie-web-client');
  const [namespace, setNamespace] = useState(DEFAULT_NAMESPACE);
  const { dashboards, loaded, error } = useDashboards({ namespace });
  const { deleteDashboard } = useDashboardActions(namespace);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDelete = async (dashboard: AladdinDashboard) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${dashboard.spec.title}"?`
    );
    if (confirmed) {
      try {
        setDeleteError(null);
        await deleteDashboard(dashboard);
      } catch (err) {
        setDeleteError(
          err instanceof Error ? err.message : 'Failed to delete dashboard'
        );
      }
    }
  };

  const renderContent = () => {
    if (!loaded) {
      return (
        <EmptyState variant={EmptyStateVariant.lg}>
          <Spinner size="lg" />
          <EmptyStateBody>
            {t('Loading dashboards...')}
          </EmptyStateBody>
        </EmptyState>
      );
    }

    if (error) {
      return (
        <Alert variant="danger" title={t('Error loading dashboards')}>
          {error.message}
        </Alert>
      );
    }

    if (dashboards.length === 0) {
      return (
        <EmptyState variant={EmptyStateVariant.lg} titleText={t('No dashboards found')} headingLevel="h2">
          <EmptyStateBody>
            {t('No dashboards exist in namespace "{{namespace}}". Create one to get started.', { namespace })}
          </EmptyStateBody>
          <EmptyStateFooter>
            <EmptyStateActions>
              <Link to="/genie/test_edit_dashboard">
                <Button variant="primary" icon={<PlusCircleIcon />}>
                  {t('Create Dashboard')}
                </Button>
              </Link>
            </EmptyStateActions>
          </EmptyStateFooter>
        </EmptyState>
      );
    }

    return (
      <Gallery hasGutter minWidths={{ default: '300px' }}>
        {dashboards.map((dashboard) => (
          <GalleryItem key={dashboard.metadata?.uid}>
            <Card isCompact>
              <CardTitle>
                <Split hasGutter>
                  <SplitItem isFilled>{dashboard.spec.title}</SplitItem>
                  <SplitItem>
                    <Label color="blue">
                      {dashboard.spec.layout.panels?.length ?? 0} panels
                    </Label>
                  </SplitItem>
                </Split>
              </CardTitle>
              <CardBody>
                <DescriptionList isCompact isHorizontal>
                  <DescriptionListGroup>
                    <DescriptionListTerm>{t('Name')}</DescriptionListTerm>
                    <DescriptionListDescription>
                      {dashboard.metadata?.name}
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                  <DescriptionListGroup>
                    <DescriptionListTerm>{t('Namespace')}</DescriptionListTerm>
                    <DescriptionListDescription>
                      {dashboard.metadata?.namespace}
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                  {dashboard.spec.description && (
                    <DescriptionListGroup>
                      <DescriptionListTerm>{t('Description')}</DescriptionListTerm>
                      <DescriptionListDescription>
                        {dashboard.spec.description}
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                  )}
                  {dashboard.spec.owner && (
                    <DescriptionListGroup>
                      <DescriptionListTerm>{t('Owner')}</DescriptionListTerm>
                      <DescriptionListDescription>
                        {dashboard.spec.owner}
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                  )}
                  {dashboard.spec.tags && dashboard.spec.tags.length > 0 && (
                    <DescriptionListGroup>
                      <DescriptionListTerm>{t('Tags')}</DescriptionListTerm>
                      <DescriptionListDescription>
                        <LabelGroup>
                          {dashboard.spec.tags.map((tag) => (
                            <Label key={tag} color="grey">
                              {tag}
                            </Label>
                          ))}
                        </LabelGroup>
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                  )}
                  <DescriptionListGroup>
                    <DescriptionListTerm>{t('Created')}</DescriptionListTerm>
                    <DescriptionListDescription>
                      {dashboard.metadata?.creationTimestamp
                        ? new Date(dashboard.metadata.creationTimestamp).toLocaleString()
                        : '-'}
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                </DescriptionList>
                <Split hasGutter style={{ marginTop: '1rem' }}>
                  <SplitItem>
                    <Link
                      to={`/genie/test_edit_dashboard?name=${dashboard.metadata?.name}&namespace=${dashboard.metadata?.namespace}`}
                    >
                      <Button variant="secondary" size="sm">
                        {t('Edit')}
                      </Button>
                    </Link>
                  </SplitItem>
                  <SplitItem>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(dashboard)}
                    >
                      {t('Delete')}
                    </Button>
                  </SplitItem>
                </Split>
              </CardBody>
            </Card>
          </GalleryItem>
        ))}
      </Gallery>
    );
  };

  return (
    <PageSection>
      <Split hasGutter style={{ marginBottom: '1rem' }}>
        <SplitItem isFilled>
          <Title headingLevel="h1">{t('Dashboard CRD Test')}</Title>
        </SplitItem>
        <SplitItem>
          <Link to="/genie/test_edit_dashboard">
            <Button variant="primary" icon={<PlusCircleIcon />}>
              {t('Create Dashboard')}
            </Button>
          </Link>
        </SplitItem>
      </Split>

      <FormGroup label={t('Namespace')} fieldId="namespace-input" style={{ marginBottom: '1rem', maxWidth: '300px' }}>
        <TextInput
          id="namespace-input"
          value={namespace}
          onChange={(_event, value) => setNamespace(value)}
          placeholder="default"
        />
      </FormGroup>

      {deleteError && (
        <Alert
          variant="danger"
          title={t('Delete failed')}
          style={{ marginBottom: '1rem' }}
          actionClose={<Button variant="plain" onClick={() => setDeleteError(null)}>×</Button>}
        >
          {deleteError}
        </Alert>
      )}

      {renderContent()}
    </PageSection>
  );
};
