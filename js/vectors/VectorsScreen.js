// Copyright 2016-2022, University of Colorado Boulder

/**
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */

import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import { Image } from '../../../scenery/js/imports.js';
import vectorsScreenIcon_png from '../../images/vectorsScreenIcon_png.js';
import MassesAndSpringsModel from '../common/model/MassesAndSpringsModel.js';
import MassesAndSpringsColors from '../common/view/MassesAndSpringsColors.js';
import massesAndSprings from '../massesAndSprings.js';
import MassesAndSpringsStrings from '../MassesAndSpringsStrings.js';
import VectorsScreenView from './view/VectorsScreenView.js';

class VectorsScreen extends Screen {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {

    const options = {
      name: MassesAndSpringsStrings.screen.vectorsStringProperty,
      backgroundColorProperty: MassesAndSpringsColors.backgroundProperty,
      homeScreenIcon: new ScreenIcon( new Image( vectorsScreenIcon_png ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } ),
      tandem: tandem
    };

    super(
      () => {
        const modelTandem = tandem.createTandem( 'model' );
        const model = new MassesAndSpringsModel( modelTandem );
        model.basicsVersion = false;
        model.addDefaultSprings( modelTandem );
        model.addDefaultMasses( modelTandem );
        return model;
      },
      model => new VectorsScreenView( model, tandem.createTandem( 'view' ) ),
      options
    );
  }
}

massesAndSprings.register( 'VectorsScreen', VectorsScreen );
export default VectorsScreen;