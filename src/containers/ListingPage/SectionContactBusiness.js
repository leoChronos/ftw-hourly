import React from 'react';
import { ExternalLink, IconSocialMediaFacebook, IconSocialMediaInstagram, IconSocialWebsite, IconSocialMediaTwitter } from '../../components';
import { instagramPageURL, twitterPageURL } from '../../util/urlHelpers';

import css from './ListingPage.css';

const SectionContactBusiness = props => {
  const { social } = props;
  const facebookLink = social.facebook || null;
  const instagramHandle = social.instagram || null;
  const twitterHandle = social.twitter || null;
  const websiteLink = social.website || null;


  return (
    <div className={css.sectionManagedBy}>
      <h2 className={css.managedByHeading}>
        Connect
      </h2>
      <div className={css.managedByContact}>
        { websiteLink ? 
            <ExternalLink
                key="linkToWebsite"
                href={websiteLink}
                className={css.socialIcon}
                title="Website"
            >
                <IconSocialWebsite />
                <span className={css.socialWebsite}>Website</span>
            </ExternalLink>
            : null
        }
        { facebookLink ? 
            <ExternalLink
              key="linkToFacebook"
              href={facebookLink}
              className={css.socialIcon}
              title="Facebook"
            >
              <IconSocialMediaFacebook />
              <span className={css.socialFacebook}>Facebook</span>
            </ExternalLink>
          : null
        }
        { instagramHandle ?
            <ExternalLink
              key="linkToInstagram"
              href={instagramPageURL(instagramHandle)}
              className={css.socialIcon}
              title="Instagram"
            >
              <IconSocialMediaInstagram />
              <span className={css.socialInstagram}>Instagram</span>
            </ExternalLink>
          : null          
        }
        { twitterHandle ? 
            <ExternalLink
                key="linkToTwitter"
                href={twitterPageURL(twitterHandle)}
                className={css.socialIcon}
                title="Twitter"
            >
                <IconSocialMediaTwitter />
                <span className={css.socialTwitter}>Twitter</span>
            </ExternalLink>
            : null
        }
      </div>
    </div>
  );
};

export default SectionContactBusiness;
