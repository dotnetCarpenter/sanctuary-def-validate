import '../style.css';

import {
  S,
  $,
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

const debug = x => {
  debugger
  return x;
};

//    $$ :: String -> Array HtmlElement
const $$ = s => document.querySelectorAll (s);

//    $1 :: String -> HtmlElement
const $1 = s => document.querySelector (s);

//    eitherToFuture :: Either a b -> Future a b
// const eitherToFuture = S.either (F.reject) (F.resolve);

//    setProperty :: Object -> String -> a -> a
const setProperty = object => prop => value => (object[prop] = value, value);

//    hideSideEffect :: (a -> b) -> a -> a
const hideSideEffect = f => a => (f (a), a);


// -- MODEL

const $Inquiry =$.RecordType ({
  name: $.NonEmpty ($.String),
  email: $.NonEmpty ($Email),
  date: $.NonEmpty ($DateIso),
  eventType: createEnum ('EventType')
                        (['Corporate event', 'Birthday', 'Other']),
  details: $.String,
  signup: $.Boolean
});

const State = {
  name: '',
  email: '',
  date: '',
  eventType: '',
  details: '',
  signup: false
};

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
      State.name = S.trim (target.value);
      break;

    case HtmlEmail:
      State.email = S.trim (target.value);
      break;

    case HtmlDate:
      State.date = target.value;
      break;

    case HtmlEventType:
      State.eventType = target.value;
      break;

    case HtmlDetails:
      State.details = S.trim (target.value);
      break;

    case HtmlSignup:
      State.signup = Boolean (target.checked);
      break;

    default:
      throw new TypeError ('update :: Unhandled HtmlElement ' + target.name || target.id || target.className);
  }

  return State;
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

//    outputValidation :: a -> a
const outputValidation = hideSideEffect (S.pipe ([
  show,
  setProperty (HtmlValidationOutput) ('textContent')
]));

//    formatErrors :: Array ValidationError -> Array (Pair HtmlElementId String)
const formatErrors = S.map (error => S.Pair (error.name) (ErrorDictionary[error.name]));

//    viewValidation :: Either (Array ValidationError) a -> Maybe (Array (Pair HtmlElementId String))
const viewValidation = (
  S.either (S.compose (S.Just) (formatErrors))
           (S.K (S.Nothing))
);

//    dispatchErrors :: Maybe (Array (Pair HtmlElementId String)) -> Maybe (Array (Pair HtmlElementId String))
const dispatchErrors = S.pipe ([
  S.map (S.map (hideSideEffect (
    S.pair (key => text => {
      return S.map (displayError (text)) (HtmlLookup[key]);
    })
  ))),
  // debugging
  S.promap (f => S.Pair (S.show (f)) (f))
           (S.snd)
           (S.mapLeft (trace ('after displayError'))),
]);



// -- MAIN

// HtmlElementId :: String

//    init :: Array (HtmlElement) -> Model
const init = S.pipe ([
  S.map (S.singleton ('target')),
  S.map (update)
]);

//    main :: ChangeEvent -> Future (Array ValidationError) a
const main = S.pipe ([
  update,                // Model                                     :> Pair HtmlElementId Model
  validation,            // Either (Array ValidationError) a          :> Pair HtmlElementId (Either (Array ValidationError) Model)
  S.mapLeft (trace ('validation')),
  outputValidation,      // Either (Array ValidationError) a          :> Pair HtmlElementId (Either (Array ValidationError) Model)
  viewValidation,        // Maybe (Array (Pair HtmlElementId String))
  dispatchErrors,        // Maybe (Array (Pair HtmlElementId String))
  S.ifElse (S.isNothing)
           (hideSideEffect (() => HtmlSubmit.disabled = false))
           (hideSideEffect (() => HtmlSubmit.disabled = true)),
]);

// TODO: make init work with queryStrings e.g. ?name=Jon&email=jon.ronnenberg%40gmail.com&date=2022-01-08&eventType=Corporate+event&details=&signup=on
init (HtmlFields);

HtmlForm.addEventListener ('change', main);

// debugging
trace ('model') (State)
