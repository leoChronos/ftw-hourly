import React, { useState, useEffect } from 'react';
import { bool, func, object, number, string } from 'prop-types';
import { FormattedMessage, intlShape } from '../../util/reactIntl';
import classNames from 'classnames';
import { ACCOUNT_SETTINGS_PAGES } from '../../routeConfiguration';
import { propTypes } from '../../util/types';
import {
  Avatar,
  InlineTextButton,
  Logo,
  Menu,
  MenuLabel,
  MenuContent,
  MenuItem,
  NamedLink,
  ExternalLink,
  // ListingLink,
  //OwnListingLink,
} from '../../components';
import { TopbarSearchForm } from '../../forms';
import config from '../../config';

import css from './TopbarDesktop.css';

const TopbarDesktop = props => {
  const {
    className,
    currentUser,
    currentPage,
    rootClassName,
    isBusiness,    
    intl,
    isAuthenticated,
    onLogout,
    onSearchSubmit,
    initialSearchFormValues,
  } = props;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const authenticatedOnClientSide = mounted && isAuthenticated;
  const isAuthenticatedOrJustHydrated = isAuthenticated || !mounted;

  const classes = classNames(rootClassName || css.root, className);

  const search = (
    <TopbarSearchForm
      className={css.searchLink}
      desktopInputRoot={css.topbarSearchWithLeftPadding}
      onSubmit={onSearchSubmit}
      initialValues={initialSearchFormValues}
    />
  );  

  const currentPageClass = page => {
    const isAccountSettingsPage =
      page === 'AccountSettingsPage' && ACCOUNT_SETTINGS_PAGES.includes(currentPage);
    return currentPage === page || isAccountSettingsPage ? css.currentPage : null;
  };

  const profileMenu = authenticatedOnClientSide ? (
    <Menu>
      <MenuLabel className={css.profileMenuLabel} isOpenClassName={css.profileMenuIsOpen}>
        <Avatar className={css.avatar} user={currentUser} disableProfileLink />
      </MenuLabel>
      <MenuContent className={css.profileMenuContent}>
        <MenuItem key="InboxPage">
          <NamedLink
              className={classNames(css.profileSettingsLink, currentPageClass('InboxPage'))}
              name="InboxPage"
              params={{ tab: isBusiness ? 'sales' : 'orders' }}
          >
            <span className={css.menuItemBorder} />
            <FormattedMessage id="TopbarDesktop.inbox" />            
          </NamedLink>
        </MenuItem>        
        <MenuItem key="ProfileSettingsPage">
          <NamedLink
            className={classNames(css.profileSettingsLink, currentPageClass('ProfileSettingsPage'))}
            name="ProfileSettingsPage"
          >
            <span className={css.menuItemBorder} />
            <FormattedMessage id="TopbarDesktop.profileSettingsLink" />
          </NamedLink>
        </MenuItem>        
        <MenuItem key={isBusiness ? "ManageListingsPage" : "ListBusinessPage"}>
          <NamedLink
            className={classNames(css.yourListingsLink, currentPageClass(isBusiness ? 'ManageListingsPage': 'ListBusinessPage'))}
            name={isBusiness ? "ManageListingsPage" : "ListBusinessPage"}
          >
            <span className={css.menuItemBorder} />
            <FormattedMessage id="TopbarDesktop.yourListingsLink" />
          </NamedLink>
        </MenuItem>    
        <MenuItem key="logout">
          <InlineTextButton rootClassName={css.logoutButton} onClick={onLogout}>
            <span className={css.menuItemBorder} />
            <FormattedMessage id="TopbarDesktop.logout" />
          </InlineTextButton>
        </MenuItem>
      </MenuContent>
    </Menu>
  ) : null;

  const signupLink = isAuthenticatedOrJustHydrated ? null : (
    <NamedLink name="SignupPage" className={css.signupLink}>
      <span className={css.signup}>
        <FormattedMessage id="TopbarDesktop.signup" />
      </span>
    </NamedLink>
  );

  const loginLink = isAuthenticatedOrJustHydrated ? null : (
    <NamedLink name="LoginPage" className={css.loginLink}>
      <span className={css.login}>
        <FormattedMessage id="TopbarDesktop.login" />
      </span>
    </NamedLink>
  );

  const menuLinks = (
    <>
      <NamedLink name="SearchPage" className={css.menuLink}>
        <span className={css.link}>
          <FormattedMessage id="TopbarDesktop.explore" />
        </span>
      </NamedLink>
      <NamedLink name="SearchPage" className={css.menuLink}>
        <span className={css.link}>
          <FormattedMessage id="TopbarDesktop.howItWorks" />
        </span>
      </NamedLink>      
      <ExternalLink href={config.linkGoodSpotPartners} className={css.menuLink}>
        <span className={css.link}>
          <FormattedMessage id="TopbarDesktop.forBusiness" />
        </span>
      </ExternalLink>      
      <ExternalLink href={config.linkGoodSpotNeedHelp} className={classNames(css.menuLink, css.lastMenuLink)}>
        <span className={css.link}>
          <FormattedMessage id="TopbarDesktop.needHelp" />
        </span>
      </ExternalLink>
    </>
  );

  return (
    <nav className={classes}>
      <NamedLink className={css.logoLink} name="LandingPage">
        <Logo
          format="desktop"
          className={css.logo}
          alt={intl.formatMessage({ id: 'TopbarDesktop.logo' })}
        />
      </NamedLink>
      {search}      
      {menuLinks}
      {profileMenu}
      {signupLink}
      {loginLink}
    </nav>
  );
};

TopbarDesktop.defaultProps = {
  rootClassName: null,
  className: null,
  currentUser: null,
  currentPage: null,
  notificationCount: 0,
  initialSearchFormValues: {},
  currentUserListing: null,
  currentUserListingFetched: false,
  isBusiness: false,
};

TopbarDesktop.propTypes = {
  rootClassName: string,
  className: string,
  isBusiness: bool.isRequired,
  currentUserListing: propTypes.ownListing,
  currentUserListingFetched: bool,
  currentUser: propTypes.currentUser,
  currentPage: string,
  isAuthenticated: bool.isRequired,
  onLogout: func.isRequired,
  notificationCount: number,
  onSearchSubmit: func.isRequired,
  initialSearchFormValues: object,
  intl: intlShape.isRequired,
};

export default TopbarDesktop;
