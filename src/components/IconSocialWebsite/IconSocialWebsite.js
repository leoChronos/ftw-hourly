import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import css from './IconSocialWebsite.css';

const IconSocialWebsite = props => {
  const { rootClassName, className } = props;
  const classes = classNames(rootClassName || css.root, className);
  return (
    <img
        className={classes}
        width="17"
        height="17" 
        alt=""
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAAA9UlEQVRIid2UPRKCMBCFP+0cOksPAMewlfEeeARLU3oAzuA1bKn1BoBegVILFiYTIgk/Fvpmdph9u3mb3YTAv2APlMBrJiuAWC9QzCjeWK4XaMi50OotRyxeT6poQWD4DyD9EOvouTpQQKYJhcAGuAmXSY4Ttg6UcCeNOwgXin8U/+zSMwmbOMAFeBqcrYhzRJV8Vwa/Ba4G1+RU9MA2InNnkfiJlqOwd+ockS5wpz7QRHIiiQUSUz4b9rmmKd35O6+pTwEdvj/Z6AK+6Nyi0ghMNagf0BYx876oObADWAxsW4fX2jGv6SD47MJ1+L0aX+/g9/EGq7+Wt5KTZV8AAAAASUVORK5CYII="/>    
  );
};

IconSocialWebsite.defaultProps = { rootClassName: null, className: null };

const { string } = PropTypes;

IconSocialWebsite.propTypes = { rootClassName: string, className: string };

export default IconSocialWebsite;
