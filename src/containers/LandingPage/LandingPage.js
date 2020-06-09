import React from 'react';
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
  SectionHero,
  SectionHowItWorks,
  SectionCategories,
  LayoutSingleColumn,
  LayoutWrapperTopbar,
  LayoutWrapperMain,
  LayoutWrapperFooter,
  Footer,
  NamedLink,
  ExternalLink,
} from '../../components';
import { TopbarContainer } from '../../containers';

import facebookImage from '../../assets/yogatimeFacebook-1200x630.jpg';
import twitterImage from '../../assets/yogatimeTwitter-600x314.jpg';
import css from './LandingPage.css';

export const LandingPageComponent = props => {
  const {
    history,
    intl,
    location,
    scrollingDisabled,
    currentUserListing,
    currentUserListingFetched,
  } = props;

  // Schema for search engines (helps them to understand what this page is about)
  // http://schema.org
  // We are using JSON-LD format
  const siteTitle = config.siteTitle;
  const schemaTitle = intl.formatMessage({ id: 'LandingPage.schemaTitle' }, { siteTitle });
  const schemaDescription = intl.formatMessage({ id: 'LandingPage.schemaDescription' });
  const schemaImage = `${config.canonicalRootURL}${facebookImage}`;

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
              <div className={css.sectionContentFirstChild}>                
                <SectionCategories />
              </div>
            </li>
            <li className={css.section}>
              <div className={css.sectionContent}>
                  <h1 className={css.supportTittle}>Support your local businesses and get rewarded in return.</h1>
                  <h2 className={css.supportSubTittle}>Everyday hundreds of businesses upload discounted off-peak spots for you to book</h2>
                  <NamedLink name="SearchPage" className={css.supportLink}>
                    <span>Find Spots</span>
                  </NamedLink>
              </div>
            </li>
            <li className={css.section}>
              <div className={css.sectionContent}>
                <div className={css.howItWorksArea}>
                  <NamedLink name="SearchPage" className={css.howItWorksLink}>
                    <span>How GoodSpot Works</span>
                  </NamedLink>
                </div>                
              </div>
            </li>
            <li className={css.section}>
              <div className={css.sectionContent}>
                <div className={css.goodSpotForBusiness}>
                  <div className={css.businessBoard}>
                  </div>
                  <div className={css.businessContent}> 
                    <h1>GoodSpot for business</h1>
                    <h3 className={css.businessSubTitle}>We partner with businesses just like yours to help turn your empty off-peak spots into on-peak spots.</h3>
                    <ExternalLink href={config.linkGoodSpotPartners} className={css.businessLink}>
                      <span>GoodSpot For Business</span>
                    </ExternalLink>
                  </div>
                </div>                
              </div>
            </li>
          </ul>
          <div className={css.ourStoryContainer}>
            <h2 className={css.ourStoryTitle}>A real pain in the covid turned into a really good way to help Kiwis.</h2>
            <ExternalLink href={config.linkGoodSpotPartners} className={css.ourStoryLink}>
              <span>Our Story</span>
            </ExternalLink>
          </div>
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
