import '../index.css';

import { S, $ } from './sanctuary.js';
import {
  $DateIso,
  $Email,
  createEnum
}               from './types.js';

const log = console.log;
const $$ = s => document.querySelectorAll (s);
const $_ = s => document.querySelector (s);

const $Inquiry =$.RecordType ({
  name: $.NonEmpty ($.String),
  email: $.NonEmpty ($Email),
  date: $.NonEmpty ($DateIso),
  eventType: createEnum ('EventType')
                        (['Corporate event', 'Wedding', 'Birthday', 'Other']),
  details: $.String,
  signup: $.Boolean
});

const valid = {
  name: '',
  email: 'jon',
  date: '2022-01',
};

$_ ('form').addEventListener ('keyup', log)


log (
  $.validate ($Inquiry) (valid),
  $.test ([]) ($Inquiry) (valid)
);

