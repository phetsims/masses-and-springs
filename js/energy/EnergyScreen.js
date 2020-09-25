// Copyright 2016-2020, University of Colorado Boulder

/**
 * main file for the "Energy" screen
 * @author Denzell Barnett (PhET Interactive Simulations)
 */

import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import Image from '../../../scenery/js/nodes/Image.js';
import energyHomeScreenImage from '../../images/energy_screen_icon_png.js';
import MassesAndSpringsColorProfile from '../common/view/MassesAndSpringsColorProfile.js';
import massesAndSprings from '../massesAndSprings.js';
import massesAndSpringsStrings from '../massesAndSpringsStrings.js';
import EnergyModel from './model/EnergyModel.js';
import EnergyScreenView from './view/EnergyScreenView.js';

class EnergyScreen extends Screen {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {

    const options = {
      name: massesAndSpringsStrings.screen.energy,
      backgroundColorProperty: MassesAndSpringsColorProfile.backgroundProperty,
      homeScreenIcon: new ScreenIcon( new Image( energyHomeScreenImage ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } ),
      tandem: tandem
    };

    super(
      function() {
        return new EnergyModel( tandem.createTandem( 'model' ) );
      },
      function( model ) {
        return new EnergyScreenView( model, tandem.createTandem( 'view' ) );
      },
      options
    );
  }
}

massesAndSprings.register( 'EnergyScreen', EnergyScreen );
export default EnergyScreen;