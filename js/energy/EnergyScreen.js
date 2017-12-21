// Copyright 2016-2017, University of Colorado Boulder

/**
 * main file for the "Energy" screen
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Color = require( 'SCENERY/util/Color' );
  var ColorIO = require( 'SCENERY/util/ColorIO' );
  var EnergyModel = require( 'MASSES_AND_SPRINGS/energy/model/EnergyModel' );
  var EnergyScreenView = require( 'MASSES_AND_SPRINGS/energy/view/EnergyScreenView' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var Property = require( 'AXON/Property' );
  var PropertyIO = require( 'AXON/PropertyIO' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var screenEnergyString = require( 'string!MASSES_AND_SPRINGS/screen.energy' );

  // image
  var energyHomeScreenImage = require( 'image!MASSES_AND_SPRINGS/energy_screen_icon.png' );

  /**
   * @param {Tandem} tandem
   *
   * @constructor
   */
  function EnergyScreen( tandem ) {

    var options = {
      name: screenEnergyString,
      backgroundColorProperty: new Property( new Color( 'white' ), {
        tandem: tandem.createTandem( 'backgroundColorProperty' ),
        phetioType: PropertyIO( ColorIO )
      } ),
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