import sanctuary from 'sanctuary';
import $         from 'sanctuary-def';
import show      from 'sanctuary-show';

const S = sanctuary.create ({
	checkTypes: import.meta.env.DEV,
  env: sanctuary.env,
});

export { S,	$, show };
