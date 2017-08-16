'use strict';
import {
  h,
  Component,
} from 'lib/preact';
import { cxBind } from 'lib/helper';
import Img from 'components/Image';
import Video from 'components/Video';

import styles from './meassage.scss';
const cx = cxBind(styles);
export default class Msg extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      paused: true,
    };
  }
  componentDidMount() {

  }
  handlePlay = () => {
    const { paused } = this.state;
    this.setState({ paused: !paused });
  }
  render({ right, className, type, children, src, avatar, callback }, { paused }) {
    return (
      <div className={cx('msg', className, {
        right,
      })}>
        <div className={styles['avatar-box']}>
          <Img className={styles.avatar} src={avatar} />
        </div>
        <div className={styles.msg_content}>
          <div className={cx('bubble', {
            left: !right,
            right,
            text: !type,
            media: Boolean(type),
          })}>
            <div className={styles.bubble_cont}>
              {
                type === 'video' ?
                  <div className={cx('video_box', {
                    playing: !paused,
                  })}>
                    <Video
                      autoplay={false}
                      paused={paused}
                      preload={true}
                      data={{ source: src }} className={styles.bubble_video} />
                    <div className={styles.play_btn} onClick={this.handlePlay} />
                  </div>
                  : type === 'img' ?
                    <Img src={src} className={styles.bubble_img} onLoad={callback} />
                    :
                    children
              }
            </div>

          </div>
        </div>
      </div >
    );
  }
}
