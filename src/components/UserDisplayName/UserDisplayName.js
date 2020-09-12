import React from 'react';
import classNames from 'classnames';
import { oneOfType, string } from 'prop-types';
import { propTypes } from '../../util/types';

const UserDisplayName = props => {
  const {
    rootClassName,
    className,
    user,
    intl,
    deletedUserDisplayName,
    bannedUserDisplayName,
    listingTitle,
  } = props;
  const hasAttributes = user && user.attributes;
  const userIsDeleted = hasAttributes && user.attributes.deleted;
  const userIsBanned = hasAttributes && user.attributes.banned;
  const userHasProfile = hasAttributes && user.attributes.profile;
  const userDisplayName = userHasProfile && user.attributes.profile.displayName;

  const deletedUserDisplayNameInUse = deletedUserDisplayName
    ? deletedUserDisplayName
    : intl.formatMessage({
        id: 'UserDisplayName.deleted',
      });

  const bannedUserDisplayNameInUse = bannedUserDisplayName
    ? bannedUserDisplayName
    : intl.formatMessage({
        id: 'UserDisplayName.banned',
      });

  const displayName = userDisplayName
    ? userDisplayName
    : userIsDeleted
    ? deletedUserDisplayNameInUse
    : userIsBanned
    ? bannedUserDisplayNameInUse
    : null;

  const classes = classNames(rootClassName, className);
  return <span className={classes}>{listingTitle || displayName}</span>;
};

UserDisplayName.defaultProps = {
  rootClassName: null,
  className: null,

  user: null,
  deletedUserDisplayName: null,
  bannedUserDisplayName: null,
  listingTitle: null,
};

UserDisplayName.propTypes = {
  rootClassName: string,
  className: string,

  user: oneOfType([propTypes.user, propTypes.currentUser]),
  deletedUserDisplayName: string,
  bannedUserDisplayName: string,
  listingTitle: string,
};

export default UserDisplayName;
