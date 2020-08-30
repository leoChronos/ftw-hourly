import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';
import { propTypes } from '../../util/types';
import { parse } from '../../util/urlHelpers';
import { isScrollingDisabled } from '../../ducks/UI.duck';
import {  
  Page,  
  UserNav,    
  LayoutWrapperTopbar,
  LayoutWrapperMain,
  LayoutWrapperFooter,
  LayoutWrapperAccountSettingsSideNav,
  LayoutSideNavigation,
  Footer,  
  NamedRedirect,
  FieldSelect
} from '../../components';
import { TopbarContainer } from '../../containers';

import { Calendar, Views, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'


import {
  queryOwnListings,
} from './ManageYourSpotsPage.duck';
import css from './ManageYourSpotsPage.css';

const localizer = momentLocalizer(moment)

export class ManageYourSpotsPageComponent extends Component {
  constructor(props) {
    super(props);

    this.state = { listingMenuOpen: null };
    this.onToggleMenu = this.onToggleMenu.bind(this);
  }

  onToggleMenu(listing) {
    this.setState({ listingMenuOpen: listing });
  }

  render() {
    const {      
      listings,
      onCloseListing,
      pagination,
      queryInProgress,
      queryListingsError,
      queryParams,
      scrollingDisabled,
      intl,
      isBusiness,
    } = this.props;

    if (!isBusiness) {
       return <NamedRedirect name="ListBusinessPage"/>;
    }

    const hasPaginationInfo = !!pagination && pagination.totalItems != null;
    const listingsAreLoaded = !queryInProgress && hasPaginationInfo;

    const title = intl.formatMessage({ id: 'ManageListingsPage.title' });

    const ColoredDateCellWrapper = ({ children }) =>
        React.cloneElement(React.Children.only(children), {
            style: {
                backgroundColor: 'lightblue',
        },
    })

    return (
      <Page title={title} scrollingDisabled={scrollingDisabled}>
        <LayoutSideNavigation>
          <LayoutWrapperTopbar>
            <TopbarContainer 
              currentPage="ManageListingsPage" 
              desktopClassName={css.desktopTopbar}
              mobileClassName={css.mobileTopbar} 
            />
            <UserNav selectedPageName="ManageListingsPage" isBusiness={isBusiness}/>
          </LayoutWrapperTopbar>
          <LayoutWrapperAccountSettingsSideNav groupTab="listing" currentTab="ManageYourSpotsPage" />
          <LayoutWrapperMain>
            <div className={css.content}>
                <h1 className={css.title}>Your Spots</h1>
                <h2 className={css.title}>Do you want to add, edit, or delete a spot? Go to Your Listings</h2>

                {/* <FieldSelect             
                  id="category"            
                  name="category" 
                  className={css.selectField} 
                  label="">
                  <option value="">Select a listing</option>
                  {listings.map(l => (
                    <option key={l.id} value={l.id}>
                      {l.attributes.title}
                    </option>
                  ))}
                </FieldSelect> */}

                <div style={{height: '50vh', margin: '10px'}}>                    
                    <Calendar
                        events={[]}
                        views={{month: true}}
                        step={60}
                        showMultiDayTimes
                        // max={}
                        defaultDate={new Date()}
                        components={{
                            timeSlotWrapper: ColoredDateCellWrapper,
                        }}
                        localizer={localizer}
                        onNavigate={(newDate, view, action)=>{console.log(newDate, view, action);}}
                    />
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

ManageYourSpotsPageComponent.defaultProps = {
  listings: [],
  pagination: null,
  queryListingsError: null,
  queryParams: null,
  currentUser: null,
  isBusiness: false,
};

const { arrayOf, bool, func, object, shape, string } = PropTypes;

ManageYourSpotsPageComponent.propTypes = {
  listings: arrayOf(propTypes.ownListing),
  pagination: propTypes.pagination,
  queryInProgress: bool.isRequired,
  queryListingsError: propTypes.error,
  queryParams: object,
  scrollingDisabled: bool.isRequired,

  // from injectIntl
  intl: intlShape.isRequired,
  isBusiness: bool.isRequired,
};

const mapStateToProps = state => {
  const { isBusiness } = state.user;    
  const {
    pagination,
    queryInProgress,
    queryListingsError,
    queryParams,
    listings,
  } = state.ManageYourSpotsPage; 
  return {    
    isBusiness,    
    pagination,
    queryInProgress,
    queryListingsError,
    queryParams,
    listings,
    scrollingDisabled: isScrollingDisabled(state)    
  };
};

const mapDispatchToProps = dispatch => ({

});

const ManageYourSpotsPage = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  injectIntl
)(ManageYourSpotsPageComponent);

ManageYourSpotsPage.loadData = (params, search) => {  
  const queryParams = parse(search);
  const page = queryParams.page || 1;
  return queryOwnListings({
    ...queryParams,
    page,
    perPage: 100
  });
};

export default ManageYourSpotsPage;
