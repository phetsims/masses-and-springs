// Copyright 2016-2019, University of Colorado Boulder

/**
 *  main file for the "Lab" screen
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Image = require( 'SCENERY/nodes/Image' );
  const inherit = require( 'PHET_CORE/inherit' );
  const LabModel = require( 'MASSES_AND_SPRINGS/lab/model/LabModel' );
  const LabScreenView = require( 'MASSES_AND_SPRINGS/lab/view/LabScreenView' );
  const massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  const MassesAndSpringsColorProfile = require( 'MASSES_AND_SPRINGS/common/view/MassesAndSpringsColorProfile' );
  const Screen = require( 'JOIST/Screen' );

  // strings
  const screenLabString = require( 'string!MASSES_AND_SPRINGS/screen.lab' );

  // image
  const labHomeScreenImage = require( 'image!MASSES_AND_SPRINGS/lab_screen_icon.png' );

  /**
   * @param {Tandem} tandem
   *
   * @constructor
   */
  function LabScreen( tandem ) {

    const options = {
      name: screenLabString,
      backgroundColorProperty: MassesAndSpringsColorProfile.backgroundProperty,
      homeScreenIcon: new Image( labHomeScreenImage ),
      tandem: tandem
    };

    Screen.call( this,
      function() {
        return new LabModel( tandem.createTandem( 'model' ), false );
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
