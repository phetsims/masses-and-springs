// Copyright 2016-2022, University of Colorado Boulder

/**
 *  main file for the "Lab" screen
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */

import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import { Image } from '../../../scenery/js/imports.js';
import labScreenIcon_png from '../../images/labScreenIcon_png.js';
import MassesAndSpringsColors from '../common/view/MassesAndSpringsColors.js';
import massesAndSprings from '../massesAndSprings.js';
import MassesAndSpringsStrings from '../MassesAndSpringsStrings.js';
import LabModel from './model/LabModel.js';
import LabScreenView from './view/LabScreenView.js';

class LabScreen extends Screen {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {

    const options = {
      name: MassesAndSpringsStrings.screen.labStringProperty,
      backgroundColorProperty: MassesAndSpringsColors.backgroundProperty,
      homeScreenIcon: new ScreenIcon( new Image( labScreenIcon_png ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } ),
      tandem: tandem
    };

    super(
      () => new LabModel( tandem.createTandem( 'model' ), false ),
      model => new LabScreenView( model, tandem.createTandem( 'view' ) ),
      options
    );
  }
}

massesAndSprings.register( 'LabScreen', LabScreen );
export default LabScreen;