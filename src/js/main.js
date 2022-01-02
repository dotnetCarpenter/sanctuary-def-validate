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
                ([$Person, $Event])
                (x => {
                  return true
                })
);

const valid = {
  name: '',
  email: 'jon@do',
  date: '2022-01',
};

log (
  S.isRight ($.validate ($Inquiry) (valid)),
  $.test ($.env.concat ([$Person, $Event])) ($Inquiry) (valid)
);

