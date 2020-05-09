import React from 'react';
import PropTypes, { bool } from 'prop-types';
import classNames from 'classnames';
import css from './AddImages.css';

const DefineImageAsLogoButton = props => {
  const { className, rootClassName, onClick, isLogo } = props;
  const classes = classNames(rootClassName || css.defineLogo, className);

  // const logoButton = image.isLogo ? (      
  //   <button className={classes} onClick={onClick}>
  //     Remove Logo
  //     <svg
  //       width="10px"
  //       height="10px"
  //       viewBox="0 0 10 10"
  //       version="1.1"
  //       xmlns="http://www.w3.org/2000/svg"
  //     >
  //       <g strokeWidth="1" fillRule="evenodd">
  //         <g transform="translate(-821.000000, -311.000000)">
  //           <g transform="translate(809.000000, 299.000000)">
  //             <path
  //               d="M21.5833333,16.5833333 L17.4166667,16.5833333 L17.4166667,12.4170833 C17.4166667,12.1866667 17.2391667,12 17.00875,12 C16.77875,12 16.5920833,12.18625 16.5920833,12.41625 L16.5883333,16.5833333 L12.4166667,16.5833333 C12.18625,16.5833333 12,16.7695833 12,17 C12,17.23 12.18625,17.4166667 12.4166667,17.4166667 L16.5875,17.4166667 L16.5833333,21.5829167 C16.5829167,21.8129167 16.7691667,21.9995833 16.9991667,22 L16.9995833,22 C17.2295833,22 17.41625,21.81375 17.4166667,21.58375 L17.4166667,17.4166667 L21.5833333,17.4166667 C21.8133333,17.4166667 22,17.23 22,17 C22,16.7695833 21.8133333,16.5833333 21.5833333,16.5833333"
  //               transform="translate(17.000000, 17.000000) rotate(-45.000000) translate(-17.000000, -17.000000) "
  //             />
  //           </g>
  //         </g>
  //       </g>
  //     </svg>
  //   </button>
  // ):
  // (
  // <button className={classes} onClick={onClick}>      
  //   Define Logo
  //   <svg 
  //     width="24px"
  //     height="24px"
  //     viewBox="0 0 20 20"
  //     version="1.1"
  //     strokeWidth="2" 
  //     xmlns="http://www.w3.org/2000/svg">
  //     <path d="M22.6 1.2c-.4-.3-1-.2-1.3.2L7.8 19l-5.2-5c-.4-.4-1-.4-1.3 0-.4.3-.4.8 0 1l6 5.6.6.2s.2 0 .4-.4l14.3-18c.3-.5.2-1-.2-1" />
  //   </svg>
  // </button>
  // );

  const action = !isLogo ? "Set as Logo" : "Undo Logo";

  return (
    <button className={classes} onClick={onClick}>
      {action}
    </button>
  );
};

DefineImageAsLogoButton.defaultProps = { className: null, rootClassName: null, isLogo: false };

const { func, string } = PropTypes;

DefineImageAsLogoButton.propTypes = {
  className: string,
  rootClassName: string,
  onClick: func.isRequired,
  isLogo: bool.isRequired,
};

export default DefineImageAsLogoButton;