// Copyright 2016, University of Colorado Boulder

/**
 * @author Denzell Barnett
 *
 * Object that combines the play/pause button and the stepforward button.
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PlayPauseButton = require( 'SCENERY_PHET/buttons/PlayPauseButton' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var StepForwardButton = require( 'SCENERY_PHET/buttons/StepForwardButton' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var TOUCH_AREA_DILATION = 4;
  var STROKE = 'black';
  var FILL = '#005566';
  var PAUSE_SIZE_INCREASE_FACTOR = 1.25;

  /**
   * @param {MassesAndSpringsModel} model
   * @param {Object} options
   * @constructor
   */
  function MASPlayPauseStepControl( model, options ) {

    Node.call( this );

    // TODO: Can we pass in screen layout bounds from the model rather than declaring the bounds in this scope again?
    var layoutBounds = new Bounds2( 0, 0, 768, 504 );

    var mvt = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      Vector2.ZERO,
      new Vector2( 0, layoutBounds.height * .98 ),
      397 );
    this.mvt = mvt; // Make mvt available to descendant types.

    // Play Pause Button
    var playPauseButton = new PlayPauseButton( model.playingProperty, {
      right: layoutBounds.right * .65,
      bottom: mvt.modelToViewY( model.floorY ),
      radius: 18,
      touchAreaDilation: TOUCH_AREA_DILATION
    } );
    this.addChild( playPauseButton );

    // Step Forward Button
    var stepForwardButton = new StepForwardButton( {
      playingProperty: model.playingProperty,
      listener: function() { model.stepForward(); },
      radius: 12,
      stroke: STROKE,
      fill: FILL,
      touchAreaDilation: TOUCH_AREA_DILATION,
      centerX: playPauseButton.centerX + 50,
      centerY: playPauseButton.centerY
    } );
    this.addChild( stepForwardButton );

    // Blow up the play/pause button slightly when paused.  The PhET convention is to do this for sims where interaction
    // does NOT unpause the sim, which is true for all usages in this sim.
    model.playingProperty.lazyLink( function( isPlaying ) {
      playPauseButton.scale( isPlaying ? ( 1 / PAUSE_SIZE_INCREASE_FACTOR ) : PAUSE_SIZE_INCREASE_FACTOR );
    } );

    this.mutate( options );
  }

  massesAndSprings.register( 'MASPlayPauseStepControl', MASPlayPauseStepControl );

  return inherit( Node, MASPlayPauseStepControl );
} );