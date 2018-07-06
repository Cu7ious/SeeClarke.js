/**
 * index.js
 * - Main entrypoint for PosePointer
 *
 * - Usage example 1:
 *    new (require('posepointer'))(OPTIONS)
 *
 * - Usage example 2:
 *    <script src="./posepointer.js"></script>
 *
 * - Usage example 3:
 *    import PosePointer from 'posepointer'
 *    const posepointer = new PosePointer(OPTIONS)
 *
 *    posepointer.update(NEW_OPTIONS)
 */
const posenet = require('@tensorflow-models/posenet')
const util = require('./util')
require('./polyfills')

module.exports = class PosePointer {
  /**
   * Our main constructor
   * @param {OBJ} opts Our initializer options, @see /wiki/Options.md
   */
  constructor (opts = {}) {
    this.setDefaults(opts)

    if (this.options.autostart) this.initModel()
  }

  /**
   * Sets the default options, and overwrites this.originalOpts
   * @param {Object} opts Our initializer options, @see /wiki/Options.md
   */
  setDefaults (opts) {
    this.initOptions = opts
    this.options = {
      autostart: typeof opts.autostart !== 'undefined' ? opts.autostart : true,
      feed: typeof opts.feed !== 'undefined' ? opts.feed : util.createDefaultVideoFeed()
    }
  }

  /**
   * Initializes our model
   */
  async initModel () {
    // Error out when webcams are not supported
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) throw new Error('ERROR: This browser does not support webcams, please try another browser...like Google Chrome!')

    this.posenet = await posenet.load()
  }
}
