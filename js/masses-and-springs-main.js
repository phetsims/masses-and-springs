// Copyright 2016-2022, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */

import Sim from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import Tandem from '../../tandem/js/Tandem.js';
import EnergyScreen from './energy/EnergyScreen.js';
import IntroScreen from './intro/IntroScreen.js';
import LabScreen from './lab/LabScreen.js';
import MassesAndSpringsStrings from './MassesAndSpringsStrings.js';
import VectorsScreen from './vectors/VectorsScreen.js';

const massesAndSpringsTitleStringProperty = MassesAndSpringsStrings[ 'masses-and-springs' ].titleStringProperty;

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

simLauncher.launch( () => {
  const sim = new Sim( massesAndSpringsTitleStringProperty, [
    new IntroScreen( tandem.createTandem( 'introScreen' ) ),
    new VectorsScreen( tandem.createTandem( 'vectorsScreen' ) ),
    new EnergyScreen( tandem.createTandem( 'energyScreen' ) ),
    new LabScreen( tandem.createTandem( 'labScreen' ) )
  ], simOptions );
  sim.start();
} );