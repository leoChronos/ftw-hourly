/**
 * Renders non-reversal line items that are not listed in the
 * `LINE_ITEMS` array in util/types.js
 *
 * The line items are rendered so that the line item code is formatted to human
 * readable form and the line total is printed as price.
 *
 * If you require another kind of presentation for your line items, add them to
 * the `LINE_ITEMS` array in util/types.js and create a specific line item
 * component for them that can be used in the `BookingBreakdown` component.
 */
import React from 'react';
import { FormattedMessage, intlShape } from '../../util/reactIntl';
import { propTypes } from '../../util/types';

import css from './BookingBreakdown.css';

const LineItemSpotDetailsMaybe = props => {
  const { transaction, intl } = props;

  const {discount, spotDetails} = transaction.attributes.protectedData.discountData ? transaction.attributes.protectedData.discountData : {};

  return discount ? (
      <>
      <div className={css.spotDetails}>
        <div>          
          <div className={css.discountInfo}>
            <span>{discount}% discount</span>
          </div>
          <div className={css.detailsInfo}>
            <span>{spotDetails}</span>
          </div>
        </div>                
        <hr className={css.totalDivider} />
       </div>
    </>
  ) : null;
};

LineItemSpotDetailsMaybe.propTypes = {
  transaction: propTypes.transaction.isRequired,
  intl: intlShape.isRequired,
};

export default LineItemSpotDetailsMaybe;
