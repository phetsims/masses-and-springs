// Copyright 2016-2020, University of Colorado Boulder

/**
 * The Intro screen for Masses and Springs.
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */

import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import Image from '../../../scenery/js/nodes/Image.js';
import introHomeScreenImage from '../../images/intro_screen_icon_png.js';
import MassesAndSpringsColorProfile from '../common/view/MassesAndSpringsColorProfile.js';
import massesAndSprings from '../massesAndSprings.js';
import massesAndSpringsStrings from '../massesAndSpringsStrings.js';
import IntroModel from './model/IntroModel.js';
import IntroScreenView from './view/IntroScreenView.js';

class IntroScreen extends Screen {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {

    const options = {
      name: massesAndSpringsStrings.screen.intro,
      backgroundColorProperty: MassesAndSpringsColorProfile.backgroundProperty,
      homeScreenIcon: new ScreenIcon( new Image( introHomeScreenImage ), {
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