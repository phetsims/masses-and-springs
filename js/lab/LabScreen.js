// Copyright 2016-2017, University of Colorado Boulder

/**
 *  main file for the "Lab" screen
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Color = require( 'SCENERY/util/Color' );
  var ColorIO = require( 'SCENERY/util/ColorIO' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LabModel = require( 'MASSES_AND_SPRINGS/lab/model/LabModel' );
  var LabScreenView = require( 'MASSES_AND_SPRINGS/lab/view/LabScreenView' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var Property = require( 'AXON/Property' );
  var PropertyIO = require( 'AXON/PropertyIO' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var screenLabString = require( 'string!MASSES_AND_SPRINGS/screen.lab' );

  // image
  var labHomeScreenImage = require( 'image!MASSES_AND_SPRINGS/lab_screen_icon.png' );

  /**
   * @param {Tandem} tandem
   *
   * @constructor
   */
  function LabScreen( tandem ) {

    var options = {
      name: screenLabString,
      backgroundColorProperty: new Property( new Color( 'white' ), {
        tandem: tandem.createTandem( 'backgroundColorProperty' ),
        phetioType: PropertyIO( ColorIO ),
        maxDT: 1
      } ),
      homeScreenIcon: new Image( labHomeScreenImage ),
      tandem: tandem
    };

    Screen.call( this,
      function() {
        return new LabModel( tandem.createTandem( 'model' ) );
      },
      function( model ) {
        return new LabScreenView( model, tandem.createTandem( 'view' ) );
      },
      options
    );
  }

  massesAndSprings.register( 'LabScreen', LabScreen );

  return inherit( Screen, LabScreen );
} );
