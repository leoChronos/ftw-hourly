import React from 'react';
import { string, oneOfType, bool } from 'prop-types';
import { injectIntl, intlShape } from '../../util/reactIntl';
import classNames from 'classnames';
import { propTypes } from '../../util/types';
import {
  ensureUser,
  ensureCurrentUser,
  userDisplayNameAsString,
  userAbbreviatedName,
} from '../../util/data';
import { ResponsiveImage, IconBannedUser, NamedLink } from '../../components/';

import css from './AvatarBusiness.css';

// Responsive image sizes hint
const AVATAR_SIZES = '40px';
const AVATAR_SIZES_MEDIUM = '60px';
const AVATAR_SIZES_LARGE = '96px';

const AVATAR_IMAGE_VARIANTS = [
  // 240x240
  'square-small',

  // 480x480
  'square-small2x',
];

export const AvatarBusinessComponent = props => {
  const {
    rootClassName,
    className,
    initialsClassName,
    user,
    businessLogoImage,
    businessName,
    renderSizes,
    disableProfileLink,
    intl,
  } = props;
  const classes = classNames(rootClassName || css.root, className);  

  const userIsCurrentUser = user && user.type === 'currentUser';
  const avatarUser = userIsCurrentUser ? ensureCurrentUser(user) : ensureUser(user);

  const isBannedUser = avatarUser.attributes.banned;
  const isDeletedUser = avatarUser.attributes.deleted;

  const bannedUserDisplayName = intl.formatMessage({
    id: 'Avatar.bannedUserDisplayName',
  });

  const deletedUserDisplayName = intl.formatMessage({
    id: 'Avatar.deletedUserDisplayName',
  });

  const defaultUserDisplayName = isBannedUser
    ? bannedUserDisplayName
    : isDeletedUser
    ? deletedUserDisplayName
    : '';

  const defaultUserAbbreviatedName = '';
  
  const displayName = userDisplayNameAsString(avatarUser, defaultUserDisplayName);
  const abbreviatedName = userAbbreviatedName(avatarUser, defaultUserAbbreviatedName);
  const rootProps = { className: classes, title: businessName || displayName };
  const linkProps = avatarUser.id
    ? { name: 'ProfilePage', params: { id: avatarUser.id.uuid } }
    : { name: 'ProfileBasePage' };
  const hasProfileImage = avatarUser.profileImage && avatarUser.profileImage.id;
  const hasBusinessLogo = businessLogoImage && businessLogoImage.id;
  const profileLinkEnabled = !disableProfileLink;

  const classForInitials = initialsClassName || css.initials;

  if (isBannedUser || isDeletedUser) {
    return (
      <div {...rootProps}>
        <IconBannedUser className={css.bannedUserIcon} />
      </div>
    );
  }
  else if (hasBusinessLogo){
    return (
      <div {...rootProps}>
        <ResponsiveImage
          rootClassName={css.avatarImage}
          alt={businessName}
          image={businessLogoImage}
          variants={AVATAR_IMAGE_VARIANTS}
          sizes={renderSizes}
        />
      </div>
    );  
  } else if (hasProfileImage && profileLinkEnabled) {
    return (
      <NamedLink {...rootProps} {...linkProps}>
        <ResponsiveImage
          rootClassName={css.avatarImage}
          alt={displayName}
          image={avatarUser.profileImage}
          variants={AVATAR_IMAGE_VARIANTS}
          sizes={renderSizes}
        />
      </NamedLink>
    );
  } else if (hasProfileImage) {
    return (
      <div {...rootProps}>
        <ResponsiveImage
          rootClassName={css.avatarImage}
          alt={displayName}
          image={avatarUser.profileImage}
          variants={AVATAR_IMAGE_VARIANTS}
          sizes={renderSizes}
        />
      </div>
    );
  } else if (profileLinkEnabled) {
    // Placeholder avatar (initials)
    return (
      <NamedLink {...rootProps} {...linkProps}>
        <span className={classForInitials}>{abbreviatedName}</span>
      </NamedLink>
    );
  } else {
    // Placeholder avatar (initials)
    return (
      <div {...rootProps}>
        <span className={classForInitials}>{abbreviatedName}</span>
      </div>
    );
  }
};

AvatarBusinessComponent.defaultProps = {
  className: null,
  rootClassName: null,
  initialsClassName: null,
  user: null,
  businessLogoImage: null,
  businessName: null,
  renderSizes: AVATAR_SIZES,
  disableProfileLink: false,
};

AvatarBusinessComponent.propTypes = {
  rootClassName: string,
  className: string,
  initialsClassName: string,
  user: oneOfType([propTypes.user, propTypes.currentUser]),
  businessLogoImage: propTypes.image,
  businessName: string,
  renderSizes: string,
  disableProfileLink: bool,

  // from injectIntl
  intl: intlShape.isRequired,
};

const AvatarBusiness = injectIntl(AvatarBusinessComponent);

export default AvatarBusiness;

export const AvatarBusinessMedium = props => (
  <AvatarBusiness rootClassName={css.mediumAvatar} renderSizes={AVATAR_SIZES_MEDIUM} {...props} />
);
AvatarBusinessMedium.displayName = 'AvatarBusinessMedium';

export const AvatarBusinessLarge = props => (
  <AvatarBusiness rootClassName={css.largeAvatar} renderSizes={AVATAR_SIZES_LARGE} {...props} />
);
AvatarBusinessLarge.displayName = 'AvatarBusinessLarge';
