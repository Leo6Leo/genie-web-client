import type { CSSProperties, ReactNode } from 'react';
import { Card, CardBody, CardTitle } from '@patternfly/react-core';
import type { PanelPosition } from '../../types/dashboard';
import './dashboard-renderer.css';

export interface DashboardPanelProps {
  /** Panel title */
  title?: string;
  /** Panel position in the grid */
  position: PanelPosition;
  /** Panel content */
  children: ReactNode;
}

/**
 * Individual panel wrapper with PatternFly Card styling.
 * Positions itself in the CSS Grid based on position prop.
 */
export const DashboardPanel: React.FC<DashboardPanelProps> = ({
  title,
  position,
  children,
}) => {
  // CSS Grid uses 1-based indexing, position uses 0-based
  // grid-column: start / span
  // grid-row: start / span
  const panelStyle: CSSProperties = {
    gridColumn: `${position.x + 1} / span ${position.width}`,
    gridRow: `${position.y + 1} / span ${position.height}`,
  };

  return (
    <div className="dashboard-panel" style={panelStyle}>
      <Card className="dashboard-panel__card" isCompact>
        {title && <CardTitle>{title}</CardTitle>}
        <CardBody>{children}</CardBody>
      </Card>
    </div>
  );
};
