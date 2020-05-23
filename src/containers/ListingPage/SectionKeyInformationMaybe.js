import React from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import { richText } from '../../util/richText';

import css from './ListingPage.css';

const MIN_LENGTH_FOR_LONG_WORDS_IN_DESCRIPTION = 20;

const SectionKeyInformationMaybe = props => {
  const { keyInformation, address } = props;
  return keyInformation ? (
    <div className={css.sectionDescription}>
      <h2 className={css.descriptionTitle}>
        <FormattedMessage id="ListingPage.keyInformationTitle" />
      </h2>
      <h3 className={css.titleAddress}>{address}</h3>
      <p className={css.description}>
        {richText(keyInformation, {
          longWordMinLength: MIN_LENGTH_FOR_LONG_WORDS_IN_DESCRIPTION,
          longWordClass: css.longWord,
        })}
      </p>
    </div>
  ) : null;
};

export default SectionKeyInformationMaybe;
