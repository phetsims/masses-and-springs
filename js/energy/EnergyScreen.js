// Copyright 2016-2017, University of Colorado Boulder

/**
 * main file for the "Energy" screen
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Color = require( 'SCENERY/util/Color' );
  var EnergyModel = require( 'MASSES_AND_SPRINGS/energy/model/EnergyModel' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var EnergyScreenView = require( 'MASSES_AND_SPRINGS/energy/view/EnergyScreenView' );
  var Property = require( 'AXON/Property' );
  var Screen = require( 'JOIST/Screen' );
  var TColor = require( 'SCENERY/util/TColor' );

  // strings
  var energyString = require( 'string!MASSES_AND_SPRINGS/energy' );

  // image
  var energyHomeScreenImage = require( 'image!MASSES_AND_SPRINGS/energy_screen_icon.png' );

  /**
   * @param {Tandem} tandem
   *
   * @constructor
   */
  function EnergyScreen( tandem ) {

    var options = {
      name: energyString,
      backgroundColorProperty: new Property( new Color( 'white' ), {
        tandem: tandem.createTandem( 'backgroundColorProperty' ),
        phetioValueType: TColor,
        maxDT: 1
      } ),
      homeScreenIcon: new Image( energyHomeScreenImage ),
      navigationBarIcon: new Image( energyHomeScreenImage ),
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