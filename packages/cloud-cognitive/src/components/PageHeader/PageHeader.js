//
// Copyright IBM Corp. 2020, 2020
//
// This source code is licensed under the Apache-2.0 license found in the
// LICENSE file in the root directory of this source tree.
//

import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { layout05, baseFontSize } from '@carbon/layout';
import cx from 'classnames';
import ReactResizeDetector from 'react-resize-detector';
import { useWindowResize, useWindowScroll } from '../../global/js/use';
import {
  BreadcrumbItem,
  Grid,
  Column,
  Row,
  Button,
  SkeletonText,
} from 'carbon-components-react';
import { ActionBar } from '../ActionBar/';
import { BreadcrumbWithOverflow } from '../BreadcrumbWithOverflow';
import { TagSet } from '../TagSet';
import { ButtonSetWithOverflow } from '../ButtonSetWithOverflow';
import { pkg } from '../../settings';
import { ChevronUp16 } from '@carbon/icons-react';
import {
  deprecateProp,
  deprecatePropUsage,
  extractShapesArray,
  prepareProps,
} from '../../global/js/utils/props-helper';

const componentName = 'PageHeader';
const blockClass = `${pkg.prefix}--page-header`;

export let PageHeader = React.forwardRef(
  (
    {
      actionBarItems,
      availableSpace,
      background,
      breadcrumbItems,
      className,
      collapseHeader,
      collapseHeaderLabel,
      expandHeaderLabel,
      collapseHeaderToggleWanted,
      preventBreadcrumbScroll,
      navigation,
      pageActions,
      pageHeaderOffset,
      preCollapseTitleRow,
      subtitle,
      tags,
      title,
      titleIcon,
      ...rest
    },
    ref
  ) => {
    const [hasActionBar, setHasActionBar] = useState(false);
    const [actionBarItemArray, setActionBarItemArray] = useState([]);
    const [pageActionsItemArray, setPageActionsItemArray] = useState([]);
    const [metrics, setMetrics] = useState({});
    const [scrollYValue, setScrollYValue] = useState(0);
    const [componentCssCustomProps, setComponentCssCustomProps] = useState({});
    const [hasBreadcrumbRow, setHasBreadcrumbRow] = useState(false);
    const [spacingBelowTitle, setSpacingBelowTitle] = useState('06');
    const [
      pageActionsInBreadcrumbRow,
      setPageActionsInBreadcrumbRow,
    ] = useState(false);
    const [backgroundOpacity, setBackgroundOpacity] = useState(0);
    const [hasCollapseButton, setHasCollapseButton] = useState(false);
    const [spaceForCollapseButton, setSpaceForCollapseButton] = useState(false);
    const [lastRowBufferActive, setLastRowBufferActive] = useState(false);
    const dynamicRefs = useRef({});
    const localHeaderRef = useRef(null);
    const headerRef = ref || localHeaderRef;
    const [actionBarMaxWidth, setActionBarMaxWidth] = useState(0);
    const [actionBarMinWidth, setActionBarMinWidth] = useState(0);
    const [
      pageActionInBreadcrumbMaxWidth,
      setPageActionInBreadcrumbMaxWidth,
    ] = useState(0);
    const [
      pageActionInBreadcrumbMinWidth,
      setPageActionInBreadcrumbMinWidth,
    ] = useState(0);
    const [actionBarColumnWidth, setActionBarColumnWidth] = useState(0);
    const [fullyCollapsed, setFullyCollapsed] = useState(false);

    /**
     * * Title shape is used to allow title to be string or shape
     */
    const [titleShape, setTitleShape] = useState({});
    useEffect(() => {
      let newShape = { ...PageHeader.defaultProps.title };

      if (title?.text) {
        // title is in shape format
        newShape = Object.assign(newShape, { ...title });
      } else {
        // title is a string
        newShape.text = title;
      }

      if (!newShape.icon && titleIcon) {
        // if no icon use titleIcon if supplied
        newShape.icon = titleIcon;
      }

      setTitleShape(newShape);
    }, [title, titleIcon]);

    useEffect(() => {
      let newActionBarWidth = 'initial';
      let newPageActionInBreadcrumbWidth = 'initial';

      if (actionBarColumnWidth > 0) {
        if (
          pageActionInBreadcrumbMaxWidth > 0 &&
          actionBarColumnWidth >
            actionBarMaxWidth + pageActionInBreadcrumbMaxWidth
        ) {
          newPageActionInBreadcrumbWidth = `${pageActionInBreadcrumbMaxWidth}px`;
        } else if (pageActionInBreadcrumbMinWidth > 0) {
          newPageActionInBreadcrumbWidth = `${pageActionInBreadcrumbMinWidth}px`;
        }

        if (
          actionBarMaxWidth > 0 &&
          actionBarColumnWidth >
            pageActionInBreadcrumbMinWidth + actionBarMaxWidth
        ) {
          newActionBarWidth = `${actionBarMaxWidth}px`;
        } else {
          if (actionBarMinWidth > 0) {
            newActionBarWidth = `${
              actionBarColumnWidth - pageActionInBreadcrumbMinWidth
            }px`;
          }
        }
      }

      setComponentCssCustomProps((prevCSSProps) => {
        return {
          ...prevCSSProps,
          [`--${blockClass}--max-action-bar-width-px`]: newActionBarWidth,
          [`--${blockClass}--button-set-in-breadcrumb-width-px`]: `${newPageActionInBreadcrumbWidth}`,
        };
      });
    }, [
      actionBarColumnWidth,
      actionBarMaxWidth,
      actionBarMinWidth,
      pageActionInBreadcrumbMaxWidth,
      pageActionInBreadcrumbMinWidth,
    ]);

    const handleActionBarWidthChange = ({ minWidth, maxWidth }) => {
      setActionBarMaxWidth(maxWidth);
      setActionBarMinWidth(minWidth);
    };

    const handleButtonSetWidthChange = ({ minWidth, maxWidth }) => {
      setPageActionInBreadcrumbMaxWidth(maxWidth);
      setPageActionInBreadcrumbMinWidth(minWidth);
    };

    const handleResizeActionBarColumn = (width) => {
      setActionBarColumnWidth(width);
    };

    const getDynamicRef = (selector) => {
      // would love to do this differently but digging in the dom seems easier
      // than getting a ref to a conditionally rendered item
      if (!headerRef.current) {
        return undefined;
      } else {
        let dRef = dynamicRefs.current[selector];
        if (!dRef || dRef.parentNode === null) {
          dynamicRefs.current[selector] = headerRef.current.querySelector(
            selector
          );
        }
      }
      return dynamicRefs.current[selector];
    };

    const checkUpdateVerticalSpace = () => {
      // Utility function that checks the heights of various elements which are used to determine layout
      const update = {};

      const breadcrumbTitleEl = getDynamicRef(
        `.${blockClass}__breadcrumb-title`
      );
      const breadcrumbRowEl = getDynamicRef(`.${blockClass}__breadcrumb-row`);
      const titleRowEl = getDynamicRef(`.${blockClass}__title-row`);
      const subtitleRowEl = getDynamicRef(`.${blockClass}__subtitle-row`);
      const availableRowEl = getDynamicRef(`.${blockClass}__available-row`);
      const navigationRowEl = getDynamicRef(`.${blockClass}__navigation-row`);

      update.headerHeight = headerRef.current
        ? headerRef.current.clientHeight
        : 0;
      update.headerWidth = headerRef.current
        ? headerRef.current.offsetWidth
        : 0;

      update.breadcrumbRowHeight = breadcrumbRowEl
        ? breadcrumbRowEl.clientHeight
        : 0;
      update.breadcrumbRowWidth = breadcrumbRowEl
        ? breadcrumbRowEl.offsetWidth
        : 0;

      update.breadcrumbTitleHeight = breadcrumbTitleEl
        ? breadcrumbTitleEl.clientHeight
        : 1;

      update.titleRowHeight = titleRowEl ? titleRowEl.clientHeight : 0;
      update.subtitleRowHeight = subtitleRowEl ? subtitleRowEl.clientHeight : 0;
      update.availableRowHeight = availableRowEl
        ? availableRowEl.clientHeight
        : 0;
      update.navigationRowHeight = navigationRowEl
        ? navigationRowEl.clientHeight
        : 1;

      update.breadcrumbRowSpaceBelow = 0;
      update.titleRowSpaceAbove = 0;

      update.headerTopValue = navigation
        ? preventBreadcrumbScroll
          ? update.navigationRowHeight +
            update.breadcrumbRowHeight -
            update.headerHeight
          : update.navigationRowHeight - update.headerHeight
        : update.breadcrumbRowHeight - update.headerHeight;

      if (window) {
        let val;
        if (breadcrumbRowEl) {
          val = parseFloat(
            window
              .getComputedStyle(breadcrumbRowEl)
              .getPropertyValue('margin-bottom'),
            10
          );
          update.breadcrumbRowSpaceBelow = isNaN(val) ? 0 : val;
        }
        if (titleRowEl) {
          val = parseFloat(
            window.getComputedStyle(titleRowEl).getPropertyValue('margin-top'),
            10
          );
          update.titleRowSpaceAbove = isNaN(val) ? 0 : val;
        }
      }

      setMetrics((previous) => ({ ...previous, ...update }));
    };

    useEffect(() => {
      // NOTE: The buffer is used to add space between the bottom of the header and the last content

      // No navigation and title row not pre-collapsed
      // and zero or one of tags or (subtitle or available space)
      setLastRowBufferActive(
        !(navigation || tags) &&
          (((title || pageActions) && !preCollapseTitleRow) ||
            subtitle ||
            availableSpace)
      );
    }, [
      availableSpace,
      navigation,
      pageActions,
      preCollapseTitleRow,
      setLastRowBufferActive,
      subtitle,
      tags,
      title,
    ]);

    useEffect(() => {
      // Determine the location of the pageAction buttons
      setPageActionsInBreadcrumbRow(
        preCollapseTitleRow ||
          (scrollYValue > metrics.titleRowSpaceAbove && hasActionBar)
      );
    }, [
      hasActionBar,
      metrics.breadcrumbRowSpaceBelow,
      metrics.titleRowSpaceAbove,
      preCollapseTitleRow,
      scrollYValue,
    ]);

    useEffect(() => {
      // Updates custom CSS props used to manage scroll behaviour
      setComponentCssCustomProps((prevCSSProps) => {
        return {
          ...prevCSSProps,
          [`--${blockClass}--height-px`]: `${metrics.headerHeight}px`,
          [`--${blockClass}--width-px`]: `${metrics.headerWidth}px`,
          [`--${blockClass}--header-top`]: `${
            metrics.headerTopValue + pageHeaderOffset
          }px`,
          [`--${blockClass}--breadcrumb-title-visibility`]:
            scrollYValue > 0 ? 'visible' : 'hidden',
          [`--${blockClass}--scroll`]: `${scrollYValue}`,
          [`--${blockClass}--breadcrumb-title-top`]: `${Math.max(
            0,
            metrics.breadcrumbTitleHeight +
              metrics.titleRowSpaceAbove -
              scrollYValue
          )}px`,
          [`--${blockClass}--breadcrumb-title-opacity`]: `${Math.min(
            1,
            Math.max(
              0,
              (scrollYValue - (metrics.titleRowSpaceAbove || 0)) /
                (metrics.breadcrumbTitleHeight || 1) // don't want to
            )
          )}`,
          [`--${blockClass}--breadcrumb-row-width-px`]: `${metrics.breadcrumbRowWidth}px`,
          [`--${blockClass}--breadcrumb-top`]: `${Math.min(
            pageHeaderOffset,
            !preventBreadcrumbScroll && navigation
              ? metrics.headerHeight -
                  metrics.titleRowSpaceAbove -
                  metrics.navigationRowHeight -
                  metrics.breadcrumbRowHeight -
                  scrollYValue +
                  pageHeaderOffset
              : pageHeaderOffset
          )}px`,
        };
      });
    }, [
      preventBreadcrumbScroll,
      metrics,
      metrics.breadcrumbRowHeight,
      metrics.breadcrumbRowSpaceBelow,
      metrics.breadcrumbTitleHeight,
      metrics.breadcrumbRowWidth,
      metrics.headerHeight,
      metrics.headerWidth,
      metrics.headerTopValue,
      metrics.navigationRowHeight,
      navigation,
      pageHeaderOffset,
      scrollYValue,
      tags,
    ]);

    useWindowScroll(
      // on scroll or various layout changes check updates if needed
      ({ current }) => {
        const fullyCollapsed =
          current.scrollY + metrics.headerTopValue + pageHeaderOffset >= 0;
        setFullyCollapsed(fullyCollapsed);

        // set offset for tagset tooltip
        const tagsetTooltipOffset = fullyCollapsed
          ? metrics.headerHeight + metrics.headerTopValue + pageHeaderOffset
          : metrics.headerHeight + pageHeaderOffset;

        document.documentElement.style.setProperty(
          `--${blockClass}--tagset-tooltip-position`,
          fullyCollapsed ? 'fixed' : 'absolute'
        );

        document.documentElement.style.setProperty(
          `--${blockClass}--tagset-tooltip-offset`,
          `${tagsetTooltipOffset}px`
        );

        setScrollYValue(current.scrollY);
      },
      [
        actionBarItems,
        availableSpace,
        breadcrumbItems,
        metrics.headerHeight,
        metrics.headerTopValue,
        navigation,
        pageActions,
        pageHeaderOffset,
        subtitle,
        tags,
        title,
      ]
    );

    useWindowResize(() => {
      // on window resieze and other updates some values may have changed
      checkUpdateVerticalSpace();
    }, [
      actionBarItems,
      availableSpace,
      breadcrumbItems,
      preventBreadcrumbScroll,
      navigation,
      pageActions,
      subtitle,
      tags,
      title,
    ]);

    useEffect(() => {
      // Breadcrumb row only rendered if true
      // eslint-disable-next-line
      setHasBreadcrumbRow(
        !(breadcrumbItems === undefined && actionBarItems === undefined)
      );
    }, [actionBarItems, breadcrumbItems]);

    useEffect(() => {
      const newShapes = extractShapesArray(actionBarItems);
      setHasActionBar(newShapes.length);
      setActionBarItemArray(newShapes);
    }, [actionBarItems]);

    useEffect(() => {
      const shapes = extractShapesArray(pageActions);
      setPageActionsItemArray(
        shapes?.map((shape) => ({ label: shape.children, ...shape }))
      );
    }, [pageActions]);

    useEffect(() => {
      // Determines the amount of space needed below the title
      let belowTitleSpace = 'default';

      if (
        pageActions !== undefined &&
        navigation !== undefined &&
        subtitle === undefined &&
        availableSpace === undefined
      ) {
        belowTitleSpace = '06';
      } else if (subtitle !== undefined || availableSpace !== undefined) {
        belowTitleSpace = '03';
      } else if (navigation === undefined && tags !== undefined) {
        belowTitleSpace = '05';
      }
      setSpacingBelowTitle(belowTitleSpace);
    }, [availableSpace, tags, navigation, subtitle, pageActions]);

    useEffect(() => {
      // Determines if the background should be one based on the header height or scroll
      let result = background && 1;

      if (
        !result &&
        metrics.headerHeight > 0 &&
        (breadcrumbItems || actionBarItems || tags || navigation)
      ) {
        const startAddingAt = parseFloat(layout05, 10) * parseInt(baseFontSize);
        const scrollRemaining = metrics.headerHeight - scrollYValue;
        if (scrollRemaining < startAddingAt) {
          const distanceAddingOver =
            startAddingAt - metrics.breadcrumbRowHeight;
          result = Math.min(
            1,
            (startAddingAt - scrollRemaining) / distanceAddingOver
          );
        }
      }

      setComponentCssCustomProps((prevCSSProps) => ({
        ...prevCSSProps,
        [`--${blockClass}--background-opacity`]: result,
      }));
      setBackgroundOpacity(result);
      setHasCollapseButton(collapseHeaderToggleWanted && result > 0);
    }, [
      actionBarItems,
      background,
      breadcrumbItems,
      metrics.breadcrumbRowHeight,
      metrics.headerHeight,
      navigation,
      scrollYValue,
      collapseHeaderToggleWanted,
      tags,
    ]);

    useEffect(() => {
      setSpaceForCollapseButton(
        hasCollapseButton && !(navigation || tags) && metrics.headerHeight
      );
    }, [hasCollapseButton, navigation, tags, metrics.headerHeight]);

    const handleResize = () => {
      // receives width and height parameters if needed
      checkUpdateVerticalSpace();
    };

    const nextToTabsCheck = () => {
      return (
        actionBarItems === undefined &&
        scrollYValue + metrics.headerTopValue > 0
      );
    };

    const toggleCollapse = (forceCollapse) => {
      const collapse =
        typeof forceCollapse !== 'undefined' ? forceCollapse : !fullyCollapsed;

      if (collapse) {
        window.scrollTo({
          top: pageHeaderOffset - (metrics?.headerTopValue || 0),
          behavior: 'smooth',
        });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    const handleCollapseToggle = () => {
      toggleCollapse();
    };

    useEffect(() => {
      toggleCollapse(collapseHeader);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [collapseHeader]);

    const {
      text: titleText,
      icon: TitleIcon,
      loading: titleLoading,
    } = titleShape;

    return (
      <ReactResizeDetector handleHeight onResize={handleResize}>
        <section
          {...rest}
          className={cx([
            blockClass,
            `${blockClass}--no-margins-below-row`,
            className,
            {
              [`${blockClass}--show-background`]: backgroundOpacity > 0,
            },
          ])}
          ref={headerRef}
          style={componentCssCustomProps}>
          <Grid>
            {hasBreadcrumbRow ? (
              <Row
                className={cx(`${blockClass}__breadcrumb-row`, {
                  [`${blockClass}__breadcrumb-row--next-to-tabs`]: nextToTabsCheck(),
                  [`${blockClass}__breadcrumb-row--has-breadcrumbs`]: breadcrumbItems,
                  [`${blockClass}__breadcrumb-row--has-action-bar`]: hasActionBar,
                })}>
                <div className={`${blockClass}__breadcrumb-row--container`}>
                  <Column
                    className={cx(`${blockClass}__breadcrumb-column`, {
                      [`${blockClass}__breadcrumb-column--background`]:
                        breadcrumbItems !== undefined || hasActionBar,
                    })}>
                    {/* keeps actionBar right even if empty */}

                    {breadcrumbItems !== undefined ? (
                      <BreadcrumbWithOverflow
                        className={`${blockClass}__breadcrumb`}
                        noTrailingSlash={title !== undefined}>
                        {breadcrumbItems}
                        {title ? (
                          <BreadcrumbItem
                            href="#"
                            isCurrentPage={true}
                            className={cx([
                              `${blockClass}__breadcrumb-title`,
                              {
                                [`${blockClass}__breadcrumb-title--pre-collapsed`]: preCollapseTitleRow,
                              },
                            ])}>
                            {titleLoading ? <SkeletonText /> : titleText}
                          </BreadcrumbItem>
                        ) : (
                          ''
                        )}
                      </BreadcrumbWithOverflow>
                    ) : (
                      ''
                    )}
                  </Column>
                  <Column
                    className={cx([
                      `${blockClass}__action-bar-column ${blockClass}__action-bar-column--background`,
                      {
                        [`${blockClass}__action-bar-column--has-page-actions`]: pageActions,
                        [`${blockClass}__action-bar-column--influenced-by-collapse-button`]: spaceForCollapseButton,
                      },
                    ])}>
                    <ReactResizeDetector
                      handleWidth={true}
                      onResize={handleResizeActionBarColumn}>
                      <div
                        className={`${blockClass}__action-bar-column-content`}>
                        {hasActionBar ? (
                          // Investigate the responsive  behaviour or this and the title also fix the ActionBar Item and PageAction story css
                          <>
                            {pageActions && (
                              <div
                                className={cx(`${blockClass}__page-actions`, {
                                  [`${blockClass}__page-actions--in-breadcrumb`]: pageActionsInBreadcrumbRow,
                                })}>
                                <ButtonSetWithOverflow
                                  className={`${blockClass}__button-set--in-breadcrumb`}
                                  onWidthChange={handleButtonSetWidthChange}
                                  buttons={pageActionsItemArray}
                                />
                              </div>
                            )}
                            <ActionBar
                              actions={actionBarItemArray}
                              className={`${blockClass}__action-bar`}
                              onWidthChange={handleActionBarWidthChange}
                              rightAlign={true}
                            />
                          </>
                        ) : null}
                      </div>
                    </ReactResizeDetector>
                  </Column>
                </div>
              </Row>
            ) : null}

            {!preCollapseTitleRow &&
            !(title === undefined && pageActions === undefined) ? (
              <Row
                className={cx(
                  `${blockClass}__title-row`,
                  `${blockClass}__title-row--spacing-below-${spacingBelowTitle}`,
                  {
                    [`${blockClass}__title-row--no-breadcrumb-row`]: !hasBreadcrumbRow,
                    [`${blockClass}__title-row--under-action-bar`]: hasActionBar,
                    [`${blockClass}__title-row--sticky`]:
                      pageActions !== undefined &&
                      actionBarItems === undefined &&
                      hasBreadcrumbRow,
                  }
                )}>
                <Column className={`${blockClass}__title-column`}>
                  {/* keeps page actions right even if empty */}
                  {title !== undefined ? (
                    <div
                      className={cx(`${blockClass}__title`, {
                        [`${blockClass}__title--fades`]: hasBreadcrumbRow,
                      })}>
                      {TitleIcon && !titleLoading ? (
                        <TitleIcon className={`${blockClass}__title-icon`} />
                      ) : null}
                      <span title={!titleLoading ? titleText : null}>
                        {titleLoading ? (
                          <SkeletonText
                            className={`${blockClass}__title-skeleton`}
                          />
                        ) : (
                          titleText
                        )}
                      </span>
                    </div>
                  ) : null}
                </Column>

                {pageActions !== undefined ? (
                  <Column
                    className={cx(`${blockClass}__page-actions`, {
                      [`${blockClass}__page-actions--in-breadcrumb`]: pageActionsInBreadcrumbRow,
                    })}>
                    <ButtonSetWithOverflow
                      className={`${blockClass}__page-actions-container`}
                      onWidthChange={handleButtonSetWidthChange}
                      buttons={pageActionsItemArray}
                    />
                  </Column>
                ) : null}
              </Row>
            ) : null}

            {subtitle !== undefined ? (
              <Row className={`${blockClass}__subtitle-row`}>
                <Column className={`${blockClass}__subtitle`}>
                  {subtitle}
                </Column>
              </Row>
            ) : null}

            {availableSpace !== undefined ? (
              <Row className={`${blockClass}__available-row`}>
                <Column className={`${blockClass}__available-column`}>
                  {availableSpace}
                </Column>
              </Row>
            ) : null}

            {/* Last row margin-below causes problems for scroll behaviour when it sticks the header.
          This buffer is used in CSS instead to add vertical space after the last row but only if there is no navigation row
           */}
            {(breadcrumbItems ||
              actionBarItems ||
              title ||
              pageActions ||
              availableSpace ||
              subtitle) && (
              <div
                className={cx([
                  `${blockClass}__last-row-buffer`,
                  {
                    [`${blockClass}__last-row-buffer--active`]: lastRowBufferActive,
                  },
                ])}></div>
            )}

            {navigation || tags ? (
              <Row
                className={cx(`${blockClass}__navigation-row`, {
                  [`${blockClass}__navigation-row--spacing-above-06`]:
                    navigation !== undefined,
                  [`${blockClass}__navigation-row--has-tags`]: tags,
                })}>
                {navigation !== undefined ? (
                  <Column className={`${blockClass}__navigation-tabs`}>
                    {navigation}
                  </Column>
                ) : null}
                {tags !== undefined ? (
                  <Column
                    className={cx(`${blockClass}__navigation-tags`, {
                      [`${blockClass}__navigation-tags--tags-only`]:
                        navigation === undefined,
                    })}>
                    <TagSet
                      overflowAlign="end"
                      overflowClassName={`${blockClass}__tagset-tooltip`}>
                      {tags}
                    </TagSet>
                  </Column>
                ) : null}
              </Row>
            ) : null}
          </Grid>
          {hasCollapseButton ? (
            <Button
              className={cx(`${blockClass}__collapse-expand-toggle`, {
                [`${blockClass}__collapse-expand-toggle--collapsed`]: fullyCollapsed,
              })}
              data-collapse={fullyCollapsed ? 'collapsed' : 'not collapsed'}
              hasIconOnly={true}
              iconDescription={
                fullyCollapsed ? collapseHeaderLabel : expandHeaderLabel
              }
              kind="ghost"
              onClick={handleCollapseToggle}
              renderIcon={ChevronUp16}
              size="field"
              tooltipPosition="bottom"
              tooltipAlignment="end"
              type="button"
            />
          ) : null}
        </section>
      </ReactResizeDetector>
    );
  }
);

// Return a placeholder if not released and not enabled by feature flag
PageHeader = pkg.checkComponentEnabled(PageHeader, componentName);

PageHeader.propTypes = {
  /**
   * Specifies the action bar items. Each item is specified as an object
   * with the properties of a Carbon Button in icon only form. Button kind, size, tooltipPosition,
   * tooltipAlignment and type are ignored.
   */
  actionBarItems: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.shape({
        ...prepareProps(Button.propTypes, [
          'kind',
          'size',
          'tooltipPosition',
          'tooltipAlignment',
        ]),
        iconDescription: PropTypes.string.isRequired,
        onClick: Button.propTypes.onClick,
        renderIcon: PropTypes.oneOfType([PropTypes.func, PropTypes.object])
          .isRequired,
      })
    ),
    deprecatePropUsage(
      PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.element),
        PropTypes.element,
      ]),
      'Expects an array of objects with the following properties: iconDescription, renderIcon and onClick.'
    ),
  ]), // expects action bar item as array or in fragment
  /**
   * A zone for placing high-level, client content above the page tabs.
   * Accepts arbitrary renderable content as a React node. Optional.
   */
  availableSpace: PropTypes.node,
  /**
   * Specifies if the PageHeader should have a background color or not.
   * Optional.
   */
  background: PropTypes.bool,
  /**
   * One or more Carbon BreadcrumbItem components, passed in as React element(s).
   * If provided, these are rendered at the top left of the header as
   * a breadcrumb. Optional.
   */
  breadcrumbItems: PropTypes.element, // expects BreadcrumbItems,
  /**
   * Specifies class(es) to be applied to the top-level PageHeader node.
   * Optional.
   */
  className: PropTypes.string,
  /**
   * The header can as a whole be collapsed, expanded or somewhere in between.
   * This setting controls the initial value, but also takes effect on change
   *
   * NOTE: The header is collapsed by setting the scroll position to hide part of the header. Collapsing has no effect if there is insufficient content to scroll.
   */
  collapseHeader: PropTypes.bool,
  /**
   * Label/assistive text for the collapse/expand button
   * Default 'Collapse'
   */
  collapseHeaderLabel: PropTypes.string,
  /**
   * Enable the collapse header toggle.
   *
   * NOTE: The header is collapsed by setting the scroll position to hide part of the header. Collapsing has no effect if there is insufficient content to scroll.
   */
  collapseHeaderToggleWanted: PropTypes.bool,
  /**
   * Label/assistive text for the collapse/expand button
   * Default 'Expand'
   */
  expandHeaderLabel: PropTypes.string,
  /**
   * Content for the navigation area in the PageHeader. Should
   * be a React element that is normally a Carbon Tabs component. Optional.
   */
  navigation: PropTypes.element, // Supports Tabs
  /**
   * Specifies the primary page actions. Each action is specified as an object
   * with the properties of a Carbon Button plus:
   * - label: node
   *
   * Carbon Button API https://react.carbondesignsystem.com/?path=/docs/components-button--default#component-api
   */
  pageActions: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.shape({
        ...Button.propTypes,
        kind: Button.propTypes.kind,
        label: PropTypes.node.isRequired,
        onClick: Button.propTypes.onClick,
      })
    ),
    deprecatePropUsage(
      PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.element),
        PropTypes.element,
      ]),
      'Expects an array of objects with the following properties: label and onClick.'
    ),
  ]),
  /**
   * Number of pixels the page header sits from the top of the screen.
   * The nature of the pageHeader makes this hard to measure
   */
  pageHeaderOffset: PropTypes.number,
  /**
   * The title row typically starts below the breadcrumb row. This option
   * preCollapses it into the breadcrumb row.
   */
  preCollapseTitleRow: PropTypes.bool,
  /**
   * Standard behavior scrolls the breadcrumb off to leave just tabs. This
   * option preserves vertical space for both.
   */
  preventBreadcrumbScroll: PropTypes.bool,
  /**
   * A subtitle or description that provides additional context to
   * identify the current page. Optional.
   */
  subtitle: PropTypes.string,
  /**
   * One or more tags, specified as a Carbon Tags component.
   * Optional.
   */
  tags: PropTypes.arrayOf(PropTypes.element),
  /**
   * The title of the page.
   * Optional string or object with the following attributes: text, icon, loading
   */
  title: PropTypes.oneOfType([
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      icon: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
      loading: PropTypes.bool,
    }),
    PropTypes.string,
  ]),
  /**
   * An icon to be included to the left of the title text.
   * Optional.
   */
  titleIcon: deprecateProp(
    PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    'Use `title` prop shape instead.'
  ),
};

PageHeader.defaultProps = {
  background: true,
  className: '',
  collapseHeaderLabel: 'Collapse',
  expandHeaderLabel: 'Expand',
  preventBreadcrumbScroll: false,
  pageHeaderOffset: 0,
  preCollapseTitleRow: false,
};

PageHeader.displayName = componentName;
