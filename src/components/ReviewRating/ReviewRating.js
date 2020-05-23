import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { IconReviewStar } from '../../components';
import { REVIEW_RATINGS } from '../../util/types';
import intersection from 'lodash/intersection';

const ReviewRating = props => {
  const { className, rootClassName, reviewStarClassName, rating } = props;
  const classes = classNames(rootClassName, className);  

  const stars = REVIEW_RATINGS;
  return (
    <span className={classes}>
      {stars.map(star => (
        <IconReviewStar
          key={`star-${star}`}
          className={reviewStarClassName}
          isFilled={star <= rating}
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
