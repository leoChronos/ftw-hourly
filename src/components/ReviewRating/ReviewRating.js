import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { IconReviewStar } from '../../components';
import { REVIEW_RATINGS } from '../../util/types';
import meanBy from 'lodash/meanBy';



const ReviewRating = props => {
  const { className, rootClassName, reviewStarClassName, rating } = props;
  const classes = classNames(rootClassName, className);  

  const stars = REVIEW_RATINGS;
  const ratingAvg = rating.length > 0 ? meanBy(rating, function(o) { return o.attributes.rating; }) : 0;

  return (
    <span className={classes}>
      {stars.map(star => (
        <IconReviewStar
          key={`star-${star}`}
          className={reviewStarClassName}
          isFilled={star <= ratingAvg}
        />
      ))}
    </span>
  );
};

ReviewRating.defaultProps = {
  rootClassName: null,
  className: null,
  reviewStarClassName: null,
};

const { string, oneOf } = PropTypes;

ReviewRating.propTypes = {
  rating: oneOf([0, 1, 2, 3, 4, 5]).isRequired,  
  reviewStartClassName: string,
  rootClassName: string,
  className: string,
};

export default ReviewRating;
