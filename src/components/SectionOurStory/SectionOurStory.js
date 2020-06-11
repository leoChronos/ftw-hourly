import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import config from '../../config';
import { ExternalLink } from '../../components';

import css from './SectionOurStory.css';


const SectionOurStory = props => {
  const { rootClassName, className } = props;

  const classes = classNames(rootClassName || css.root, className);

  return (
    <div className={css.ourStoryContainer}>
        <h2 className={css.ourStoryTitle}>A real pain in the covid turned into a really good way to help Kiwis.</h2>
        <ExternalLink href={config.linkGoodSpotPartners} className={css.ourStoryLink}>
            <span>Our Story</span>
        </ExternalLink>
    </div>
  );
};

SectionOurStory.defaultProps = { rootClassName: null, className: null };

const { string } = PropTypes;

SectionOurStory.propTypes = {
  rootClassName: string,
  className: string,
};

export default SectionOurStory;
