import {
  PageSection,
  Title,
  Button,
  Alert,
  Split,
  SplitItem,
  TextInput,
  FormGroup,
  Form,
  TextArea,
  ActionGroup,
  Spinner,
  Card,
  CardBody,
  CardTitle,
} from '@patternfly/react-core';
import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom-v5-compat';
import { useDashboard, useDashboardActions } from '../../hooks/useDashboard';
import type { AladdinDashboard, AladdinDashboardSpec } from '../../types/dashboard';

const DEFAULT_NAMESPACE = 'default';

const SAMPLE_DASHBOARD_SPEC: AladdinDashboardSpec = {
  title: 'My New Dashboard',
  description: 'A sample dashboard created via the test editor',
  refreshInterval: '5m',
  tags: ['test', 'sample'],
  owner: 'user',
  layout: {
    columns: 12,
    panels: [
      {
        id: 'panel-1',
        title: 'Sample Panel',
        position: {
          x: 0,
          y: 0,
          width: 6,
          height: 3,
        },
        component: {
          type: 'Chart',
          version: 'v1',
          config: {
            chartType: 'line',
            title: 'Sample Chart',
          },
        },
        dataSource: {
          toolCall: {
            tool: 'sample_tool',
            arguments: {
              query: 'sample query',
            },
          },
          cachePolicy: 'ShortTerm',
        },
      },
    ],
  },
};

export const TestDashboardEdit: React.FC = () => {
  const { t } = useTranslation('plugin__genie-web-client');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const editName = searchParams.get('name');
  const editNamespace = searchParams.get('namespace') ?? DEFAULT_NAMESPACE;
  const isEditMode = Boolean(editName);

  const [name, setName] = useState(editName ?? '');
  const [namespace, setNamespace] = useState(editNamespace);
  const [specJson, setSpecJson] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Load existing dashboard if editing
  const { dashboard, loaded, error: loadError } = useDashboard({
    name: editName ?? '',
    namespace: editNamespace,
  });

  const { createDashboard, updateDashboard } = useDashboardActions(namespace);

  // Initialize spec JSON
  useEffect(() => {
    if (isEditMode && loaded && dashboard) {
      setSpecJson(JSON.stringify(dashboard.spec, null, 2));
      setName(dashboard.metadata?.name ?? '');
      setNamespace(dashboard.metadata?.namespace ?? DEFAULT_NAMESPACE);
    } else if (!isEditMode && !specJson) {
      setSpecJson(JSON.stringify(SAMPLE_DASHBOARD_SPEC, null, 2));
    }
  }, [isEditMode, loaded, dashboard, specJson]);

  const validateJson = useCallback((json: string): AladdinDashboardSpec | null => {
    try {
      const parsed = JSON.parse(json) as AladdinDashboardSpec;
      if (!parsed.title) {
        throw new Error('spec.title is required');
      }
      if (!parsed.layout?.panels) {
        throw new Error('spec.layout.panels is required');
      }
      return parsed;
    } catch (err) {
      return null;
    }
  }, []);

  const handleSave = async () => {
    setError(null);
    setSuccess(null);

    if (!name.trim()) {
      setError('Dashboard name is required');
      return;
    }

    const spec = validateJson(specJson);
    if (!spec) {
      setError('Invalid JSON. Please check the spec format.');
      return;
    }

    setSaving(true);
    try {
      if (isEditMode && dashboard) {
        // Update existing dashboard
        const updated: AladdinDashboard = {
          ...dashboard,
          spec,
        };
        await updateDashboard(updated);
        setSuccess(`Dashboard "${spec.title}" updated successfully!`);
      } else {
        // Create new dashboard
        await createDashboard(name, spec);
        setSuccess(`Dashboard "${spec.title}" created successfully!`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save dashboard');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/genie/test_dashboard');
  };

  const handleLoadSample = () => {
    setSpecJson(JSON.stringify(SAMPLE_DASHBOARD_SPEC, null, 2));
  };

  const jsonError = specJson ? (validateJson(specJson) ? null : 'Invalid JSON') : null;

  if (isEditMode && !loaded) {
    return (
      <PageSection>
        <Spinner /> {t('Loading dashboard...')}
      </PageSection>
    );
  }

  if (isEditMode && loadError) {
    return (
      <PageSection>
        <Alert variant="danger" title={t('Error loading dashboard')}>
          {loadError.message}
        </Alert>
        <Button variant="link" onClick={handleCancel}>
          {t('Back to dashboard list')}
        </Button>
      </PageSection>
    );
  }

  return (
    <PageSection>
      <Title headingLevel="h1" style={{ marginBottom: '1rem' }}>
        {isEditMode ? t('Edit Dashboard') : t('Create Dashboard')}
      </Title>

      {error && (
        <Alert
          variant="danger"
          title={t('Error')}
          style={{ marginBottom: '1rem' }}
          actionClose={<Button variant="plain" onClick={() => setError(null)}>×</Button>}
        >
          {error}
        </Alert>
      )}

      {success && (
        <Alert
          variant="success"
          title={t('Success')}
          style={{ marginBottom: '1rem' }}
          actionClose={<Button variant="plain" onClick={() => setSuccess(null)}>×</Button>}
        >
          {success}
        </Alert>
      )}

      <Card>
        <CardTitle>{t('Dashboard Metadata')}</CardTitle>
        <CardBody>
          <Form>
            <Split hasGutter>
              <SplitItem isFilled>
                <FormGroup label={t('Name')} fieldId="name-input" isRequired>
                  <TextInput
                    id="name-input"
                    value={name}
                    onChange={(_event, value) => setName(value)}
                    placeholder="my-dashboard"
                    isDisabled={isEditMode}
                    validated={name.trim() ? 'default' : 'error'}
                  />
                </FormGroup>
              </SplitItem>
              <SplitItem isFilled>
                <FormGroup label={t('Namespace')} fieldId="namespace-input" isRequired>
                  <TextInput
                    id="namespace-input"
                    value={namespace}
                    onChange={(_event, value) => setNamespace(value)}
                    placeholder="default"
                    isDisabled={isEditMode}
                  />
                </FormGroup>
              </SplitItem>
            </Split>
          </Form>
        </CardBody>
      </Card>

      <Card style={{ marginTop: '1rem' }}>
        <CardTitle>
          <Split hasGutter>
            <SplitItem isFilled>{t('Dashboard Spec (JSON)')}</SplitItem>
            <SplitItem>
              <Button variant="link" onClick={handleLoadSample} size="sm">
                {t('Load Sample')}
              </Button>
            </SplitItem>
          </Split>
        </CardTitle>
        <CardBody>
          <FormGroup fieldId="spec-json">
            <TextArea
              id="spec-json"
              value={specJson}
              onChange={(_event, value) => setSpecJson(value)}
              aria-label="Dashboard spec JSON"
              rows={25}
              validated={jsonError ? 'error' : 'default'}
              style={{
                fontFamily: 'monospace',
                fontSize: '13px',
              }}
            />
            {jsonError && (
              <div style={{ color: 'var(--pf-t--global--color--status--danger--default)', marginTop: '0.5rem' }}>
                {jsonError}
              </div>
            )}
          </FormGroup>

          <ActionGroup style={{ marginTop: '1rem' }}>
            <Button
              variant="primary"
              onClick={handleSave}
              isLoading={saving}
              isDisabled={saving || Boolean(jsonError)}
            >
              {isEditMode ? t('Update Dashboard') : t('Create Dashboard')}
            </Button>
            <Button variant="link" onClick={handleCancel}>
              {t('Cancel')}
            </Button>
          </ActionGroup>
        </CardBody>
      </Card>
    </PageSection>
  );
};
