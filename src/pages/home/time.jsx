'use strict';
import {
  h,
} from 'lib/preact';

export default (props) => {
  const { children } = props;
  return (
    <div
      {...props}
    >
      {children}
    </div>
  );
}