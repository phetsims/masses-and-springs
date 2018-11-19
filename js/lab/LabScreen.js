// Copyright 2016-2018, University of Colorado Boulder

/**
 *  main file for the "Lab" screen
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LabModel = require( 'MASSES_AND_SPRINGS/lab/model/LabModel' );
  var LabScreenView = require( 'MASSES_AND_SPRINGS/lab/view/LabScreenView' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var MassesAndSpringsColorProfile = require( 'MASSES_AND_SPRINGS/common/view/MassesAndSpringsColorProfile' );
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
      backgroundColorProperty: MassesAndSpringsColorProfile.backgroundProperty,
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
