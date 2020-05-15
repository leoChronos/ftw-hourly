import React from 'react';
import { arrayOf, bool, func, shape, string } from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm } from 'react-final-form';
import { intlShape, injectIntl, FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import { propTypes } from '../../util/types';
import { maxLength, required, composeValidators } from '../../util/validators';
import { Form, Button, FieldTextInput, FieldSelect, NamedLink } from '../../components';

import css from './EditListingDescriptionForm.css';

const TITLE_MAX_LENGTH = 60;

const EditListingDescriptionFormComponent = props => (
  <FinalForm
    {...props}
    render={formRenderProps => {
      const {
        businessCategory,
        className,
        disabled,
        ready,
        handleSubmit,
        intl,
        invalid,
        pristine,
        saveActionMsg,
        updated,
        updateInProgress,        
        fetchErrors,
      } = formRenderProps;

      const titleMessage = intl.formatMessage({ id: 'EditListingDescriptionForm.title' });
      const titlePlaceholderMessage = intl.formatMessage({
        id: 'EditListingDescriptionForm.titlePlaceholder',
      });
      const titleRequiredMessage = intl.formatMessage({
        id: 'EditListingDescriptionForm.titleRequired',
      });
      const maxLengthMessage = intl.formatMessage(
        { id: 'EditListingDescriptionForm.maxLength' },
        {
          maxLength: TITLE_MAX_LENGTH,
        }
      );

      const maxLength60Message = maxLength(maxLengthMessage, TITLE_MAX_LENGTH);  
      
      const businessCategoryLabel = intl.formatMessage({
        id: 'EditListingDescriptionForm.businessCategoryLabel',
      });

      const aboutLabel = intl.formatMessage({
        id: 'EditListingDescriptionForm.aboutLabel',
      });
      const aboutPlaceholder = intl.formatMessage({
        id: 'EditListingDescriptionForm.aboutPlaceholder',
      });  

      const aboutRequiredMessage = intl.formatMessage({
        id: 'EditListingDescriptionForm.aboutRequiredMessage',
      });      
      
      const keyInformationLabel = intl.formatMessage({
        id: 'EditListingDescriptionForm.keyInformationLabel',
      });
      const keyInformationPlaceholder = intl.formatMessage({
        id: 'EditListingDescriptionForm.keyInformationPlaceholder',
      });

      const keyInformationRequiredMessage = intl.formatMessage({
        id: 'EditListingDescriptionForm.keyInformationRequiredMessage',
      });      

      const webSiteLabel = intl.formatMessage({
        id: 'EditListingDescriptionForm.webSiteLabel',
      });
      const webSitePlaceholder = intl.formatMessage({
        id: 'EditListingDescriptionForm.webSitePlaceholder',
      });

      const facebookLabel = intl.formatMessage({
        id: 'EditListingDescriptionForm.facebookLabel',
      });
      const facebookPlaceholder = intl.formatMessage({
        id: 'EditListingDescriptionForm.facebookPlaceholder',
      });

      const instagramLabel = intl.formatMessage({
        id: 'EditListingDescriptionForm.instagramLabel',
      });
      const instagramPlaceholder = intl.formatMessage({
        id: 'EditListingDescriptionForm.instagramPlaceholder',
      });

      const twitterLabel = intl.formatMessage({
        id: 'EditListingDescriptionForm.twitterLabel',
      });
      const twitterPlaceholder = intl.formatMessage({
        id: 'EditListingDescriptionForm.twitterPlaceholder',
      });

      const { updateListingError, createListingDraftError, showListingsError } = fetchErrors || {};
      const errorMessageUpdateListing = updateListingError ? (
        <p className={css.error}>
          <FormattedMessage id="EditListingDescriptionForm.updateFailed" />
        </p>
      ) : null;

      // This error happens only on first tab (of EditListingWizard)
      const errorMessageCreateListingDraft = createListingDraftError ? (
        <p className={css.error}>
          <FormattedMessage id="EditListingDescriptionForm.createListingDraftError" />
        </p>
      ) : null;

      const errorMessageShowListing = showListingsError ? (
        <p className={css.error}>
          <FormattedMessage id="EditListingDescriptionForm.showListingFailed" />
        </p>
      ) : null;

      const classes = classNames(css.root, className);
      const submitReady = (updated && pristine) || ready;
      const submitInProgress = updateInProgress;
      const submitDisabled = invalid || disabled || submitInProgress;

      return (
        <Form className={classes} onSubmit={handleSubmit}>
          {errorMessageCreateListingDraft}
          {errorMessageUpdateListing}
          {errorMessageShowListing}
          <FieldTextInput
            id="title"
            name="title"
            className={css.title}
            type="text"
            label={titleMessage}
            placeholder={titlePlaceholderMessage}
            maxLength={TITLE_MAX_LENGTH}
            validate={composeValidators(required(titleRequiredMessage), maxLength60Message)}
            autoFocus
          />          

          <FieldSelect             
            id="businessCategory"            
            name="businessCategory" 
            className={css.selectField} 
            label={businessCategoryLabel}>
            {businessCategory.map(c => (
              <option key={c.key} value={c.key}>
                {c.label}
              </option>
            ))}
          </FieldSelect>

          <NamedLink name="ListBusinessPage" className={css.links}>
              What is this
              {/* <FormattedMessage id="ListBusinessPage.GoodSpootForBusiness" /> */}
          </NamedLink>  

          <FieldTextInput
            id="description"
            name="description"
            className={css.textArea}
            type="textarea"
            label={aboutLabel}
            placeholder={aboutPlaceholder}
            validate={composeValidators(required(aboutRequiredMessage))}
          />

          <FieldTextInput
            id="keyInformation"
            name="keyInformation"
            className={css.textField}
            type="text"
            label={keyInformationLabel}
            placeholder={keyInformationPlaceholder}
            validate={composeValidators(required(keyInformationRequiredMessage))}
          />

          <FieldTextInput
            id="social.website"
            name="social.website"
            className={css.textField}
            type="text"
            label={webSiteLabel}
            placeholder={webSitePlaceholder}
          />

          <FieldTextInput
            id="social.facebook"
            name="social.facebook"
            className={css.textField}
            type="text"
            label={facebookLabel}
            placeholder={facebookPlaceholder}            
          />

          <FieldTextInput
            id="social.instagram"
            name="social.instagram"
            className={css.textField}
            type="text"
            label={instagramLabel}
            placeholder={instagramPlaceholder}            
          />

          <FieldTextInput
            id="social.twitter"
            name="social.twitter"
            className={css.textField}
            type="text"
            label={twitterLabel}
            placeholder={twitterPlaceholder}            
          />

          <Button
            className={css.submitButton}
            type="submit"
            inProgress={submitInProgress}
            disabled={submitDisabled}
            ready={submitReady}
          >
            {saveActionMsg}
          </Button>
        </Form>
      );
    }}
  />
);

EditListingDescriptionFormComponent.defaultProps = { 
  className: null, 
  fetchErrors: null,  
};

EditListingDescriptionFormComponent.propTypes = {
  className: string,
  intl: intlShape.isRequired,
  onSubmit: func.isRequired,
  saveActionMsg: string.isRequired,
  disabled: bool.isRequired,
  ready: bool.isRequired,
  updated: bool.isRequired,  
  updateInProgress: bool.isRequired,  
  fetchErrors: shape({
    createListingDraftError: propTypes.error,
    showListingsError: propTypes.error,
    updateListingError: propTypes.error,
  }),
  businessCategory: arrayOf(
    shape({
      key: string.isRequired,
      label: string.isRequired,
    })
  ),
};

export default compose(injectIntl)(EditListingDescriptionFormComponent);
