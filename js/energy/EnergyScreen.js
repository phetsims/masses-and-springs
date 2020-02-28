// Copyright 2016-2020, University of Colorado Boulder

/**
 * main file for the "Energy" screen
 * @author Denzell Barnett (PhET Interactive Simulations)
 */

import Screen from '../../../joist/js/Screen.js';
import inherit from '../../../phet-core/js/inherit.js';
import Image from '../../../scenery/js/nodes/Image.js';
import energyHomeScreenImage from '../../images/energy_screen_icon_png.js';
import MassesAndSpringsColorProfile from '../common/view/MassesAndSpringsColorProfile.js';
import massesAndSpringsStrings from '../masses-and-springs-strings.js';
import massesAndSprings from '../massesAndSprings.js';
import EnergyModel from './model/EnergyModel.js';
import EnergyScreenView from './view/EnergyScreenView.js';

const screenEnergyString = massesAndSpringsStrings.screen.energy;

// image

/**
 * @param {Tandem} tandem
 *
 * @constructor
 */
function EnergyScreen( tandem ) {

  const options = {
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

inherit( Screen, EnergyScreen );
export default EnergyScreen;