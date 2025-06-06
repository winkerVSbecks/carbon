/**
 * Copyright IBM Corp. 2016, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import cx from 'classnames';
import React, { ReactNode } from 'react';
import PropTypes from 'prop-types';
import { AriaLabelPropType } from '../../prop-types/AriaPropTypes';
import Button from '../Button';
import { usePrefix } from '../../internal/usePrefix';

export interface HeaderGlobalActionProps {
  /**
   * Required props for the accessibility label of the button
   */
  'aria-label'?: string;

  /**
   * Required props for the accessibility label of the button
   */
  'aria-labelledby'?: string;

  /**
   * Provide a custom icon for this global action
   */
  children: ReactNode;

  /**
   * Optionally provide a custom class name that is applied to the underlying
   * button
   */
  className?: string;

  /**
   * Specify whether the action is currently active
   */
  isActive?: boolean;

  /**
   * Optionally provide an onClick handler that is called when the underlying
   * button fires it's onclick event
   */
  onClick?: () => void;

  /**
   * Specify the alignment of the tooltip to the icon-only button.
   * Can be one of: start, center, or end.
   */
  tooltipAlignment?: 'start' | 'center' | 'end';

  /**
   * Enable drop shadow for tooltips for icon-only buttons.
   */
  tooltipDropShadow?: boolean;

  /**
   * Render the tooltip using the high-contrast theme
   * Default is true
   */
  tooltipHighContrast?: boolean;
}

/**
 * HeaderGlobalAction is used as a part of the `HeaderGlobalBar`. It is
 * essentially an Icon Button with an additional state to indicate whether it is
 * "active". The active state comes from when a user clicks on the global action
 * which should trigger a panel to appear.
 *
 * Note: children passed to this component should be an Icon.
 */
const HeaderGlobalAction: React.FC<HeaderGlobalActionProps> = React.forwardRef(
  function HeaderGlobalAction(
    {
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      children,
      className: customClassName,
      onClick,
      tooltipHighContrast = true,
      tooltipDropShadow,
      isActive,
      tooltipAlignment,
      ...rest
    },
    ref: React.Ref<HTMLButtonElement>
  ) {
    const prefix = usePrefix();
    const className = cx({
      [customClassName as string]: !!customClassName,
      [`${prefix}--header__action`]: true,
      [`${prefix}--header__action--active`]: isActive,
    });
    const accessibilityLabel = {
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
    };
    return (
      <Button
        {...rest}
        {...accessibilityLabel}
        className={className}
        onClick={onClick}
        type="button"
        hasIconOnly
        size="lg"
        kind="ghost"
        iconDescription={ariaLabel}
        tooltipPosition="bottom"
        tooltipAlignment={tooltipAlignment}
        tooltipDropShadow={tooltipDropShadow}
        tooltipHighContrast={tooltipHighContrast}
        ref={ref}>
        {children}
      </Button>
    );
  }
);

HeaderGlobalAction.propTypes = {
  /**
   * Required props for the accessibility label of the button
   */
  ...AriaLabelPropType,

  /**
   * Provide a custom icon for this global action
   */
  children: PropTypes.node.isRequired,

  /**
   * Optionally provide a custom class name that is applied to the underlying
   * button
   */
  className: PropTypes.string,

  /**
   * Specify whether the action is currently active
   */
  isActive: PropTypes.bool,

  /**
   * Optionally provide an onClick handler that is called when the underlying
   * button fires it's onclick event
   */
  onClick: PropTypes.func,

  /**
   * Specify the alignment of the tooltip to the icon-only button.
   * Can be one of: start, center, or end.
   */
  tooltipAlignment: PropTypes.oneOf(['start', 'center', 'end']),

  /**
   * Enable drop shadow for tooltips for icon-only buttons.
   */
  tooltipDropShadow: PropTypes.bool,

  /**
   * Render the tooltip using the high-contrast theme
   * Default is true
   */
  tooltipHighContrast: PropTypes.bool,
};

HeaderGlobalAction.displayName = 'HeaderGlobalAction';

export default HeaderGlobalAction;
