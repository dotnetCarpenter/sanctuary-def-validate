import '../index.css';

import { S, $ } from './sanctuary.js';
import {
  $DateIso,
  $Email,
}               from './types.js';

const log = console.log;

const $Person = $.RecordType ({
  name: $.NonEmpty ($.String),
  email: $.NonEmpty ($Email),
});

const $Event = $.RecordType ({
  date: $.NonEmpty ($DateIso),
});

const $Inquiry = (
  $.NullaryType ('Inquiry')
                ('')
                ([])
                (x => S.reduce (b => t => b && S.isRight ($.validate (t) (x)))
                               (true)
                               ([$Person, $Event])
                )
);

const valid = {
  name: '',
  email: 'jon',
  date: '2022-01',
};

log (
  $.validate ($Inquiry) (valid),
  $.test ($.env.concat ([])) ($Inquiry) (valid)
);

