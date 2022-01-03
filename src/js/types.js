import { $ } from './sanctuary.js';

//    createEnum :: String -> Array String -> Type
const createEnum = name => values => $.EnumType
  (name)
  ('')
  (values)

//    $DateIso :: NullaryType
const $DateIso = (
  $.NullaryType ('DateIso')
                ('https://www.w3.org/QA/Tips/iso-date')
                ([$.String])
                (x => {
                  // debugger;
                  return /^\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[1-2]\d|3[0-1])$/.test (x)
                })
);

//    $Email :: NullaryType
const $Email = (
  $.NullaryType ('Email')
                ('https://datatracker.ietf.org/doc/html/rfc5322#section-3.4.1')
                ([$.String])
                (x => {
                  // debugger;
                  return /^[A-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?(?:\.[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?)*$/i.test (x)
                })
);

export {
  createEnum,
  $DateIso,
  $Email
};
