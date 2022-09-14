// Copyright 2016-2022, University of Colorado Boulder

/**
 * The Intro screen for Masses and Springs.
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */

import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import { Image } from '../../../scenery/js/imports.js';
import introScreenIcon_png from '../../images/introScreenIcon_png.js';
import MassesAndSpringsColors from '../common/view/MassesAndSpringsColors.js';
import massesAndSprings from '../massesAndSprings.js';
import MassesAndSpringsStrings from '../MassesAndSpringsStrings.js';
import IntroModel from './model/IntroModel.js';
import IntroScreenView from './view/IntroScreenView.js';

class IntroScreen extends Screen {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {

    const options = {
      name: MassesAndSpringsStrings.screen.introStringProperty,
      backgroundColorProperty: MassesAndSpringsColors.backgroundProperty,
      homeScreenIcon: new ScreenIcon( new Image( introScreenIcon_png ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } ),
      tandem: tandem
    };

    super(
      () => new IntroModel( tandem.createTandem( 'model' ) ),
      model => new IntroScreenView( model, tandem.createTandem( 'view' ) ),
      options
    );
  }
}

massesAndSprings.register( 'IntroScreen', IntroScreen );
export default IntroScreen;