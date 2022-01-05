import '../style.css';

import {
  S,
  $,
  F,
  show
} from './sanctuary.js';

// import {
//   run,
//   modify
// } from 'monastic';

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

//    setProperty :: Object -> String -> a -> a
const setProperty = object => prop => value => (object[prop] = value, value);

//    hideSideEffect :: (a -> b) -> a -> a
const hideSideEffect = f => a => (f (a), a);


// -- MODEL

const $Inquiry =$.RecordType ({
  name: $.NonEmpty ($.String),
  email: $Email,
  date: $.NonEmpty ($DateIso),
  eventType: createEnum ('EventType')
                        (['Corporate event', 'Birthday', 'Other']),
  details: $.String,
  signup: $.Boolean
});

const Model = {
  name: '',
  email: '',
  date: '',
  eventType: '',
  details: '',
  signup: false
}

// const State = {
//   ...Model,
//   'submit': false
// }

//    validation :: Model -> Either (Array ValidationError) a
const validation = $.validate ($Inquiry);


// -- VIEW

const HtmlForm             = $1 ('form[name="inquiry"]');
const HtmlValidationOutput = $1 ('#validationOutput');
const HtmlSubmit           = $1 ('[type="submit"]');
const HtmlFormError        = HtmlForm.querySelector ('.formError');
const HtmlNameError        = HtmlForm.querySelector ('.nameError');
const HtmlEmailError       = HtmlForm.querySelector ('.emailError');
const HtmlDateError        = HtmlForm.querySelector ('.dateError');
const HtmlEventTypeError   = HtmlForm.querySelector ('.eventTypeError');
// fields
const HtmlName             = $1 ('[name="name"]');
const HtmlEmail            = $1 ('[name="email"]');
const HtmlDate             = $1 ('[name="date"]');
const HtmlEventType        = $1 ('[name="eventType"]');
const HtmlDetails          = $1 ('[name="details"]');
const HtmlSignup           = $1 ('[name="signup"]');

const HtmlFields = [HtmlName, HtmlEmail, HtmlDate, HtmlEventType, HtmlDetails, HtmlSignup];

//    update :: HtmlElement -> Model
const update = ({target}) => {
  switch (target) {
    case HtmlName:
      Model.name = S.trim (target.value);
      break;

    case HtmlEmail:
      Model.email = S.trim (target.value);
      break;

    case HtmlDate:
      Model.date = target.value;
      break;

    case HtmlEventType:
      Model.eventType = target.value;
      break;

    case HtmlDetails:
      Model.details = S.trim (target.value);
      break;

    case HtmlSignup:
      Model.signup = Boolean (target.checked);
      break;

    default:
      throw new TypeError ('update :: Unhandled HtmlElement ' + target.name || target.id || target.className);
  }

  return Model;
};

//    displayError :: String -> HtmlElement -> Void
const displayError = text => HtmlElement => {
  switch (HtmlElement) {
    case HtmlFormError:
    case HtmlNameError:
    case HtmlEmailError:
    case HtmlDateError:
    case HtmlEventTypeError:
      HtmlElement.textContent = text;
      HtmlElement.classList.remove ('invisible');
      break;

    case HtmlName:
    case HtmlEmail:
    case HtmlDate:
    case HtmlEventType:
      HtmlElement.setCustomValidity (text);
      break;

    default:
      throw new TypeError ('displayError :: Unhandled HtmlElement');
  }
};


// -- VALIDATION

//    ErrorDictionary :: StrMap
const ErrorDictionary = {
  $$: 'You have invalid form inputs',
  name: 'Name is required',
  email: 'Email is required and must be a valid email address',
  date: 'An event date is required',
  eventType: 'We currently do not do weddings',
};

const HtmlLookup = {
  $$: [HtmlFormError],
  name: [HtmlName, HtmlNameError],
  email: [HtmlEmail, HtmlEmailError],
  date: [HtmlDate, HtmlDateError],
  eventType: [HtmlEventType, HtmlEventTypeError],
};

//    formatErrors :: Array ValidationError -> StrMap
const formatErrors = S.pipe ([
  S.map (error => {
    let text = ErrorDictionary[error.name];

    return text === undefined
      ? S.Nothing
      : S.Just ({ name: error.name, text });
  }),
  S.reduce (accu => S.maybe (accu)
                            (e => (S.insert (e.name) (e.text) (accu))))
           ({}),
]);

//    viewValidation :: Either (Array ValidationError) a -> Maybe StrMap
const viewValidation = (
  S.either (S.compose (S.Just) (formatErrors))
           (S.K (S.Nothing))
);

// TODO: should not handle disable/enable of submit
//    dispatchErrors :: Maybe StrMap -> Maybe StrMap
const dispatchErrors = S.pipe ([
  S.map (S.pairs),
  S.map (S.map (hideSideEffect (
    S.pair (key => text => {
      return S.map (displayError (text)) (HtmlLookup[key]);
    })
  ))),
  trace ('after displayError'),
  S.ifElse (S.isNothing)
           (hideSideEffect (() => HtmlSubmit.disabled = false))
           (hideSideEffect (() => HtmlSubmit.disabled = true)),
]);



// -- MAIN

//    init :: Array (HtmlElement) -> Model
const init = S.pipe ([
  S.map (S.singleton ('target')),
  S.map (update)
]);

//    outputValidation :: a -> a
const outputValidation = hideSideEffect (S.pipe ([
  show,
  setProperty (HtmlValidationOutput) ('textContent')
]));

//    main :: ChangeEvent -> Future (Array ValidationError) a
const main = S.pipe ([
  F.encase (update),                     // Future Error Model
  trace ('after update'),
  S.map (trace ('map after update')),
  F.chain (F.encase (validation)),       // Future Error Either (Array ValidationError) a
  F.chain (F.encase (outputValidation)), // Future Error Either (Array ValidationError) a
  F.chain (F.encase (viewValidation)),   // Future Error Maybe StrMap
  F.chain (F.encase (dispatchErrors))    // Future Error Maybe StrMap
]);

const fork = F.fork (console.error)
                    (console.debug);

// TODO: make init work with queryStrings e.g. ?name=Jon&email=jon.ronnenberg%40gmail.com&date=2022-01-08&eventType=Corporate+event&details=&signup=on
init (HtmlFields);

HtmlForm.addEventListener ('change',
  S.compose (fork)
            (main)
);

// debugging
trace ('model') (Model)
