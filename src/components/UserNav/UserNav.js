import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import { ACCOUNT_SETTINGS_PAGES } from '../../routeConfiguration';
import { LinkTabNavHorizontal } from '../../components';

import css from './UserNav.css';

const UserNav = props => {
  const { className, rootClassName, selectedPageName, isBusiness } = props;
  const classes = classNames(rootClassName || css.root, className);

  const tabs = [
    {
      text: <FormattedMessage id="ManageListingsPage.yourInbox" />,
      selected: selectedPageName === 'InboxPage',
      linkProps: {
        name: 'InboxPage',
        params: { tab: isBusiness ? 'sales' : 'orders' }
      },
    },    
    {
      text: <FormattedMessage id="ManageListingsPage.profileSettings" />,
      selected: ACCOUNT_SETTINGS_PAGES.includes(selectedPageName),
      disabled: false,
      linkProps: {
        name: 'ProfileSettingsPage',
      },
    },
    {
      text: <FormattedMessage id="ManageListingsPage.yourListings" />,
      selected: isBusiness ? selectedPageName === 'ManageListingsPage' : selectedPageName === 'ListBusinessPage',
      linkProps: {
        name: isBusiness ? 'ManageListingsPage' : 'ListBusinessPage',
      },
    },    
  ];

  return (
    <LinkTabNavHorizontal className={classes} tabRootClassName={css.tab} tabs={tabs} skin="dark" />
  );
};

UserNav.defaultProps = {
  className: null,
  rootClassName: null,
};

const { string, bool } = PropTypes;

UserNav.propTypes = {
  className: string,
  rootClassName: string,
  selectedPageName: string.isRequired,
  isBusiness: bool.isRequired,
};

export default UserNav;