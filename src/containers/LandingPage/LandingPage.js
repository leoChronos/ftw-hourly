import React from 'react';
import classNames from 'classnames';
import { bool, object } from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { injectIntl, intlShape, FormattedMessage } from '../../util/reactIntl';
import { isScrollingDisabled } from '../../ducks/UI.duck';
import { propTypes } from '../../util/types';
import config from '../../config';
import {
  Page,
  SectionOurStory,  
  SectionCategories,  
  LayoutSingleColumn,
  LayoutWrapperTopbar,
  LayoutWrapperMain,
  LayoutWrapperFooter,
  Footer,
  NamedLink,
} from '../../components';
import { TopbarContainer } from '../../containers';

import facebookImage from '../../assets/yogatimeFacebook-1200x630.jpg';
import twitterImage from '../../assets/yogatimeTwitter-600x314.jpg';
import css from './LandingPage.css';

export const LandingPageComponent = props => {
  const {    
    intl,    
    scrollingDisabled,    
  } = props;

  // Schema for search engines (helps them to understand what this page is about)
  // http://schema.org
  // We are using JSON-LD format
  const siteTitle = config.siteTitle;
  const schemaTitle = intl.formatMessage({ id: 'LandingPage.schemaTitle' }, { siteTitle });
  const schemaDescription = intl.formatMessage({ id: 'LandingPage.schemaDescription' });
  const schemaImage = `${config.canonicalRootURL}${facebookImage}`;

  const searchPageLink = (
    <NamedLink
      className={css.findSpotsLink}
      name="SearchPage"
      to={{ search: 'sort=meta_isRecommended' }}
    >
      <span>Explore Spots</span>
    </NamedLink>
  );

  return (
    <Page
      className={css.root}
      scrollingDisabled={scrollingDisabled}
      contentType="website"
      description={schemaDescription}
      title={schemaTitle}
      facebookImages={[{ url: facebookImage, width: 1200, height: 630 }]}
      twitterImages={[
        { url: `${config.canonicalRootURL}${twitterImage}`, width: 600, height: 314 },
      ]}
      schema={{
        '@context': 'http://schema.org',
        '@type': 'WebPage',
        description: schemaDescription,
        name: schemaTitle,
        image: [schemaImage],
      }}
    >
      <LayoutSingleColumn>
        <LayoutWrapperTopbar>
          <TopbarContainer />
        </LayoutWrapperTopbar>
        <LayoutWrapperMain>          
          <ul className={css.sections}>
            <li className={css.section}>
              <div className={css.sectionContent}>                
                <div className={css.findSpotArea}>
                  <div>
                    <div className={css.findSpotsTitle}><FormattedMessage id="LandingPage.getDiscountTitle"/></div>
                    <div>{searchPageLink}</div>                    
                  </div>
                  <div className={css.findSpotImg}>
                  </div>
                </div>
              </div>
            </li>
            <li className={css.section}>
              <div className={css.sectionContent}>                
                <SectionCategories />
              </div>
            </li>
            <li className={css.section}>
              <div className={css.sectionContent}>       
                <div className={css.howItWorksHeader}>
                  <h1 className={css.howItWorksTittle}>How you can support local businesses and get rewarded in return.</h1>
                  <h2 className={css.howItWorksSubTittle}>Everyday hundreds of businesses upload discounted off-peak spots for you to book and enjoy.</h2>
                </div>
                <div className={css.howItWorksSteps}>                  
                  <div className={classNames(css.howItWorksFind, css.howItWorksDetails)}>
                    <div></div>
                    <div>
                      <h1>Find discounted off-peak spots</h1>
                      <h2>Our partners offer discounted off-peak spots up to 90% off for you to book.</h2>
                    </div>      
                  </div>
                  <div className={classNames(css.howItWorksClaim, css.howItWorksDetails)}>
                    <div></div>
                    <div>
                      <h1>Quickly claim to secure your spot</h1>
                      <h2>Search from thousands of offers then quickly secure your spot with a small deposit.</h2>
                    </div>      
                  </div>
                  <div className={classNames(css.howItWorksReceive, css.howItWorksDetails)}>
                    <div></div>
                    <div>
                      <h1>Receive a discounted booking ref</h1>
                      <h2>And that's it! The discounted is all yours. We'll send you an email with your booking ref.</h2>
                    </div>      
                  </div>                  
                </div>
              </div>
            </li>           
          </ul>
          <SectionOurStory />
        </LayoutWrapperMain>
        <LayoutWrapperFooter>
          <Footer />
        </LayoutWrapperFooter>
      </LayoutSingleColumn>
    </Page>
  );
};

LandingPageComponent.defaultProps = {
  currentUserListing: null,
  currentUserListingFetched: false,
};

LandingPageComponent.propTypes = {
  scrollingDisabled: bool.isRequired,
  currentUserListing: propTypes.ownListing,
  currentUserListingFetched: bool,

  // from withRouter
  history: object.isRequired,
  location: object.isRequired,

  // from injectIntl
  intl: intlShape.isRequired,
};

const mapStateToProps = state => {
  const { currentUserListing, currentUserListingFetched } = state.user;

  return {
    scrollingDisabled: isScrollingDisabled(state),
    currentUserListing,
    currentUserListingFetched,
  };
};

// Note: it is important that the withRouter HOC is **outside** the
// connect HOC, otherwise React Router won't rerender any Route
// components since connect implements a shouldComponentUpdate
// lifecycle hook.
//
// See: https://github.com/ReactTraining/react-router/issues/4671
const LandingPage = compose(
  withRouter,
  connect(mapStateToProps),
  injectIntl
)(LandingPageComponent);

export default LandingPage;
