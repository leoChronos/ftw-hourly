import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import sortBy from 'lodash/sortBy';
import { propTypes } from '../../util/types';
import { ListingCard, PaginationLinks, NamedLink } from '../../components';
import config from '../../config';
import css from './SearchResultsPanel.css';

const getCategory = (key) => {  
  return config.custom.categories.find(c => c.key === key);  
}

const SearchResultsPanel = props => {
  const { className, rootClassName, listings, currentPageListingsTimeSlots, pagination, search, setActiveListing } = props;
  const classes = classNames(rootClassName || css.root, className);  

  const paginationLinks =
    pagination && pagination.totalPages > 1 ? (
      <PaginationLinks
        className={css.pagination}
        pageName="SearchPage"
        pageSearchParams={search}
        pagination={pagination}
      />
    ) : null;

  // Panel width relative to the viewport
  const panelMediumWidth = 50;
  const panelLargeWidth = 62.5;
  const cardRenderSizes = [
    '(max-width: 767px) 100vw',
    `(max-width: 1023px) ${panelMediumWidth}vw`,
    `(max-width: 1920px) ${panelLargeWidth / 2}vw`,
    `${panelLargeWidth / 3}vw`,
  ].join(', ');

  const getListingTimeSlots = (l) => {    
    return l && currentPageListingsTimeSlots ? currentPageListingsTimeSlots[l.id.uuid] || null : null;
  }

  const categoryResultList = sortBy([... new Set(listings.map(x => x.attributes.publicData.category))],[function(o) {return o;}]);

  const orderedListings = sortBy(listings, [function(l) { 
    return !(l.attributes.metadata && l.attributes.metadata.isRecommended);
  }]);  

  const recommendedListings = listings.filter(x => x.attributes.metadata && x.attributes.metadata.isRecommended);

  const recommendedListingsBlock = 
    recommendedListings.length > 0 ? (
      <React.Fragment>
          <div className={css.listingCardsTitle}>
            <span>Our top spots</span>
          </div>
          <div className={css.listingCards}>
            {recommendedListings.map(l => (
              <ListingCard
                className={css.listingCard}
                key={l.id.uuid}
                listing={l}
                timeSlots={getListingTimeSlots(l)}
                renderSizes={cardRenderSizes}
                setActiveListing={setActiveListing}            
              />
            ))}
            {props.children}
          </div>
          <div className={css.listingCardsShowAllLink}>            
            <NamedLink name="SearchPage" to={{ search: `?meta_isRecommended=1` }}>
              <span>Show all top spots</span>
            </NamedLink>
          </div>
      </React.Fragment>
    ) : null;

  return (
    <div className={classes}>
      {recommendedListingsBlock}
      {categoryResultList.map(c => (
        <React.Fragment key={`category_block_${c}`}>
          <div className={css.listingCardsTitle}>
            <span>{getCategory(c).label}</span>
          </div>
          <div className={css.listingCards}>
            {orderedListings.filter(x => x.attributes.publicData.category === c).map(l => (            
              <ListingCard
                className={css.listingCard}
                key={l.id.uuid}
                listing={l}
                timeSlots={getListingTimeSlots(l)}
                renderSizes={cardRenderSizes}
                setActiveListing={setActiveListing}            
              />
            ))}
            {props.children}
          </div>
          <div className={css.listingCardsShowAllLink}>            
            <NamedLink name="SearchPage" to={{ search: `?pub_category=${c}&sort=meta_isRecommended` }}>
              <span>Show all {getCategory(c).label}</span>
            </NamedLink>
          </div>
        </React.Fragment>
      ))}     
      {paginationLinks}
    </div>
  );
};

SearchResultsPanel.defaultProps = {
  children: null,
  className: null,
  listings: [],
  currentPageListingsTimeSlots: null,
  pagination: null,
  rootClassName: null,
  search: null,
};

const { array, node, object, string } = PropTypes;

SearchResultsPanel.propTypes = {
  children: node,
  className: string,
  listings: array,
  currentPageListingsTimeSlots: object.isRequired,
  pagination: propTypes.pagination,
  rootClassName: string,
  search: object,
};

export default SearchResultsPanel;
