import React from 'react';
import PropTypes from 'prop-types';
import MobileLogoImage from '../../assets/mobile_good_spot_logo.png';
import DesktopLogoImage from '../../assets/good_spot_logo.png';
import config from '../../config';

const IconLogo = props => {
  const { className, format, ...rest } = props;  

  if (format === 'desktop') {
    return (
      <img
        className={className}
        src={DesktopLogoImage}
        alt={config.siteTitle}
        {...rest}
      />      
    );
  }

  return (
    <img
        className={className}
        src={MobileLogoImage}
        alt={config.siteTitle}
        {...rest}
      />      
  );
};

const { string } = PropTypes;

IconLogo.defaultProps = {
  className: null,
};

IconLogo.propTypes = {
  className: string,
};

export default IconLogo;
