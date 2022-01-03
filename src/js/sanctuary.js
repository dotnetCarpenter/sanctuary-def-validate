import sanctuary from 'sanctuary';
import $         from 'sanctuary-def';
import show      from 'sanctuary-show';
import * as F    from 'fluture';
import {
  env as flutureEnv
}                from 'fluture-sanctuary-types';


const $Event = $.NullaryType
  ('Event')
  ('https://devdocs.io/dom/event')
  ([])
  (x => Object.prototype.toString.call (x) === '[object Event]');


const S = sanctuary.create ({
	checkTypes: import.meta.env.DEV,
  env: sanctuary.env.concat (flutureEnv).concat ($Event)
});

export { S,	$, F, show };
