'use strict';

import { debounce } from 'lodash';
export { debounce };
export const delay = (amount = 0) => {
	return new Promise(resolve => {
		setTimeout(resolve, amount);
	});
}