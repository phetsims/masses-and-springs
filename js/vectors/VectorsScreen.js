// Copyright 2016-2020, University of Colorado Boulder

/**
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */

import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import Image from '../../../scenery/js/nodes/Image.js';
import vectorHomeScreenImage from '../../images/vectors_screen_icon_png.js';
import MassesAndSpringsModel from '../common/model/MassesAndSpringsModel.js';
import MassesAndSpringsColorProfile from '../common/view/MassesAndSpringsColorProfile.js';
import massesAndSprings from '../massesAndSprings.js';
import massesAndSpringsStrings from '../massesAndSpringsStrings.js';
import VectorsScreenView from './view/VectorsScreenView.js';

class VectorsScreen extends Screen {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {

    const options = {
      name: massesAndSpringsStrings.screen.vectors,
      backgroundColorProperty: MassesAndSpringsColorProfile.backgroundProperty,
      homeScreenIcon: new ScreenIcon( new Image( vectorHomeScreenImage ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } ),
      tandem: tandem
    };

    super(
      function() {
        const modelTandem = tandem.createTandem( 'model' );
        const model = new MassesAndSpringsModel( modelTandem );
        model.basicsVersion = false;
        model.addDefaultSprings( modelTandem );
        model.addDefaultMasses( modelTandem );
        return model;
      },
      function( model ) { return new VectorsScreenView( model, tandem.createTandem( 'view' ) ); },
      options
    );
  }
}

massesAndSprings.register( 'VectorsScreen', VectorsScreen );
export default VectorsScreen;