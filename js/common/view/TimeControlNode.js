// Copyright 2017-2018, University of Colorado Boulder

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
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PlayPauseButton = require( 'SCENERY_PHET/buttons/PlayPauseButton' );
  var StepForwardButton = require( 'SCENERY_PHET/buttons/StepForwardButton' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VerticalAquaRadioButtonGroup = require( 'SUN/VerticalAquaRadioButtonGroup' );


  // strings
  var normalString = require( 'string!MASSES_AND_SPRINGS/normal' );
  var slowString = require( 'string!MASSES_AND_SPRINGS/slow' );

  // constants
  var FONT = new PhetFont( 14 );

  /**
   * @param {MassesAndSpringsModel} model
   * @param {Bounds2} visibleBounds - Bounds of screenview in screenview coordinates
   * @param {Tandem} tandem
   * @param {Object} options
   * @constructor
   */
  function TimeControlNode( model, visibleBounds, tandem, options ) {
    Node.call( this );

    var playPauseButton = new PlayPauseButton( model.playingProperty, {
      radius: 20,
      touchAreaDilation: 5,
      tandem: tandem.createTandem( 'playPauseButton' )
    } );

    // Radio buttons for normal annd slow speed
    var timeSpeedRadioNode = new VerticalAquaRadioButtonGroup( [ {
      property: model.simSpeedProperty,
      value: 'normal',
      node: new Text( normalString, { font: FONT } )
    }, {
      property: model.simSpeedProperty,
      value: 'slow',
      node: new Text( slowString, { font: FONT } )
    }
    ], {
      radius: new Text( 'test', { font: FONT } ).height / 2.2,
      spacing: 9,
      touchAreaXDilation: 10,
      radioButtonOptions: { xSpacing: 5 },
      maxWidth: 150
    } );

    // Sim play/pause buttons
    var timeControlHBox = new HBox( {
      spacing: 10,
      children: [
        playPauseButton,
        new StepForwardButton( {
          playingProperty: model.playingProperty,
          listener: function() { model.stepForward( 0.01 ); },
          radius: 15,
          touchAreaDilation: 5,
          tandem: tandem.createTandem( 'stepForwardButton' )
        } )
      ]
    } );

    timeSpeedRadioNode.left = timeControlHBox.right + 40;
    this.addChild( timeControlHBox );
    this.addChild( timeSpeedRadioNode );
    this.mutate( options );
  }

  massesAndSprings.register( 'TimeControlNode', TimeControlNode );

  return inherit( Node, TimeControlNode );
} );
