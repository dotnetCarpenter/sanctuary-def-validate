import '../index.css';

import {
  S,
  $,
  F,
  show
} from './sanctuary.js';

import {
  $DateIso,
  $Email,
  createEnum
} from './types.js';

const trace = msg => x => (console.debug (`[${msg}]:`, x), x);

//    $$ :: String -> Array HtmlElement
const $$ = s => document.querySelectorAll (s);

//    $1 :: String -> HtmlElement
const $1 = s => document.querySelector (s);

//    eitherToFuture :: Either a b -> Future a b
const eitherToFuture = S.either (F.reject) (F.resolve);


// -- MODEL

const $Inquiry =$.RecordType ({
  name: $.NonEmpty ($.String),
  email: $Email,
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

//    validation :: Model -> Either (Array ValidationError) a
const validation = $.validate ($Inquiry);


// -- UPDATE

const HtmlName      = $1 ('[name="name"]');
const HtmlEmail     = $1 ('[name="email"]');
const HtmlDate      = $1 ('[name="date"]');
const HtmlEventType = $1 ('[name="eventType"]');
const HtmlDetails   = $1 ('[name="details"]');
const HtmlSignup    = $1 ('[name="signup"]');
const HtmlSubmit    = $1 ('button');
const HtmlValidationOutput = $1 ('#validationOutput');

//    update :: HtmlElement -> Model
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

  return model;
};



// -- VIEW

//    disable :: HtmlElement -> Boolean -> Future Never Void
const disable = HtmlElement => F.encase (bool => HtmlElement.disabled = bool);

const disableButton = disable (HtmlSubmit);

const viewValidation = S.pipe ([
  // eitherToFuture,
  // F.and (disableButton (false)),
  // F.alt (disableButton (true)),
  // S.either (disableButton (true))
  //          (disableButton (false)),
  S.either (a => (disableButton (true), S.Left (a)))
           (a => (disableButton (false), S.Right (a))),
]);



// -- MAIN



//    init :: Array (HtmlElement) -> Model
const init = S.pipe ([
  S.map (S.singleton ('target')),
  S.map (update)
]);

//    main :: ChangeEvent -> Void
const main = S.pipe ([
  update,         // Object
  validation,     // Either (Array ValidationError) a
  viewValidation, // Object
  show,           // String
  x => (HtmlValidationOutput.textContent = x, x)
]);
// const main = S.compose (model => HtmlValidationOutput.textContent = viewValidation (validation (model)))
//                        (update);

init (Array.from ($$ ('input')));
$1 ('form').addEventListener ('change', main);

// debugging
trace ('model') (model)
