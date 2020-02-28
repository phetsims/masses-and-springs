// Copyright 2016-2020, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */

import Sim from '../../joist/js/Sim.js';
import SimLauncher from '../../joist/js/SimLauncher.js';
import Tandem from '../../tandem/js/Tandem.js';
import EnergyScreen from './energy/EnergyScreen.js';
import IntroScreen from './intro/IntroScreen.js';
import LabScreen from './lab/LabScreen.js';
import massesAndSpringsStrings from './masses-and-springs-strings.js';
import VectorsScreen from './vectors/VectorsScreen.js';

const massesAndSpringsTitleString = massesAndSpringsStrings[ 'masses-and-springs' ].title;

// constants
const tandem = Tandem.ROOT;

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