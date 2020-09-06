import React, { Component } from 'react';
import { string, func } from 'prop-types';
import { intlShape, injectIntl } from '../../util/reactIntl';
import classNames from 'classnames';
import { lazyLoadWithDimensions } from '../../util/contextHelpers';
import { propTypes } from '../../util/types';
import { ensureListing } from '../../util/data';
import { richText } from '../../util/richText';
import { createSlug } from '../../util/urlHelpers';
import config from '../../config';
import { NamedLink, ResponsiveImage, IconSpinner, IconSuccess } from '../../components';
import sumBy from 'lodash/sumBy';

import css from './ListingCard.css';

const MIN_LENGTH_FOR_LONG_WORDS = 10;

const getCategory = (key) => {  
  return config.custom.categories.find(c => c.key === key);  
}

class ListingImage extends Component {
  render() {
    return <ResponsiveImage {...this.props} />;
  }
}
const LazyImage = lazyLoadWithDimensions(ListingImage, { loadAfterInitialRendering: 3000 });

export const ListingCardComponent = props => {
  const { className, rootClassName, listing, timeSlots, renderSizes, setActiveListing } = props;
  const classes = classNames(rootClassName || css.root, className);
  const currentListing = ensureListing(listing);
  const id = currentListing.id.uuid;
  const { title = '', publicData } = currentListing.attributes;
  const slug = createSlug(title);  
  const firstImage =
    currentListing.images && currentListing.images.length > 0 ? currentListing.images[0] : null;

  const listingCategory = publicData.category;
  const location = publicData.location;

  const category = getCategory(listingCategory);

  const isSlotLoading = !timeSlots || timeSlots.fetchTimeSlotsInProgress;
  const slotCount = !isSlotLoading ? sumBy(timeSlots.timeSlots, function(s) { return s.attributes.seats; }) : 0;

  return (
    <NamedLink className={classes} name="ListingPage" params={{ id, slug }}>
      <div
        className={css.threeToTwoWrapper}
        onMouseEnter={() => setActiveListing(currentListing.id)}
        onMouseLeave={() => setActiveListing(null)}
      >
        <div className={css.aspectWrapper}>
          <LazyImage
            rootClassName={css.rootForImage}
            alt={title}
            image={firstImage}
            variants={['landscape-crop', 'landscape-crop2x']}
            sizes={renderSizes}
          />
        </div>
      </div>
      <div className={css.info}>        
        <div className={css.mainInfo}>
          <div className={css.title}>
            {richText(title, {
              longWordMinLength: MIN_LENGTH_FOR_LONG_WORDS,
              longWordClass: css.longWord,
            })}
          </div>
          <div className={css.title}>
            <span className={css.address}>{location.shortAddress || location.address }</span>
          </div>
          <div className={css.title}>            
            <span className={css.categoryTag}>{category.label}</span>
          </div>
        </div>
        <div className={classNames(css.mainInfo, css.spotsArea)}>
            <div className={classNames(css.title, css.spotCount)}>
              {
                isSlotLoading ? (
                  <IconSpinner />
                ) : (
                  slotCount > 0 ? (<span>{slotCount}</span>)
                  : (<IconSuccess />)
                )
              }              
            </div>
            <div className={classNames(css.title, css.spotLeft)}>
              <span>Spots left</span>
            </div>
        </div>
      </div>
    </NamedLink>
  );
};

ListingCardComponent.defaultProps = {
  className: null,
  rootClassName: null,
  renderSizes: null,
  setActiveListing: () => null,
  onFetchTimeSlots: () => null,
};

ListingCardComponent.propTypes = {
  className: string,
  rootClassName: string,
  intl: intlShape.isRequired,
  listing: propTypes.listing.isRequired,

  // Responsive image sizes hint
  renderSizes: string,

  setActiveListing: func,
  onFetchTimeSlots: func,
};

export default injectIntl(ListingCardComponent);
