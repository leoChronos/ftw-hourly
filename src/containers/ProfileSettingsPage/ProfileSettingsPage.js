import React, { Component } from 'react';
import { bool, func, object, shape, string } from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';
import { propTypes } from '../../util/types';
import { ensureCurrentUser } from '../../util/data';
import { isScrollingDisabled } from '../../ducks/UI.duck';
import {
  Page,
  UserNav,
  LayoutSideNavigation,
  LayoutWrapperAccountSettingsSideNav,
  LayoutWrapperTopbar,
  LayoutWrapperMain,
  LayoutWrapperFooter,
  Footer,  
} from '../../components';
import { ProfileSettingsForm } from '../../forms';
import { TopbarContainer } from '../../containers';

import { updateProfile, uploadImage } from './ProfileSettingsPage.duck';
import css from './ProfileSettingsPage.css';

const onImageUploadHandler = (values, fn) => {
  const { id, imageId, file } = values;
  if (file) {
    fn({ id, imageId, file });
  }
};

export class ProfileSettingsPageComponent extends Component {
  render() {
    const {
      currentUser,     
      isBusiness, 
      image,
      onImageUpload,
      onUpdateProfile,
      scrollingDisabled,
      updateInProgress,
      updateProfileError,
      uploadImageError,
      uploadInProgress,
      intl,
    } = this.props;

    const handleSubmit = values => {
      const { firstName, lastName, bio: rawBio, facebook, instagram } = values;      

      // Ensure that the optional bio is a string
      const bio = rawBio || '';

      const profile = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        bio,     
        publicData: { facebook, instagram }
      };
      const uploadedImage = this.props.image;

      // Update profileImage only if file system has been accessed
      const updatedValues =
        uploadedImage && uploadedImage.imageId && uploadedImage.file
          ? { ...profile, profileImageId: uploadedImage.imageId }
          : profile;

      onUpdateProfile(updatedValues);
    };

    const user = ensureCurrentUser(currentUser);
    const { firstName, lastName, bio } = user.attributes.profile;
    const publicData = user.attributes.profile.publicData || {};
    const currentFacebook = publicData.facebook || '';
    const currentInstagram = publicData.instagram || '';
    const profileImageId = user.profileImage ? user.profileImage.id : null;
    const profileImage = image || { imageId: profileImageId };

    const profileSettingsForm = user.id ? (
      <ProfileSettingsForm
        className={css.form}
        currentUser={currentUser}
        initialValues={{ firstName, lastName, bio, profileImage: user.profileImage, facebook: currentFacebook, instagram: currentInstagram }}
        profileImage={profileImage}
        onImageUpload={e => onImageUploadHandler(e, onImageUpload)}
        uploadInProgress={uploadInProgress}
        updateInProgress={updateInProgress}
        uploadImageError={uploadImageError}
        updateProfileError={updateProfileError}
        onSubmit={handleSubmit}
      />
    ) : null;

    const title = intl.formatMessage({ id: 'ProfileSettingsPage.title' });

    return (
      <Page title={title} scrollingDisabled={scrollingDisabled}>
        <LayoutSideNavigation>
          <LayoutWrapperTopbar>
            <TopbarContainer
              currentPage="ProfileSettingsPage"
              desktopClassName={css.desktopTopbar}
              mobileClassName={css.mobileTopbar}
            />
            <UserNav selectedPageName="ProfileSettingsPage" isBusiness={isBusiness} />
          </LayoutWrapperTopbar>
          <LayoutWrapperAccountSettingsSideNav currentTab="ProfileSettingsPage" />
          <LayoutWrapperMain>
            <div className={css.content}>
              <h1 className={css.title}>
                <FormattedMessage id="ProfileSettingsPage.heading" />
              </h1>
              {profileSettingsForm}
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

ProfileSettingsPageComponent.defaultProps = {
  currentUser: null,  
  isBusiness: false,
  uploadImageError: null,
  updateProfileError: null,
  image: null,
};

ProfileSettingsPageComponent.propTypes = {
  currentUser: propTypes.currentUser,  
  isBusiness: bool.isRequired,
  image: shape({
    id: string,
    imageId: propTypes.uuid,
    file: object,
    uploadedImage: propTypes.image,
  }),
  onImageUpload: func.isRequired,
  onUpdateProfile: func.isRequired,
  scrollingDisabled: bool.isRequired,
  updateInProgress: bool.isRequired,
  updateProfileError: propTypes.error,
  uploadImageError: propTypes.error,
  uploadInProgress: bool.isRequired,

  // from injectIntl
  intl: intlShape.isRequired,
};

const mapStateToProps = state => {
  const { currentUser, isBusiness } = state.user;
  const {
    image,
    uploadImageError,
    uploadInProgress,
    updateInProgress,
    updateProfileError,
  } = state.ProfileSettingsPage;
  return {
    currentUser,    
    isBusiness,
    image,
    scrollingDisabled: isScrollingDisabled(state),
    updateInProgress,
    updateProfileError,
    uploadImageError,
    uploadInProgress,
  };
};

const mapDispatchToProps = dispatch => ({
  onImageUpload: data => dispatch(uploadImage(data)),
  onUpdateProfile: data => dispatch(updateProfile(data)),
});

const ProfileSettingsPage = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  injectIntl
)(ProfileSettingsPageComponent);

export default ProfileSettingsPage;
