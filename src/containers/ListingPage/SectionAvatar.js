import React from 'react';
import { AvatarLarge, AvatarMedium, AvatarBusinessLarge, AvatarBusinessMedium } from '../../components';

import css from './ListingPage.css';

const SectionAvatar = props => {
  const { user, businessLogoImage, businessName } = props;  

  if(businessLogoImage)
  {
    return (
      <div className={css.sectionAvatar}>
        <AvatarBusinessLarge
          user={user}
          businessLogoImage={businessLogoImage}
          businessName={businessName}
          className={css.avatarDesktop}
          initialsClassName={css.initialsDesktop}
          disableProfileLink
        />
  
        <AvatarBusinessMedium user={user} businessLogoImage={businessLogoImage} businessName={businessName} className={css.avatarMobile} disableProfileLink />
      </div>
    );
  }

  return (
    <div className={css.sectionAvatar}>
      <AvatarLarge
        user={user}
        className={css.avatarDesktop}
        initialsClassName={css.initialsDesktop}
        disableProfileLink
      />

      <AvatarMedium user={user} className={css.avatarMobile} disableProfileLink />
    </div>
  );
};

export default SectionAvatar;
