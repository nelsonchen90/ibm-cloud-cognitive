// @flow
/*
 * Licensed Materials - Property of IBM
 * 5724-Q36
 * (c) Copyright IBM Corp. 2021
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 */

import * as React from 'react';
import PropTypes from 'prop-types';
import { Settings16 } from '@carbon/icons-react';
import { Button } from 'carbon-components-react';
import cx from 'classnames';
import RowSizeRadioGroup from './RowSizeRadioGroup';

const RowSizeDropdown = ({ buttonLabel = 'Row height', ...props }) => {
  const buttonRef = React.useRef({});

  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <>
      <Button
        hasIconOnly
        ref={buttonRef}
        kind="ghost"
        tooltipPosition="left"
        renderIcon={Settings16}
        onClick={() => setIsOpen(!isOpen)}
        iconDescription={buttonLabel}
        className={cx({
          'datagrid-row-size-button--open': isOpen,
        })}
      />
      {
        isOpen && (
          <RowSizeRadioGroup
            {...props}
            buttonRef={buttonRef}
            hideRadioGroup={() => {
              setIsOpen(false);
            }}
          />
        )
      }
    </>
  );
};

RowSizeDropdown.propTypes = {
  buttonLabel: PropTypes.string,
  datagridName: PropTypes.string.isRequired,
  light: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  selectedOption: PropTypes.string.isRequired,
};

export default RowSizeDropdown;
