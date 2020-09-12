import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import css from './IconMail.css';

const IconMail = props => {
  const { className, rootClassName } = props;
  const classes = classNames(rootClassName || css.root, className);

  return (
    <svg className={classes} width="47" height="46" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
      <g
        className={css.marketplaceColorStroke}        
        fillRule="evenodd"
        strokeLinecap="round"
        strokeLinejoin="round"        
      >
        <path d="M467,61H45c-6.927,0-13.412,1.703-19.279,4.51L255,294.789l51.389-49.387c0,0,0.004-0.005,0.005-0.007
			c0.001-0.002,0.005-0.004,0.005-0.004L486.286,65.514C480.418,62.705,473.929,61,467,61z"/>

        <path d="M507.496,86.728L338.213,256.002L507.49,425.279c2.807-5.867,4.51-12.352,4.51-19.279V106
			C512,99.077,510.301,92.593,507.496,86.728z"/>

        <path d="M4.51,86.721C1.703,92.588,0,99.073,0,106v300c0,6.923,1.701,13.409,4.506,19.274L173.789,256L4.51,86.721z"/>

        <path d="M317.002,277.213l-51.396,49.393c-2.93,2.93-6.768,4.395-10.605,4.395s-7.676-1.465-10.605-4.395L195,277.211
			L25.714,446.486C31.582,449.295,38.071,451,45,451h422c6.927,0,13.412-1.703,19.279-4.51L317.002,277.213z"/>
      </g>
    </svg>    
  );
};

const { string } = PropTypes;

IconMail.defaultProps = {
  className: null,
  rootClassName: null,
};

IconMail.propTypes = {
  className: string,
  rootClassName: string,
};

export default IconMail;
