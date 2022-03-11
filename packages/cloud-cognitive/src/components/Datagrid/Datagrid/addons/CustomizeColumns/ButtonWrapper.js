// @flow
/*
 * Licensed Materials - Property of IBM
 * 5724-Q36
 * (c) Copyright IBM Corp. 2021
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 */

import * as React from 'react';
import { Column16 } from '@carbon/icons-react';
import { Button, PropTypes } from 'carbon-components-react';

const ButtonWrapper = ({
  onClick,
  setIsModalOpen,
  isModalOpen,
  iconTooltipLabel = 'Customize columns',
  ...rest
}) => {
  return (
    <Button
      {...rest}
      renderIcon={Column16}
      iconDescription={iconTooltipLabel}
      tooltipPosition="left"
      kind="ghost"
      hasIconOnly
      test-id="datagrid-customize-columns-trigger"
      onClick={() => {
        setIsModalOpen(!isModalOpen);
        if (typeof onClick === 'function') {
          onClick();
        }
      }}
    />
  );
};

ButtonWrapper.propTypes = {
  iconTooltipLabel: PropTypes.string,
  isModalOpen: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  setIsModalOpen: PropTypes.func.isRequired,
};

export default ButtonWrapper;
