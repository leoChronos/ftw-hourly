import React from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import { ExternalLink, IconSocialMediaFacebook, IconSocialMediaInstagram, AvatarMedium } from '../../components';
import { twitterPageURL, instagramPageURL } from '../../util/urlHelpers';

import css from './ListingPage.css';

const SectionManagedBy = props => {
  const { user } = props;
  const facebookLink = user.attributes.profile.publicData ? user.attributes.profile.publicData.facebook : null;
  const instagramHandle = user.attributes.profile.publicData ? user.attributes.profile.publicData.instagram : null;  


  return (
    <div className={css.sectionManagedBy}>
      <h2 className={css.managedByHeading}>
        <FormattedMessage id="ListingPage.managedByHeading" />
      </h2>
      <div className={css.areaAvatarManagedBy}>
        <AvatarMedium user={user} className={css.avatarManagedBy} disableProfileLink />
      </div>
      <div className={css.managedByContact}>
        <h2>{user.attributes.profile.displayName}</h2>
        <h3>Contact</h3>
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
      </div>
    </div>
  );
};

export default SectionManagedBy;
