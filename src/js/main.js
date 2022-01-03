import '../index.css';

import { S, $, show  } from './sanctuary.js';
import {
  $DateIso,
  $Email,
  createEnum
}               from './types.js';

const trace = msg => x => (console.debug (`[${msg}]:`, x), x);
const $$ = s => document.querySelectorAll (s);
const $1 = s => document.querySelector (s);


// -- MODEL

const $Inquiry =$.RecordType ({
  name: $.NonEmpty ($.String),
  email: $.NonEmpty ($Email),
  date: $.NonEmpty ($DateIso),
  eventType: createEnum ('EventType')
                        (['Corporate event', 'Wedding', 'Birthday', 'Other']),
  details: $.String,
  signup: $.Boolean
});

const model = {
  name: '',
  email: '',
  date: '',
  eventType: '',
  details: '',
  signup: false
}


// -- UPDATE

const HtmlName      = $1 ('[name="name"]');
const HtmlEmail     = $1 ('[name="email"]');
const HtmlDate      = $1 ('[name="date"]');
const HtmlEventType = $1 ('[name="eventType"]');
const HtmlDetails   = $1 ('[name="details"]');
const HtmlSignup    = $1 ('[name="signup"]');
const HtmlSubmit    = $1 ('[type="submit"]');
const HtmlValidationOutput = $1 ('#validationOutput');

//    update :: HtmlElement -> Void
const update = ({target}) => {
  switch (target) {
    case HtmlName:
      model.name = target.value;
      break;

    case HtmlEmail:
      model.email = target.value;
      break;

    case HtmlDate:
      model.date = target.value;
      break;

    case HtmlEventType:
      model.eventType = target.value;
      break;

    case HtmlDetails:
      model.details = target.value;
      break;

    case HtmlSignup:
      model.signup = Boolean (target.checked);
      break;

    default:
      throw new TypeError ('Unhandled Html Element ' + target.name || target.id || target.className);
  }

  HtmlValidationOutput.textContent = view (validation (model));
};

//    validation :: Model -> Either (Array ValidationError) a
const validation = $.validate ($Inquiry);

const disable = HtmlElement => bool => HtmlElement.disabled = bool;


// -- VIEW

const view = S.pipe ([
  S.either (a => (disable (HtmlSubmit) (true), S.Left (a)))
           (a => (disable (HtmlSubmit) (false), S.Right (a))),
  show
]);


// -- MAIN

$1 ('form').addEventListener ('change', update);
// $1 ('form').addEventListener ('keyup', trace ('keyup'));


// const valid = {
//   name: '',
//   email: 'jon',
//   date: '2022-01',
// };

// console.debug (
//   $.validate ($Inquiry) (valid),
//   $.test ([]) ($Inquiry) (valid)
// );

