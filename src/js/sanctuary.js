import sanctuary from 'sanctuary';
import $ from 'sanctuary-def';

const S = sanctuary.create ({
	checkTypes: import.meta.env.DEV,
  env: sanctuary.env,
});

export { S,	$ };
