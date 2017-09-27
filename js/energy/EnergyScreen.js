// Copyright 2016-2017, University of Colorado Boulder

/**
 * main file for the "Energy" screen
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Color = require( 'SCENERY/util/Color' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var MassesAndSpringsModel = require( 'MASSES_AND_SPRINGS/common/model/MassesAndSpringsModel' );
  var OneSpringView = require( 'MASSES_AND_SPRINGS/common/view/OneSpringView' );
  var Property = require( 'AXON/Property' );
  var Screen = require( 'JOIST/Screen' );
  var TColor = require( 'SCENERY/util/TColor' );

  // strings
  var energyString = require( 'string!MASSES_AND_SPRINGS/energy' );

  // image
  var energyHomescreenImage = require( 'image!MASSES_AND_SPRINGS/game-home-screen.png' );
  var energyNavbarImage = require( 'image!MASSES_AND_SPRINGS/game-nav-bar.png' );

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
      homeScreenIcon: new Image( energyHomescreenImage ),
      navigationBarIcon: new Image( energyNavbarImage ),
      tandem: tandem
    };

    Screen.call( this,
      function() {
        return new MassesAndSpringsModel( tandem.createTandem( 'model' ), {
          springCount: 1,
          vectorViewEnabled: false
        } );
      },
      function( model ) { return new OneSpringView( model, tandem.createTandem( 'view' ) ); },
      options
    );
  }

  massesAndSprings.register( 'EnergyScreen', EnergyScreen );

  return inherit( Screen, EnergyScreen );
} );