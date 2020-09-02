import React from 'react';
import { string } from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';
import classNames from 'classnames';
import { twitterPageURL } from '../../util/urlHelpers';
import config from '../../config';
import {
  IconSocialMediaFacebook,
  IconSocialMediaInstagram,
  IconSocialMediaTwitter,
  Logo,
  ExternalLink,
  NamedLink,
} from '../../components';

import css from './Footer.css';

import flagImage from './images/new-zealand-flag.png';

const renderSocialMediaLinks = (isMobile, intl) => {
  const { siteFacebookPage, siteInstagramPage, siteTwitterHandle } = config;
  const siteTwitterPage = twitterPageURL(siteTwitterHandle);

  const goToFb = intl.formatMessage({ id: 'Footer.goToFacebook' });  
  const goToInsta = intl.formatMessage({ id: 'Footer.goToInstagram' });
  const goToTwitter = intl.formatMessage({ id: 'Footer.goToTwitter' });

  const fb = intl.formatMessage({ id: 'Footer.facebook' });
  const insta = intl.formatMessage({ id: 'Footer.instagram' });
  const twitter = intl.formatMessage({ id: 'Footer.twitter' });

  const cssClass = isMobile ? css.icon : css.link;

  const fbLink = siteFacebookPage ? (
    <ExternalLink 
      key="linkToFacebook" 
      href={siteFacebookPage} 
      className={cssClass} 
      title={goToFb}>
      {isMobile ? <IconSocialMediaFacebook /> : fb}
    </ExternalLink>
  ) : null;

  const twitterLink = siteTwitterPage ? (
    <ExternalLink
      key="linkToTwitter"
      href={siteTwitterPage}
      className={cssClass}
      title={goToTwitter}
    >
      {isMobile ? <IconSocialMediaTwitter /> : insta}
    </ExternalLink>
  ) : null;

  const instragramLink = siteInstagramPage ? (
    <ExternalLink
      key="linkToInstagram"
      href={siteInstagramPage}
      className={cssClass}
      title={goToInsta}
    >
      {isMobile ? <IconSocialMediaInstagram /> : twitter}
    </ExternalLink>
  ) : null;
  return [fbLink, twitterLink, instragramLink].filter(v => v != null);
};

const Footer = props => {
  const { rootClassName, className, intl } = props;
  const socialMediaLinks = renderSocialMediaLinks(true, intl);
  const classes = classNames(rootClassName || css.root, className);

  return (
    <div className={classes}>
      <div className={css.topBorderWrapper}>
        <div className={css.content}>
          <div className={css.someLiksMobile}>{socialMediaLinks}</div>
          <div className={css.links}>            
            <div className={classNames(css.linkAreas, css.expoloreLinks)}>
              <ul className={css.list}>
                <li className={css.listItem}>
                  <NamedLink name="SearchPage" className={classNames(css.link, css.firstLink)}>
                    <FormattedMessage id="Footer.explore" />
                  </NamedLink>
                </li>
                {config.custom.categories.filter(x => !x.hideFromFilters).map((category, i) => {
                  return (
                    <li key={`footer_link_${category.key}`} className={css.listItem}>
                      <NamedLink name="SearchPage" className={css.link} to={{ search: `?pub_category=${category.key}` }}>
                        {category.label}
                      </NamedLink>
                    </li>
                  );               
                })}              
              </ul>
            </div>
            <div className={classNames(css.linkAreas, css.aboutLinks)}>
              <ul className={css.list}>
                <li className={css.listItem}>
                  <NamedLink name="AboutPage" className={classNames(css.link, css.firstLink)}>
                    <FormattedMessage id="Footer.toAboutPage" />
                  </NamedLink>
                </li>
                <li className={css.listItem}>
                  <NamedLink name="HowItWorksPage" className={css.link}>
                    <FormattedMessage id="Footer.howItWorks" />
                  </NamedLink>
                </li>
                <li className={css.listItem}>
                  <NamedLink name="AboutPage" className={css.link}>
                    <FormattedMessage id="Footer.spotDeposits" />
                  </NamedLink>
                </li>
                <li className={css.listItem}>
                  <NamedLink name="AboutPage" className={css.link}>
                    <FormattedMessage id="Footer.trustAndSafety" />
                  </NamedLink>
                </li>
                <li className={css.listItem}>
                  <NamedLink name="AboutPage" className={css.link}>
                    <FormattedMessage id="Footer.invite" />
                  </NamedLink>
                </li>
              </ul>
            </div>
            <div className={classNames(css.linkAreas, css.partnersLinks)}>
              <ul className={css.list}>
                <li className={css.listItem}>
                  <ExternalLink href={config.linkGoodSpotPartners} className={classNames(css.link, css.firstLink)}>
                    <FormattedMessage id="Footer.partners" />
                  </ExternalLink>
                </li>
                <li className={css.listItem}>
                  <ExternalLink href={`${config.linkGoodSpotPartners}#partner`} className={css.link}>
                    <FormattedMessage id="Footer.listYourBusiness" />
                  </ExternalLink>                  
                </li>
                <li className={css.listItem}>
                  <ExternalLink href={`${config.linkGoodSpotPartners}#overview`} className={css.link}>
                    <FormattedMessage id="Footer.moreInformation" />
                  </ExternalLink>
                </li>
                <li className={css.listItem}>
                  <ExternalLink href={`${config.linkGoodSpotPartners}#pricing`} className={css.link}>
                    <FormattedMessage id="Footer.feesAndPricing" />
                  </ExternalLink>
                </li>
                <li className={css.listItem}>
                  <NamedLink name="AboutPage" className={css.link}>
                    <FormattedMessage id="Footer.bookADemo" />
                  </NamedLink>
                </li>
              </ul>
            </div>
            <div className={classNames(css.linkAreas, css.companyLinks)}>
              <ul className={css.list}>
                <li className={css.listItem}>
                  <NamedLink name="AboutPage" className={classNames(css.link, css.firstLink)}>
                    <FormattedMessage id="Footer.company" />
                  </NamedLink>
                </li>
                <li className={css.listItem}>
                  <NamedLink name="AboutPage" className={css.link}>
                    <FormattedMessage id="Footer.ourStory" />
                  </NamedLink>
                </li>
                <li className={css.listItem}>
                  <NamedLink name="AboutPage" to={{ hash: '#contact' }} className={css.link}>
                    <FormattedMessage id="Footer.toContactPage" />
                  </NamedLink>
                </li>
                <li className={css.listItem}>
                  <NamedLink name="AboutPage" className={css.link}>
                    <FormattedMessage id="Footer.helpCenter" />
                  </NamedLink>
                </li>
                <li className={css.listItem}>
                  <NamedLink name="TermsOfServicePage" className={css.link}>
                    <FormattedMessage id="Footer.termsOfUse" />
                  </NamedLink>
                </li>
                <li className={css.listItem}>
                  <NamedLink name="PrivacyPolicyPage" className={css.link}>
                    <FormattedMessage id="Footer.privacyPolicy" />
                  </NamedLink>
                </li>
              </ul>
            </div>
            <div className={classNames(css.linkAreas, css.connectLinks)}>
              <ul className={css.list}>
                <li className={css.listItem}>
                  <NamedLink name="AboutPage" className={classNames(css.link, css.firstLink)}>
                    <FormattedMessage id="Footer.connect" />
                  </NamedLink>
                </li>
                {renderSocialMediaLinks(false, intl).map((link, i) => {
                  return (
                    <li key={`footer_social_link_${i}`} className={css.listItem}>
                      {link}
                    </li>        
                  );
                })}
                <li className={css.listItem}>
                  <NamedLink name="AboutPage" to={{ hash: '#contact' }} className={css.link}>
                    <FormattedMessage id="Footer.toContactPage" />
                  </NamedLink>
                </li>       
              </ul>
            </div>
          </div>
          <div className={css.organization} id="organization">
              <NamedLink name="LandingPage" className={css.logoLink}>
                <span className={css.logo}>
                  <Logo format="mobile" />
                </span>
              </NamedLink>
              <div className={css.organizationInfo}>                
                <p className={css.organizationCopyright}>
                  <NamedLink name="LandingPage" className={css.copyrightLink}>
                    <FormattedMessage id="Footer.copyright" />
                  </NamedLink>
                </p>
              </div>
              <div className={css.organizationInfo}>                
                <p className={css.organizationMade}>
                  {/* <NamedLink name="LandingPage" className={css.copyrightLink}>
                    <FormattedMessage id="Footer.copyright" />
                  </NamedLink> */}                  
                  <span>Made with Love in</span>
                  <img src={flagImage} className={css.flag}></img>
                </p>
              </div>
            </div>
          <div className={css.copyrightAndTermsMobile}>
            <NamedLink name="LandingPage" className={css.organizationCopyrightMobile}>
              <FormattedMessage id="Footer.copyright" />
            </NamedLink>
            <div className={css.tosAndPrivacyMobile}>
              <NamedLink name="PrivacyPolicyPage" className={css.privacy}>
                <FormattedMessage id="Footer.privacy" />
              </NamedLink>
              <NamedLink name="TermsOfServicePage" className={css.terms}>
                <FormattedMessage id="Footer.terms" />
              </NamedLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Footer.defaultProps = {
  rootClassName: null,
  className: null,
};

Footer.propTypes = {
  rootClassName: string,
  className: string,
  intl: intlShape.isRequired,
};

export default injectIntl(Footer);
