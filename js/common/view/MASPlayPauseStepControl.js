// Copyright 2016, University of Colorado Boulder

/**
 * Object that combines the play/pause button and the stepforward button.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
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
   * @param {Bounds2} layoutBounds - Bounds of screenview in screenview coordinates
   * @param {Tandem} tandem
   * @param {Object} options
   * @constructor
   */
  // TODO: Rename to TimeControlPanel, and rename vars/tandems at usage sites
  function MASPlayPauseStepControl( model, layoutBounds, tandem, options ) {
    Node.call( this );
    var modelViewTransform2 = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      Vector2.ZERO,
      new Vector2( 0, layoutBounds.height * .98 ),
      397 );
    this.modelViewTransform2 = modelViewTransform2; // Make modelViewTransform2 available to descendant types.

    // Play/Pause Button
    var playPauseButton = new PlayPauseButton( model.playingProperty, {
      right: layoutBounds.right * .65,
      bottom: modelViewTransform2.modelToViewY( model.floorY ),
      radius: 18,
      touchAreaDilation: TOUCH_AREA_DILATION,
      tandem: tandem.createTandem( 'playPauseButton' )
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
      centerY: playPauseButton.centerY,
      tandem: tandem.createTandem( 'stepForwardButton' )
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
