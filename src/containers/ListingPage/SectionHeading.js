import React from 'react';
import { ReviewRating, InlineTextButton, IconEnquiry } from '../../components';
import { FormattedMessage } from '../../util/reactIntl';

import css from './ListingPage.css';

const getcategory = (categoryConfig, key) => {
  return categoryConfig.find(c => c.key === key);
}

const SectionHeading = props => {
  const {
    richTitle,
    listingCategory,
    categoryConfig,
    address,   
    reviews, 
    showContactUser,
    onContactUser,
  } = props;

  const category = getcategory(categoryConfig, listingCategory);  
  const showcategory = category && !category.hideFromListingInfo;  
  const rating = reviews ? reviews : [];
  const reviewCount = reviews ? reviews.length : 0;


  return (
    <div className={css.sectionHeading}>
      <div className={css.heading}>
        <h1 className={css.title}>{richTitle}</h1>
        <h3 className={css.titleAddress}>{address}</h3>
        <div className={css.tags}>
          {showcategory ? <span className={css.categoryTag}>{category.label}</span> : null}          
          <span className={css.recommendedTag}>Recommended</span>
          <span className={css.newListingTag}>New</span>
        </div>
        <div className={css.overallRating}>                  
            <ReviewRating
              reviewStarClassName={css.reviewStar}
              className={css.reviewStars}
              rating={rating}
            />
            <span className={css.ratingReviewCount}>Reviews ({reviewCount})</span>
        </div>
        <div className={css.iconActionArea}>
          {showContactUser ? (
            <span className={css.contactWrapper}>
              <InlineTextButton rootClassName={css.contactLink}>
                <IconEnquiry />
                <label>Add to favorites</label>
              </InlineTextButton>
              <InlineTextButton rootClassName={css.contactLink}>
                <IconEnquiry />
                <label>Get spot alerts</label>
              </InlineTextButton>
              <InlineTextButton rootClassName={css.contactLink} onClick={onContactUser}>
                <IconEnquiry />
                <label>Ask a question</label>
              </InlineTextButton>
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default SectionHeading;
