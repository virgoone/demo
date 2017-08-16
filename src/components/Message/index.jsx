'use strict';

import {
  h,
  Component,
} from 'lib/preact';
import { logger } from 'lib/decorator';
import { cxBind } from 'lib/helper';
import styles from './styles';

const cx = cxBind(styles);

@logger('App UI message')
export default class message extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }
  componentDidMount() {
  }
  componentWillUnmount() {
  }
  render({ style, className, children }, { }) {
    const classes = cx(className, 'message-root');
    return (
      <div className={classes} style={style}>
        {children}
      </div>
    );
  }
}