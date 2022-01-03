import sanctuary from 'sanctuary';
import $         from 'sanctuary-def';
import show      from 'sanctuary-show';
import * as F    from 'fluture';
import {
  env as flutureEnv
}                from 'fluture-sanctuary-types';


const S = sanctuary.create ({
	checkTypes: import.meta.env.DEV,
  env: sanctuary.env.concat (flutureEnv)
});

export { S,	$, F, show };
