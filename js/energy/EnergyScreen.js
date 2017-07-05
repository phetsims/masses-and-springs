// Copyright 2016, University of Colorado Boulder

/**
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var EnergyModel = require( 'MASSES_AND_SPRINGS/energy/model/EnergyModel' );
  var EnergyScreenView = require( 'MASSES_AND_SPRINGS/energy/view/EnergyScreenView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Screen = require( 'JOIST/Screen' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var Property = require( 'AXON/Property' );
  var Color = require( 'SCENERY/util/Color' );
  var TColor = require( 'SCENERY/util/TColor' );

  // strings
  var energyString = require( 'string!MASSES_AND_SPRINGS/energy' );

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
      tandem: tandem
    };

    Screen.call( this,
      function() { return new EnergyModel( tandem.createTandem( 'model' ) ); },
      function( model ) { return new EnergyScreenView( model, tandem.createTandem( 'view' ) ); },
      options
    );
  }

  massesAndSprings.register( 'EnergyScreen', EnergyScreen );

  return inherit( Screen, EnergyScreen );
} );