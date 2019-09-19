// Copyright 2016-2018, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const EnergyScreen = require( 'MASSES_AND_SPRINGS/energy/EnergyScreen' );
  const IntroScreen = require( 'MASSES_AND_SPRINGS/intro/IntroScreen' );
  const LabScreen = require( 'MASSES_AND_SPRINGS/lab/LabScreen' );
  const Sim = require( 'JOIST/Sim' );
  const SimLauncher = require( 'JOIST/SimLauncher' );
  const Tandem = require( 'TANDEM/Tandem' );
  const VectorsScreen = require( 'MASSES_AND_SPRINGS/vectors/VectorsScreen' );

  // strings
  const massesAndSpringsTitleString = require( 'string!MASSES_AND_SPRINGS/masses-and-springs.title' );

  // constants
  const tandem = Tandem.rootTandem;

  const simOptions = {
    credits: {
      leadDesign: 'Amy Rouinfar, Mike Dubson',
      softwareDevelopment: 'Denzell Barnett, Matt Pennington',
      team: 'Wendy Adams, Ariel Paul, Kathy Perkins',
      qualityAssurance:
        'Steele Dalton, Bryce Griebenow, Ethan Johnson, Megan Lai, Liam Mulhall, Arnab Purkayastha, Benjamin Roberts, Jacob Romero, Clara Wilson, Kathryn Woessner'
    }
  };

  SimLauncher.launch( function() {
    const sim = new Sim( massesAndSpringsTitleString, [
      new IntroScreen( tandem.createTandem( 'introScreen' ) ),
      new VectorsScreen( tandem.createTandem( 'vectorsScreen' ) ),
      new EnergyScreen( tandem.createTandem( 'energyScreen' ) ),
      new LabScreen( tandem.createTandem( 'labScreen' ) )
    ], simOptions );
    sim.start();
  } );
} );
