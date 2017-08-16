'use strict';
import {
	h,
	Component,
} from 'lib/preact';
import styles from './header.scss';
import MoreIcon from './more.svg';
import LeftIcon from './left.svg';

export default class Home extends Component {
	render() {
		return (
			<div className={styles.header}>
				<div className={styles.back}>
					<LeftIcon className={styles.left} />
				</div>
				<div className={styles.icon}>
					微信
        </div>
				<div className={styles.text}>
					欧弟
        </div>
				<div className={styles.icon}>
					<MoreIcon className={styles.svg} />
				</div>
			</div >
		);
	}
}
