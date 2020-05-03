import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';
import classNames from 'classnames';
import { propTypes } from '../../util/types';
import { ensureCurrentUser } from '../../util/data';
import { fetchCurrentUser } from '../../ducks/user.duck';
import { isScrollingDisabled } from '../../ducks/UI.duck';

import {    
    Page,    
    UserNav,    
    LayoutWrapperTopbar,
    LayoutWrapperMain,
    LayoutWrapperFooter,
    Footer,    
    NamedRedirect,
    LayoutWrapperAccountSettingsSideNav,
    LayoutSideNavigation,
    NamedLink,
  } from '../../components';
  import { TopbarContainer } from '../../containers';

  import css from './ListBusinessPage.css';


  export class ListBusinessPageComponent extends Component {
    constructor(props) {
      super(props);
    }

    render() {
      const {       
        currentUser,                         
        scrollingDisabled,     
        intl,   
      } = this.props;

      const user = ensureCurrentUser(currentUser);
      const privateData = user.attributes.profile.privateData || {};
      const isBusiness = privateData.isBusiness || false;      

      if (isBusiness) {
        return <NamedRedirect name="ManageListingsPage"/>;
      }

      const title = intl.formatMessage({ id: 'ListBusinessPage.title' });

      return (        
        <Page title={title} scrollingDisabled={scrollingDisabled}>
            <LayoutSideNavigation>
                <LayoutWrapperTopbar>
                    <TopbarContainer
                        currentPage="ListBusinessPage"
                        desktopClassName={css.desktopTopbar}
                        mobileClassName={css.mobileTopbar}
                    />
                    <UserNav selectedPageName="ListBusinessPage" />
                </LayoutWrapperTopbar>
                <LayoutWrapperAccountSettingsSideNav groupTab="empty" currentTab="ListBusinessPage" />
                <LayoutWrapperMain>
                    <div className={css.content}>
                        <h1 className={css.title}>
                            <FormattedMessage id="ListBusinessPage.heading" />
                        </h1>                        
                    </div>
                    <div className={classNames(css.sectionContainer, css.lastSection)}>
                        <h3 className={css.sectionTitle}>
                            <FormattedMessage id="ListBusinessPage.secondHeading" />
                        </h3>
                        <div className={css.infoLinks}>
                            <ul className={css.list}>
                                <li className={css.listItem}>
                                    <NamedLink name="ListBusinessPage" className={css.links}>
                                        <FormattedMessage id="ListBusinessPage.ApplyNow" />
                                    </NamedLink>
                                </li>
                                <li className={css.listItem}>
                                    <NamedLink name="ListBusinessPage" className={css.links}>
                                        <FormattedMessage id="ListBusinessPage.GoodSpootForBusiness" />
                                    </NamedLink>                                    
                                </li>
                                <li className={css.listItem}>
                                    <NamedLink name="ListBusinessPage" className={css.links}>
                                        <FormattedMessage id="ListBusinessPage.ContactUs" />
                                    </NamedLink>
                                </li>
                            </ul>
                        </div>                        
                    </div>
                </LayoutWrapperMain>
                <LayoutWrapperFooter>
                    <Footer />
                </LayoutWrapperFooter>
            </LayoutSideNavigation>
        </Page>
      );
    }
}

ListBusinessPageComponent.defaultProps = {    
    currentUser: null,
};

const bool = PropTypes;

ListBusinessPageComponent.propTypes = {
    currentUser: propTypes.currentUser,
    scrollingDisabled: bool.isRequired,
    // from injectIntl
    intl: intlShape.isRequired,
};

const mapStateToProps = state => { 
    const {
        currentUser,        
      } = state.user;
    return {      
        currentUser,
        scrollingDisabled: isScrollingDisabled(state),      
    };
  };

const ListBusinessPage = compose(    
    connect(mapStateToProps),
    injectIntl
)(ListBusinessPageComponent);

ListBusinessPage.loadData = () => {
    return fetchCurrentUser();
};  

export default ListBusinessPage;