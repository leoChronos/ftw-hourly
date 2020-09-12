import React from 'react';
import { ReviewRating, InlineTextButton, IconFavorite, IconSpinner, IconShare, IconMail } from '../../components';
import classNames from 'classnames';
import meanBy from 'lodash/meanBy';
import { nightsBetween } from './../../util/dates';

import css from './ListingPage.css';

const getcategory = (categoryConfig, key) => {
  return categoryConfig.find(c => c.key === key);
}

const SectionHeading = props => {
  const {
    createdAt,
    richTitle,
    listingCategory,
    categoryConfig,
    address,   
    reviews, 
    showContactUser,
    onContactUser,    
    onSubmitFavorite,
    isFavoriteListing,
    userFavoritesListingsInProgress,
    isRecommended
  } = props;
  
  const isNew = nightsBetween(createdAt, new Date()) < 7;  
  const category = getcategory(categoryConfig, listingCategory);  
  const showcategory = category && !category.hideFromListingInfo;  
  const rating = reviews ? reviews : [];
  const reviewCount = reviews ? reviews.length : 0;
  const ratingAvg = rating.length > 0 ? meanBy(rating, function(o) { return o.attributes.rating; }) : 0;    

  return (
    <div className={css.sectionHeading}>
      <div className={css.heading}>
        <h1 className={css.title}>{richTitle}</h1>
        <h3 className={css.titleAddress}>{address}</h3>
        <div className={css.tags}>
          {showcategory ? <span className={css.categoryTag}>{category.label}</span> : null}
          {isRecommended ? <span className={css.recommendedTag}>Recommended</span> : null}
          {isNew ? <span className={css.newListingTag}>New</span> : null}
        </div>
        <div className={css.overallRating}>                  
            <ReviewRating
              reviewStarClassName={css.reviewStar}
              className={css.reviewStars}
              rating={ratingAvg}
            />
            <span className={css.ratingReviewCount}>Reviews ({reviewCount})</span>
        </div>
        <div className={css.iconActionArea}>
          {showContactUser ? (
            <span className={css.contactWrapper}>
              {userFavoritesListingsInProgress ? (
                <IconSpinner />
              ):(
                <InlineTextButton rootClassName={classNames(css.contactLink, isFavoriteListing ? css.favorite : null)} onClick={(e) => {
                    e.preventDefault();
                    onSubmitFavorite();
                  }}
                >
                  <IconFavorite isFavorite={isFavoriteListing} />
                    {isFavoriteListing ? (<label>Remove from favorites</label>) : (<label>Add to favorites</label>)}                    
                  </InlineTextButton>
              )}              
              <InlineTextButton rootClassName={css.contactLink}>
                <IconShare />
                <label>Share the love</label>
              </InlineTextButton>
              <InlineTextButton rootClassName={css.contactLink} onClick={onContactUser}>
                <IconMail />
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
