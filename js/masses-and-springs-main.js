// Copyright 2016-2017, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var EnergyScreen = require( 'MASSES_AND_SPRINGS/energy/EnergyScreen' );
  var IntroScreen = require( 'MASSES_AND_SPRINGS/intro/IntroScreen' );
  var LabScreen = require( 'MASSES_AND_SPRINGS/lab/LabScreen' );
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );
  var Tandem = require( 'TANDEM/Tandem' );
  var VectorsScreen = require( 'MASSES_AND_SPRINGS/vectors/VectorsScreen' );

  // strings
  var massesAndSpringsTitleString = require( 'string!MASSES_AND_SPRINGS/masses-and-springs.title' );

  // constants
  var tandem = Tandem.rootTandem;

  var simOptions = {
    credits: {
      //TODO fill in proper credits, all of these fields are optional, see joist.AboutDialog
      leadDesign: 'Amy Rouinfar',
      softwareDevelopment: 'Denzell Barnett, Matt Pennington',
      team: 'Ariel Paul, Kathy Perkins, Mike Dubson',
      qualityAssurance: 'Steele Dalton'
    }
  };

  SimLauncher.launch( function() {
    var sim = new Sim( massesAndSpringsTitleString, [
      new IntroScreen( tandem.createTandem( 'introScreen' ) ),
      new VectorsScreen( tandem.createTandem( 'vectorsScreen' ) ),
      new EnergyScreen( tandem.createTandem( 'energyScreen' ) ),
      new LabScreen( tandem.createTandem( 'labScreen' ) )
    ], simOptions );
    sim.start();
  } );
} );
