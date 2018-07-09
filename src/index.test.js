/*
                    _     _    _     _
                   [_]___[_]__[_]___[_]
                   [__#__][__I_]__I__#]
                   [_I_#_I__#[__]__#__]
                      [_]_#_]__I_#_]
    The comments      [I_|/ _W_ \|#]
  are in a diffrent   [#_||{(")}||_]
        file.         [_I||{/~\}||_]
                      [__]|/\_/\||#]
                      [_I__I#___]__]
                      [__I_#_I___#_]
                      [#__I____]__I]
       .-.            [__I_#__I__[_]
     __|=|__          [_#_[__#_]__#]
    (_/`-`\_)         [__#_I__[#_I_]
    //\___/\\         [_I__]__#_I__]
    <>/   \<>         [#__I__#_]__I]
     \|_._|/          [_I#__I___I_#]    .:.
      <_I_>           [#__I__]_#___]   -=o=-
       |||            [_I__I#__]___]    ':'
      /_|_\         \\[__]#___][__#]//, \|/
  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^


    =========== IMPORTANT NOTES ============
    - [ ] @TODO We're not testing canvas elements yet
    - Take care to properly test async methods with awaits

*/

const stubs = require('./jest-polyfills')
const Posepointer = require('./index')
let posepointer = null

/**
 * constructor
 */
it('Fails if getUserMedia is not supported', () => {
  stubs.mediaDevices.unsupport()
  try {posepointer = new Posepointer()} catch (e) {}
  expect(posepointer).toBeFalsy()

  // Set mediaDevices and try again
  stubs.mediaDevices.support()
  stubs.WebGL.support()
  posepointer = new Posepointer()
  expect(posepointer).toBeTruthy()
})

it('Sanitizes options and sets sane defaults', () => {
  posepointer = new Posepointer()
  expect(posepointer.options.posenet).toBeTruthy()
})

it('Autostarts if options.autostart', () => {
  posepointer = new Posepointer({autostart: false})
  expect(posepointer._isTracking).toEqual(false)

  posepointer = new Posepointer({autostart: true})
  expect(posepointer._isTracking).toEqual(true)
})

/**
 * Posepointer.trackPoses
 */
it('If debug is on, displays the points and skeletons overlays on the webcam', () => {
  posepointer = new Posepointer({autostart: false, debug: false})
  // Mock debugPoses; we're testing individual draw methods in other tests
  posepointer.debugPoses = jest.fn()
  posepointer.trackPoses()
  expect(posepointer.debugPoses).not.toHaveBeenCalled()

  posepointer = new Posepointer({autostart: false, debug: true})
  posepointer.debugPoses = jest.fn()
  posepointer.trackPoses([])
  expect(posepointer.options.posenet.maxUsers).toEqual(1)
  expect(posepointer.debugPoses).toHaveBeenCalled()
})

it('Automatically adjusts algorithm to match "single" or "multiple mode"', () => {
  // "Single" mode has already been tested above
  posepointer = new Posepointer({autostart: false, debug: true, posenet: {maxUsers: 10}})
  posepointer.debugPoses = jest.fn()
  posepointer.trackPoses([])
  expect(posepointer.options.posenet.maxUsers).toEqual(10)
  expect(posepointer.debugPoses).toHaveBeenCalled()
})
