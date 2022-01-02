import '../index.css';

import { S, $ } from './sanctuary.js';

const l = console.log;

l (
	S.isRight ($.validate ($.Undefined) (undefined))
);
