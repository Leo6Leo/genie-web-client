import {
  Title,
  Content,
  Button,
  Split,
  SplitItem,
  Label,
  LabelGroup,
} from '@patternfly/react-core';
import { ArrowLeftIcon, PencilAltIcon } from '@patternfly/react-icons';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom-v5-compat';
import type { AladdinDashboardSpec } from '../../types/dashboard';
import './dashboard-renderer.css';

export interface DashboardToolbarProps {
  /** Dashboard specification */
  spec: AladdinDashboardSpec;
  /** Dashboard name (for edit link) */
  name: string;
  /** Dashboard namespace (for edit link) */
  namespace: string;
}

/**
 * Dashboard header toolbar with title, description, and navigation.
 */
export const DashboardToolbar: React.FC<DashboardToolbarProps> = ({
  spec,
  name,
  namespace,
}) => {
  const { t } = useTranslation('plugin__genie-web-client');
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/genie/test_dashboard');
  };

  return (
    <div className="dashboard-renderer__toolbar">
      <Split hasGutter>
        <SplitItem>
          <Button
            variant="plain"
            aria-label={t('dashboardRenderer.backToLibrary')}
            onClick={handleBack}
          >
            <ArrowLeftIcon />
          </Button>
        </SplitItem>
        <SplitItem isFilled>
          <Title headingLevel="h1" size="xl">
            {spec.title}
          </Title>
          {spec.description && (
            <Content component="p">{spec.description}</Content>
          )}
          {spec.tags && spec.tags.length > 0 && (
            <LabelGroup style={{ marginTop: 'var(--pf-t--global--spacer--sm)' }}>
              {spec.tags.map((tag) => (
                <Label key={tag} color="grey">
                  {tag}
                </Label>
              ))}
            </LabelGroup>
          )}
        </SplitItem>
        <SplitItem>
          <Link to={`/genie/test_edit_dashboard?name=${name}&namespace=${namespace}`}>
            <Button variant="secondary" icon={<PencilAltIcon />}>
              {t('dashboardRenderer.edit')}
            </Button>
          </Link>
        </SplitItem>
      </Split>
    </div>
  );
};
