import React from 'react';
import PropTypes from 'prop-types';
import config from '../../config';
import { ExternalLink } from '../../components';

import css from './SectionGoodSpotForBusiness.css';


const SectionGoodSpotForBusiness = props => {
  return (
    <div className={css.container}>
        <div className={css.board}>
        </div>
        <div className={css.content}> 
            <h1 className={css.title}>GoodSpot for business</h1>
            <h3 className={css.subTitle}>We partner with businesses just like yours to help turn your empty off-peak spots into on-peak spots.</h3>
            <ExternalLink href={config.linkGoodSpotPartners} className={css.link}>
                <span>GoodSpot For Business</span>
            </ExternalLink>
        </div>
    </div>              
  );
};

SectionGoodSpotForBusiness.defaultProps = { rootClassName: null, className: null };

const { string } = PropTypes;

SectionGoodSpotForBusiness.propTypes = {
  rootClassName: string,
  className: string,
};

export default SectionGoodSpotForBusiness;
