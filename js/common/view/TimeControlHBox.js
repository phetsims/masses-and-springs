// Copyright 2017-2018, University of Colorado Boulder

/**
 * HBox that combines the play/pause button and the stepforward button with the sim speed controls.
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
  var PlayPauseButton = require( 'SCENERY_PHET/buttons/PlayPauseButton' );
  var SimSpeedChoice = require( 'MASSES_AND_SPRINGS/common/enum/SimSpeedChoice' );
  var StepForwardButton = require( 'SCENERY_PHET/buttons/StepForwardButton' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VerticalAquaRadioButtonGroup = require( 'SUN/VerticalAquaRadioButtonGroup' );


  // strings
  var normalString = require( 'string!MASSES_AND_SPRINGS/normal' );
  var slowString = require( 'string!MASSES_AND_SPRINGS/slow' );

  /**
   * @param {MassesAndSpringsModel} model
   * @param {Tandem} tandem
   * @param {Object} options
   * @constructor
   */
  function TimeControlHBox( model, tandem, options ) {
    HBox.call( this, { spacing: 40 } );

    var playPauseButton = new PlayPauseButton( model.playingProperty, {
      radius: 20,
      touchAreaDilation: 5,
      tandem: tandem.createTandem( 'playPauseButton' )
    } );

    // Radio buttons for normal and slow speed
    var timeSpeedRadioNode = new VerticalAquaRadioButtonGroup( [ {
      property: model.simSpeedProperty,
      value: SimSpeedChoice.NORMAL,
      node: new Text( normalString, { font: MassesAndSpringsConstants.TITLE_FONT } )
    }, {
      property: model.simSpeedProperty,
      value: SimSpeedChoice.SLOW,
      node: new Text( slowString, { font: MassesAndSpringsConstants.TITLE_FONT } )
    }
    ], {
      radius: new Text( 'test', { font: MassesAndSpringsConstants.TITLE_FONT } ).height / 2.2,
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

    //REVIEW: Do these need precise vertical alignment, or can we wrap these in an HBox (TimeControlNode could inherit HBox?)
    this.addChild( timeControlHBox );
    this.addChild( timeSpeedRadioNode );
    this.mutate( options );
  }

  massesAndSprings.register( 'TimeControlHBox', TimeControlHBox );

  return inherit( HBox, TimeControlHBox );
} );
