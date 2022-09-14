// Copyright 2016-2022, University of Colorado Boulder

/**
 * main file for the "Energy" screen
 * @author Denzell Barnett (PhET Interactive Simulations)
 */

import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import { Image } from '../../../scenery/js/imports.js';
import energyScreenIcon_png from '../../images/energyScreenIcon_png.js';
import MassesAndSpringsColors from '../common/view/MassesAndSpringsColors.js';
import massesAndSprings from '../massesAndSprings.js';
import MassesAndSpringsStrings from '../MassesAndSpringsStrings.js';
import EnergyModel from './model/EnergyModel.js';
import EnergyScreenView from './view/EnergyScreenView.js';

class EnergyScreen extends Screen {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {

    const options = {
      name: MassesAndSpringsStrings.screen.energyStringProperty,
      backgroundColorProperty: MassesAndSpringsColors.backgroundProperty,
      homeScreenIcon: new ScreenIcon( new Image( energyScreenIcon_png ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } ),
      tandem: tandem
    };

    super(
      () => new EnergyModel( tandem.createTandem( 'model' ) ),
      model => new EnergyScreenView( model, tandem.createTandem( 'view' ) ),
      options
    );
  }
}

massesAndSprings.register( 'EnergyScreen', EnergyScreen );
export default EnergyScreen;