import S from 'sanctuary';
import * as F from 'fluture';


const future = F.resolve (x => y => z => x * y / z)
  .pipe (F.ap (F.resolve (2)))
  .pipe (F.ap (F.resolve (3)))
  .pipe (F.ap (F.resolve (4)));

F.fork (console.error)
       (console.debug)
       (future);


//    disableElement :: HtmlElement -> Boolean -> Void
const disableElement = HtmlElement => bool => HtmlElement.disabled = bool;

const dummyElement = { disabled: true };

const enableDummy = S.Right (disableElement (dummyElement) (false));

const disableDummy = S.Left (disableElement (dummyElement) (false));

const flow = (
  S.either (S.mapLeft (f => f ()) ([disableDummy]))
           (S.map (f => f ()) ([enableDummy]))
);

flow (S.Right ('yay'))


console.log (dummyElement);


// F.resolve (x => y => z => x * y / z)
//   .pipe (F.ap (F.resolve (2)))
//   .pipe (F.ap (F.resolve (3)))
//   .pipe (F.ap (F.resolve (4)))

// const d1 = either => F.go (function*() {
//   S.either (() => {HtmlSubmit.disabled = true})
//            (() => {HtmlSubmit.disabled = false})
//            (either);
//   return either
// });

// let f = d1 (S.Left ('yay'))
//   .pipe (F.and (F.resolve ()))

// F.fork (trace ('rejection'))
//        (trace ('resolve'))
//        (f);
