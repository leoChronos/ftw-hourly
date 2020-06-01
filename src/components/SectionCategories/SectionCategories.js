import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import { lazyLoadWithDimensions } from '../../util/contextHelpers';
import config from '../../config';

import { NamedLink } from '../../components';

import css from './SectionCategories.css';

import nyImage from './images/ny-yogi.jpg';
import laImage from './images/la-yogi.jpg';
import sfImage from './images/sf-yogi.jpg';

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
const LazyImage = lazyLoadWithDimensions(CategoryImage);

const categoryLink = (key, name, image, searchQuery) => {  
  return (
    <NamedLink key={`category_link_${key}`} name="SearchPage" to={{ search: searchQuery }} className={css.category}>
      <div className={css.imageWrapper}>
        <div className={css.aspectWrapper}>
          <LazyImage src={image} alt={name} className={css.categoryImage} />
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
      {/* <div className={css.title}>
        <FormattedMessage id="SectionLocations.title" />
      </div> */}
      <div className={css.categories}>
        {
            config.custom.categories.filter(x => !x.hideFromFilters).map((category, i) => {
                
                return (
                    categoryLink(
                        category.key,
                        category.label,
                        nyImage, 
                        `?pub_category=${category.key}`
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
