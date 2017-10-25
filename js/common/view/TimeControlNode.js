// Copyright 2017, University of Colorado Boulder

/**
 * Object that combines the play/pause button and the stepforward button.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PlayPauseButton = require( 'SCENERY_PHET/buttons/PlayPauseButton' );
  var StepForwardButton = require( 'SCENERY_PHET/buttons/StepForwardButton' );

  // constants
  var TOUCH_AREA_DILATION = 4;
  var STROKE = 'black';
  var FILL = '#005566';
  var PAUSE_SIZE_INCREASE_FACTOR = 1.25;

  /**
   * @param {MassesAndSpringsModel} model
   * @param {Bounds2} visibleBounds - Bounds of screenview in screenview coordinates
   * @param {Tandem} tandem
   * @param {Object} options
   * @constructor
   */
  // TODO: Rename to TimeControlPanel, and rename vars/tandems at usage sites
  function TimeControlNode( model, visibleBounds, tandem, options ) {
    Node.call( this );
    var modelViewTransform = MassesAndSpringsConstants.MODEL_VIEW_TRANSFORM( visibleBounds, 0.98 );

    // Play/Pause Button
    var playPauseButton = new PlayPauseButton( model.playingProperty, {
      right: visibleBounds.right * 0.65,
      bottom: modelViewTransform.modelToViewY( MassesAndSpringsConstants.FLOOR_Y ),
      radius: 18,
      touchAreaDilation: TOUCH_AREA_DILATION,
      tandem: tandem.createTandem( 'playPauseButton' )
    } );

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

    // Blow up the play/pause button slightly when paused.  The PhET convention is to do this for sims where interaction
    // does NOT unpause the sim, which is true for all usages in this sim.
    model.playingProperty.lazyLink( function( isPlaying ) {
      playPauseButton.scale( isPlaying ? ( 1 / PAUSE_SIZE_INCREASE_FACTOR ) : PAUSE_SIZE_INCREASE_FACTOR );
    } );
    this.addChild( new HBox( {
      children: [ playPauseButton, stepForwardButton ],
      spacing: 10
    } ) );

    this.mutate( options );
  }

  massesAndSprings.register( 'TimeControlNode', TimeControlNode );

  return inherit( Node, TimeControlNode );
} );
