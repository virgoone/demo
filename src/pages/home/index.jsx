'use strict';
import {
	h,
	Component,
} from 'lib/preact';
import Message from 'components/Message';
import { cxBind, preload, delay } from 'lib/helper';
import { music } from 'lib/polyfills';
import { browser } from 'lib/browser';
import styles from './style.scss';
import Header from './header';
import Time from './time';
import Msg from './msg';
import Voice from './voice.svg';
import Add from './add.svg';
import Emoji from './emoji.svg';
import dialogData from 'src/assets/dialog.json';
const cx = cxBind(styles);
const Avartar1 = '/assets/oudi.jpg';
const Avartar2 = '/assets/default.jpg';
const AUTHOR = {
	KOYA: 'koya',
	ME: 'me',
};
export default class Home extends Component {
	constructor(props, context) {
		super(props, context);
		const date = new Date();
		let time = date.toLocaleDateString();
		if (time < 10) {
			time = '0' + time;
		}
		let hour = date.getHours();
		if (hour < 10) {
			hour = '0' + hour;
		}
		let minute = date.getMinutes();
		if (minute < 10) {
			minute = '0' + minute;
		}
		time = time + ' ' + hour + ':' + minute;
		const messages = [];
		messages.push({
			type: 'intro',
			text: time,
			id: date.getTime(),
		});
		this.state = {
			clicked: false,
			messages,
			lastDialog: {},
		};
		this.timer = {};
		this.msgChain = Promise.resolve();
	}
	componentDidMount() {
		const date = new Date();
		const { messages } = this.state;
		preload([Avartar1, Avartar2]);
		messages.push({
			type: 'intro',
			text: '您已添加了欧弟，现在可以开始聊天了。',
			id: date.getTime(),
		});
		this.timer.sendMsgTimer = setTimeout(() => {
			this.setState({ messages });
			this.timer.sendFriendMsgTimer = setTimeout(() => {
				this.renderDialog('000');
			}, 500);
		}, 800);
	}
	onInput = () => {
		this.setState({ clicked: true });
	}
	onBackdropClick = (e) => {
		this.setState({ clicked: false });
	}
	renderDialog = (id) => {
		if (typeof id === 'object' && id.length > 0) {
			// array of dialog ids
			id.forEach(id => this.renderDialog(id));
			return;
		}
		else if (id === null) {
			// clear possible responses
			this.lastDialog.responses = null;
			return;
		}
		const dialog = this.getDialog(id);
		this.getRandomMsg(dialog.details).forEach((content, index) => {
			this.msgChain = this.msgChain
				.then(() => delay(750 * (Math.round(index + 1) / 2)))
				.then(() => this.onHandleSendMsg(content, AUTHOR.KOYA));
		});
		if (dialog.nextKoya) {
			this.renderDialog(dialog.nextKoya);
		} else {
			this.setState({ lastDialog: dialog });
		}
	}
	updateScroll = () => {
		if (!this.$content) {
			return;
		}
		const { scrollHeight, scrollTop } = this.$content;
		const { height } = this.$content.getBoundingClientRect();
		const duration = 250;
		const startTime = Date.now();
		const distance = scrollHeight - height - scrollTop;
		const step = () => {
			const p = Math.min(1, (Date.now() - startTime) / duration);
			this.$content.scrollTop = scrollTop + distance * p;
			p < 1 && requestAnimationFrame(step);
		};
		requestAnimationFrame(step);
	}
	getRandomMsg = (messages) => {
		// single item
		if (typeof messages === 'string' || !messages.length) {
			return messages;
		}

		const id = Math.floor(Math.random() * messages.length);
		return messages[id];
	}
	getDialog = (id) => {
		const dialogs = dialogData.fromKoya
			.filter(dialog => dialog.id === id);
		return dialogs ? dialogs[0] : null;
	}
	onHandleSendMsg = (message, author) => {
		switch (author) {
			case 'me':
				return this.sendUserMsg(message);
			default:
				return this.sendFriendMsg(message, author);
		}
	}
	sendUserMsg = (msg) => {
		const { messages } = this.state;
		messages.push({
			id: new Date().getTime(),
			type: null,
			text: msg,
			avatar: Avartar2,
			right: true,
		});
		this.setState({ messages }, () => {
			this.updateScroll();
		});
		return Promise.resolve();
	}
	handleSay = (response) => {
		return this.say(response.content, response.nextKoya);
	}
	say = (content, dialogId) => {
		return delay(300)
			.then(() => this.onHandleSendMsg(content, AUTHOR.ME))
			.then(() => delay(500))
			.then(() => this.renderDialog(dialogId));
	}
	sendFriendMsg = (message, author) => {
		const content = this.getRandomMsg(message);
		const isVideo = content.indexOf('.mp4') > -1;
		const isImg = !isVideo && content.indexOf('/assets/') > -1;
		const msg = {
			id: new Date().getTime(),
			type: isImg ? 'img' : isVideo ? 'video' : null,
			right: author === 'me',
			author,
			text: content,
			src: content,
			avatar: Avartar1,
			callback: () => {
				this.updateScroll();
			},
		};
		if (isImg) {
			preload([content]);
		}
		const { messages } = this.state;
		messages.push(msg);
		this.setState({ messages }, () => {
			music.start && music.start();
			this.updateScroll();
		});
		return Promise.resolve();
	}
	render(props, { clicked, messages, lastDialog }) {
		return (
			<div className={cx('home', {
				wechat: browser && browser.browser.name === 'wechat',
			})}>
				<Header />
				<div className={styles.content} ref={c => this.$content = c}>
					{
						messages.length > 0 &&
						messages.map((msg, index) => (
							<Message className={cx({
								'introBox': msg.type === 'intro',
							})} key={index + '-' + msg.id}>
								{
									msg.type === 'intro' ?
										<Time className={styles.intro}>
											{msg.text}
										</Time> :
										<Msg avatar={msg.avatar} right={msg.right} type={msg.type} src={msg.src}>{msg.text}</Msg>
								}
							</Message>
						))
					}
				</div>
				<div className={styles.footer}>
					<div className={styles.icon}>
						<Voice className={styles.svg} />
					</div>
					<div className={styles.input} onClick={this.onInput} />
					<div className={styles.icon}>
						<Emoji className={styles.svg} />
					</div>
					<div className={styles.icon}>
						<Add className={styles.svg} />
					</div>
				</div>
				<div className={cx('input_box', {
					active: clicked,
					hide: !clicked,
				})} onClick={this.onBackdropClick}>

					<div className={styles.item_box}>
						<div className={styles.input_head}>
							说点什么吧...
						</div>
						<div className={styles.item_content}>
							{
								lastDialog.responses && lastDialog.responses.map((item, index) => (
									<div className={styles.item} key={index} onClick={() => this.handleSay(item)}>{item.content}</div>
								))
							}
						</div>
					</div>
				</div>
			</div >
		);
	}
}
