// Copyright 2016-2018, University of Colorado Boulder

/**
 * main file for the "Energy" screen
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const EnergyModel = require( 'MASSES_AND_SPRINGS/energy/model/EnergyModel' );
  const EnergyScreenView = require( 'MASSES_AND_SPRINGS/energy/view/EnergyScreenView' );
  const Image = require( 'SCENERY/nodes/Image' );
  const inherit = require( 'PHET_CORE/inherit' );
  const massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  const MassesAndSpringsColorProfile = require( 'MASSES_AND_SPRINGS/common/view/MassesAndSpringsColorProfile' );
  const Screen = require( 'JOIST/Screen' );

  // strings
  const screenEnergyString = require( 'string!MASSES_AND_SPRINGS/screen.energy' );

  // image
  const energyHomeScreenImage = require( 'image!MASSES_AND_SPRINGS/energy_screen_icon.png' );

  /**
   * @param {Tandem} tandem
   *
   * @constructor
   */
  function EnergyScreen( tandem ) {

    var options = {
      name: screenEnergyString,
      backgroundColorProperty: MassesAndSpringsColorProfile.backgroundProperty,
      homeScreenIcon: new Image( energyHomeScreenImage ),
      tandem: tandem
    };

    Screen.call( this,
      function() {
        return new EnergyModel( tandem.createTandem( 'model' ) );
      },
      function( model ) {
        return new EnergyScreenView( model, tandem.createTandem( 'view' ) );
      },
      options
    );
  }

  massesAndSprings.register( 'EnergyScreen', EnergyScreen );

  return inherit( Screen, EnergyScreen );
} );