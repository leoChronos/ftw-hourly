import React, { useState } from 'react';
import { ReviewRating, InlineTextButton, IconFavorite, IconSpinner, IconShare, IconMail, SocialShare } from '../../components';
import Popover from '@material-ui/core/Popover';
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
    isRecommended,    
  } = props;
  
  const isNew = nightsBetween(createdAt, new Date()) < 7;  
  const category = getcategory(categoryConfig, listingCategory);  
  const showcategory = category && !category.hideFromListingInfo;  
  const rating = reviews ? reviews : [];
  const reviewCount = reviews ? reviews.length : 0;
  const ratingAvg = rating.length > 0 ? meanBy(rating, function(o) { return o.attributes.rating; }) : 0;
  const urlShare = document.location.href;    

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

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
                  <IconFavorite isFavorite={isFavoriteListing} rootClassName={css.mobileIcon} />
                    {isFavoriteListing ? (<label>Remove from favorites</label>) : (<label>Add to favorites</label>)}                    
                  </InlineTextButton>
              )}              
              <InlineTextButton rootClassName={css.contactLink} onClick={handleClick}>
                <IconShare rootClassName={css.mobileIcon}/>
                <label>Share the love</label>
              </InlineTextButton>
              <InlineTextButton rootClassName={css.contactLink} onClick={onContactUser}>
                <IconMail rootClassName={css.mobileIcon}/>
                <label>Ask a question</label>
              </InlineTextButton>
            </span>
          ) : null}
        </div>
       
        <Popover
          classNames={css.popoverSocialShare}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'center',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'center',
            horizontal: 'left',
          }}
        >
          <SocialShare url={urlShare}/>
        </Popover>
      </div>
    </div>
  );
};

export default SectionHeading;
