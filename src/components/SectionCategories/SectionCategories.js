import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { lazyLoadWithDimensions } from '../../util/contextHelpers';
import config from '../../config';

import { NamedLink } from '../../components';

import css from './SectionCategories.css';

import barImage from './images/Bar-Dining-Home-Page-tile.png';
import healthImage from './images/Health-Wellness-Home-Page-tile.png';
import beautyImage from './images/Beauty-Home-Page-tile.png';
import businessImage from './images/Business-Home-Page-tile.png';
import houseImage from './images/Home-Garden-Home-Page-tile.png';
import activitiesImage from './images/Activities-Home-Page-tile.png';

class CategoryImage extends Component {
  render() {
    const { alt, ...rest } = this.props;
    return (
        <>
            <img alt={alt} {...rest}/>      
            <span className={css.categoryName}>{alt}</span>;      
        </>
    );
  }
}

const getCategoryImage = (category) => {
  switch(category){
    case "bar_dining" : return barImage;
    case "health_wellness" : return healthImage;
    case "beauty_services" : return beautyImage;
    case "business_services" : return businessImage;
    case "house_garden" : return houseImage;
    case "activities" : return activitiesImage;
    default: return "";
  }
};

const LazyImage = lazyLoadWithDimensions(CategoryImage);

const categoryLink = (key, name, searchQuery) => {  
  return (
    <NamedLink key={`category_link_${key}`} name="SearchPage" to={{ search: searchQuery }} className={css.category}>
      <div className={css.imageWrapper}>
        <div className={css.aspectWrapper}>
          <LazyImage src={getCategoryImage(key)} alt={name} className={css.categoryImage} />
        </div>        
      </div>      
    </NamedLink>
  );
};

const SectionCategories = props => {
  const { rootClassName, className } = props;

  const classes = classNames(rootClassName || css.root, className);

  return (
    <div className={classes}>  
      <div className={css.categories}>
        {
            config.custom.categories.filter(x => !x.hideFromFilters).map((category, i) => {
                
                return (
                    categoryLink(
                        category.key,
                        category.label,                         
                        `?pub_category=${category.key}&sort=meta_isRecommended`
                      )
                );
            })
        }        
      </div>
    </div>
  );
};

SectionCategories.defaultProps = { rootClassName: null, className: null };

const { string } = PropTypes;

SectionCategories.propTypes = {
  rootClassName: string,
  className: string,
};

export default SectionCategories;
