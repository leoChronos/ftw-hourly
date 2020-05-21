import React from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import { InlineTextButton } from '../../components';

import css from './ListingPage.css';

const getBusinessCategory = (businessCategoryConfig, key) => {
  return businessCategoryConfig.find(c => c.key === key);
}

const SectionHeading = props => {
  const {
    richTitle,
    listingBusinessCategory,
    businessCategoryConfig,
    address,    
  } = props;

  const businessCategory = getBusinessCategory(businessCategoryConfig, listingBusinessCategory);  
  const showBusinessCategory = businessCategory && !businessCategory.hideFromListingInfo;
  return (
    <div className={css.sectionHeading}>
      <div className={css.heading}>
        <h1 className={css.title}>{richTitle}</h1>
        <h3 className={css.titleAddress}>{address}</h3>
        <div className={css.tags}>
          {showBusinessCategory ? <span className={css.businessCategoryTag}>{businessCategory.label}</span> : null}          
          <span className={css.recommendedTag}>Recommended</span>
          <span className={css.newListingTag}>New</span>
        </div>
      </div>
    </div>
  );
};

export default SectionHeading;
