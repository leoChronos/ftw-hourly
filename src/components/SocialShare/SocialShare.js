import { string } from 'prop-types';
import React, { Component } from 'react';
import {
  FacebookShareCount,  
  FacebookShareButton,  
  TwitterShareButton,
  FacebookIcon,
  TwitterIcon,
} from 'react-share';

import css from './SocialShare.css';

class SocialShare extends Component {
  render() {

    const url = this.props.url || 'https://goodspot-test.herokuapp.com/';
    const title = 'GoodSpot';
    const hashtag = 'GoodSpot';
    const hashtags = ["GoodSpot"];

    const shareUrl = url.replace('http://localhost:3000/', 'https://goodspot-test.herokuapp.com/');

    return (
      <div className={css.container}>
        <div className={css.socialArea}>
          <FacebookShareButton
            url={shareUrl}
            quote={title}
            hashtag={hashtag}            
          >
            <FacebookIcon size={32} round />
          </FacebookShareButton>

          {/* <div>
            <FacebookShareCount url={shareUrl}>
              {count => count}
            </FacebookShareCount>
          </div> */}
        </div>
        <div className={css.socialArea}>
          <TwitterShareButton
            url={shareUrl}
            title={title}
            hashtags={hashtags}            
          >
            <TwitterIcon size={32} round />
          </TwitterShareButton>          
        </div>
      </div>
    );
  }
}

SocialShare.defaultProps = { className: null, url: null };

SocialShare.propTypes = { className: string, url: string };

export default SocialShare;