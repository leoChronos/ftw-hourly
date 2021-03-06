import React from 'react';
import { compose } from 'redux';
import { object, string, bool, number, func, shape } from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';
import classNames from 'classnames';
import { withRouter } from 'react-router-dom';
import omit from 'lodash/omit';

import config from '../../config';
import { BookingDateRangeFilter, KeywordFilter, SortBy, SelectSingleFilter } from '../../components';
import routeConfiguration from '../../routeConfiguration';
import { parseDateFromISO8601, stringifyDateToISO8601 } from '../../util/dates';
import { createResourceLocatorString } from '../../util/routes';
import { propTypes } from '../../util/types';
import css from './SearchFilters.css';

// Dropdown container can have a positional offset (in pixels)
const FILTER_DROPDOWN_OFFSET = -14;
//const RADIX = 10;

// resolve initial value for a single value filter
const initialValue = (queryParams, paramName) => {
  return queryParams[paramName];
};

const initialDateRangeValue = (queryParams, paramName) => {
  const dates = queryParams[paramName];
  const rawValuesFromParams = !!dates ? dates.split(',') : [];
  const valuesFromParams = rawValuesFromParams.map(v => parseDateFromISO8601(v));
  const initialValues =
    !!dates && valuesFromParams.length === 2
      ? {
          dates: { startDate: valuesFromParams[0], endDate: valuesFromParams[1] },
        }
      : { dates: null };

  return initialValues;
};

const SearchFiltersComponent = props => {
  const {
    rootClassName,
    className,
    urlQueryParams,
    sort,
    listingsAreLoaded,
    resultsCount,
    searchInProgress,    
    dateRangeFilter,
    keywordFilter,
    categoryFilter,
    locationFilter,
    isRecommendedFilter,    
    history,
    intl,
  } = props;

  const hasNoResult = listingsAreLoaded && resultsCount === 0;
  const classes = classNames(rootClassName || css.root, className);

  const keywordLabel = intl.formatMessage({
    id: 'SearchFilters.keywordLabel',
  });

  const initialDateRange = dateRangeFilter ? initialDateRangeValue(urlQueryParams, dateRangeFilter.paramName) : null;

  const initialKeyword = keywordFilter ? initialValue(urlQueryParams, keywordFilter.paramName) : null;

  const initialCategory = categoryFilter ? initialValue(urlQueryParams, categoryFilter.paramName) : null;

  const initialIsRecommended = isRecommendedFilter ? initialValue(urlQueryParams, isRecommendedFilter.paramName) : null;

  const initialLocation = locationFilter ? initialValue(urlQueryParams, locationFilter.paramName) : null;

  const isKeywordFilterActive = !!initialKeyword;

  const handleDateRange = (urlParam, dateRange) => {
    const hasDates = dateRange && dateRange.dates;
    const { startDate, endDate } = hasDates ? dateRange.dates : {};

    const start = startDate ? stringifyDateToISO8601(startDate) : null;
    const end = endDate ? stringifyDateToISO8601(endDate) : null;

    const queryParams =
      start != null && end != null
        ? { ...urlQueryParams, [urlParam]: `${start},${end}` }
        : omit(urlQueryParams, urlParam);

    queryParams.sort = queryParams.sort ? queryParams.sort : "meta_isRecommended"; 
     
    history.push(createResourceLocatorString('SearchPage', routeConfiguration(), {}, queryParams));
  };

  const handleKeyword = (urlParam, values) => {
    const queryParams = values
      ? { ...urlQueryParams, [urlParam]: values }
      : omit(urlQueryParams, urlParam);

    history.push(createResourceLocatorString('SearchPage', routeConfiguration(), {}, queryParams));
  };

  const handleSelectSingle = (urlParam, option) => {
    // query parameters after selecting the option
    // if no option is passed, clear the selection for the filter
    const queryParams = option
      ? { ...urlQueryParams, [urlParam]: option }
      : omit(urlQueryParams, urlParam);

    queryParams.sort = queryParams.sort ? queryParams.sort : "meta_isRecommended";

    history.push(createResourceLocatorString('SearchPage', routeConfiguration(), {}, queryParams));
  }

  const handleLocationSelectSingle = (urlParam, option) => {
    // query parameters after selecting the option
    // if no option is passed, clear the selection for the filter
    const queryParams = option
      ? { ...urlQueryParams, [urlParam]: option }
      : omit(urlQueryParams, urlParam);

    let location = config.defaultLocationSearches.find(x => x.key === queryParams.address);

    queryParams.bounds = location ? location.predictionPlace.bounds : null;

    queryParams.sort = queryParams.sort ? queryParams.sort : "meta_isRecommended";

    history.push(createResourceLocatorString('SearchPage', routeConfiguration(), {}, queryParams));
  }

  const dateRangeFilterElement =
    dateRangeFilter && dateRangeFilter.config.active ? (
      <BookingDateRangeFilter
        id="SearchFilters.dateRangeFilter"
        urlParam={dateRangeFilter.paramName}
        onSubmit={handleDateRange}
        showAsPopup
        contentPlacementOffset={FILTER_DROPDOWN_OFFSET}
        initialValues={initialDateRange}
      />
    ) : null;

  const keywordFilterElement =
    keywordFilter && keywordFilter.config.active ? (
      <KeywordFilter
        id={'SearchFilters.keywordFilter'}
        name="keyword"
        urlParam={keywordFilter.paramName}
        label={keywordLabel}
        onSubmit={handleKeyword}
        showAsPopup
        initialValues={initialKeyword}
        contentPlacementOffset={FILTER_DROPDOWN_OFFSET}
      />
    ) : null;

    const categoryLabel = intl.formatMessage({
      id: 'SearchFiltersMobile.categoryLabel',
    });   

    const categoryFilterElement = categoryFilter ? (
      <SelectSingleFilter
        urlParam={categoryFilter.paramName}
        label={categoryLabel}
        onSelect={handleSelectSingle}
        liveEdit
        options={categoryFilter.options}
        initialValue={initialCategory}
        intl={intl}
        showAsPopup={true}
      />
    ) : null;     
    
    const isRecommendedFilterElement = isRecommendedFilter ? (
      <SelectSingleFilter
        urlParam={isRecommendedFilter.paramName}
        label="Recommended"
        onSelect={handleSelectSingle}
        liveEdit
        options={isRecommendedFilter.options}
        initialValue={initialIsRecommended}
        intl={intl}
        showAsPopup={true}
      />
    ) : null;

    const locationFilterElement = locationFilter ? (
      <SelectSingleFilter
        urlParam={locationFilter.paramName}
        label="Location"
        onSelect={handleLocationSelectSingle}
        liveEdit
        options={locationFilter.options}
        initialValue={initialLocation}
        intl={intl}
        showAsPopup={true}
      />
    ) : null;

  // const toggleSearchFiltersPanelButtonClasses =
  //   isSearchFiltersPanelOpen || searchFiltersPanelSelectedCount > 0
  //     ? css.searchFiltersPanelOpen
  //     : css.searchFiltersPanelClosed;
  // const toggleSearchFiltersPanelButton = toggleSearchFiltersPanel ? (
  //   <button
  //     className={toggleSearchFiltersPanelButtonClasses}
  //     onClick={() => {
  //       toggleSearchFiltersPanel(!isSearchFiltersPanelOpen);
  //     }}
  //   >
  //     <FormattedMessage
  //       id="SearchFilters.moreFiltersButton"
  //       values={{ count: searchFiltersPanelSelectedCount }}
  //     />
  //   </button>
  // ) : null;

  const handleSortBy = (urlParam, values) => {
    const queryParams = values
      ? { ...urlQueryParams, [urlParam]: values }
      : omit(urlQueryParams, urlParam);

    history.push(createResourceLocatorString('SearchPage', routeConfiguration(), {}, queryParams));
  };

  const sortBy = config.custom.sortConfig.active ? (
    <SortBy
      sort={sort}
      showAsPopup
      isKeywordFilterActive={isKeywordFilterActive}
      onSelect={handleSortBy}
      contentPlacementOffset={FILTER_DROPDOWN_OFFSET}
    />
  ) : null;

  return (
    <div className={classes}>
      <div className={css.searchOptions}>
        {listingsAreLoaded ? (
          <div className={css.searchResultSummary}>
            <span className={css.resultsFound}>
              <FormattedMessage id="SearchFilters.foundResults" values={{ count: resultsCount }} />
            </span>
          </div>
        ) : null}
        {sortBy}
      </div>

      <div className={css.filters}>        
        {isRecommendedFilterElement}
        {categoryFilterElement}
        {locationFilterElement}
        {dateRangeFilterElement}
        {keywordFilterElement}        
        {/* {toggleSearchFiltersPanelButton} */}
      </div>

      {hasNoResult ? (
        <div className={css.noSearchResults}>
          <FormattedMessage id="SearchFilters.noResults" />
        </div>
      ) : null}

      {searchInProgress ? (
        <div className={css.loadingResults}>
          <FormattedMessage id="SearchFilters.loadingResults" />
        </div>
      ) : null}
    </div>
  );
};

SearchFiltersComponent.defaultProps = {
  rootClassName: null,
  className: null,
  resultsCount: null,
  searchingInProgress: false,  
  dateRangeFilter: null,
  categoryFilter: null,
  isRecommendedFilter: null,
  //locationFilter: null,
  isSearchFiltersPanelOpen: false,
  toggleSearchFiltersPanel: null,
  searchFiltersPanelSelectedCount: 0,
};

SearchFiltersComponent.propTypes = {
  rootClassName: string,
  className: string,
  urlQueryParams: object.isRequired,
  listingsAreLoaded: bool.isRequired,
  resultsCount: number,
  searchingInProgress: bool,
  onManageDisableScrolling: func.isRequired,  
  dateRangeFilter: propTypes.filterConfig,
  categoryFilter: propTypes.filterConfig,
  isRecommendedFilter: propTypes.filterConfig,
  //locationFilter: propTypes.filterConfig,
  isSearchFiltersPanelOpen: bool,
  toggleSearchFiltersPanel: func,
  searchFiltersPanelSelectedCount: number,

  // from withRouter
  history: shape({
    push: func.isRequired,
  }).isRequired,

  // from injectIntl
  intl: intlShape.isRequired,
};

const SearchFilters = compose(
  withRouter,
  injectIntl
)(SearchFiltersComponent);

export default SearchFilters;
