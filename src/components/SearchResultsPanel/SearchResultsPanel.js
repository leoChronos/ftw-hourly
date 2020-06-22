import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
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

  const categoryResultList = [... new Set(listings.map(x => x.attributes.publicData.category))];  

  return (
    <div className={classes}>
      {categoryResultList.map(c => (
        <React.Fragment key={`category_block_${c}`}>
          <div className={css.listingCardsTitle}>
            <span>{getCategory(c).label}</span>
          </div>
          <div className={css.listingCards}>
            {listings.filter(x => x.attributes.publicData.category === c).map(l => (
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
            <NamedLink name="SearchPage" to={{ search: `?pub_category=${c}` }}>
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
