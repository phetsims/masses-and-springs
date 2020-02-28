// Copyright 2016-2020, University of Colorado Boulder

/**
 * The Intro screen for Masses and Springs.
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */

import Screen from '../../../joist/js/Screen.js';
import inherit from '../../../phet-core/js/inherit.js';
import Image from '../../../scenery/js/nodes/Image.js';
import introHomeScreenImage from '../../images/intro_screen_icon_png.js';
import MassesAndSpringsColorProfile from '../common/view/MassesAndSpringsColorProfile.js';
import massesAndSpringsStrings from '../masses-and-springs-strings.js';
import massesAndSprings from '../massesAndSprings.js';
import IntroModel from './model/IntroModel.js';
import IntroScreenView from './view/IntroScreenView.js';

const screenIntroString = massesAndSpringsStrings.screen.intro;

// image

/**
 * @param {Tandem} tandem
 *
 * @constructor
 */
function IntroScreen( tandem ) {

  const options = {
    name: screenIntroString,
    backgroundColorProperty: MassesAndSpringsColorProfile.backgroundProperty,
    homeScreenIcon: new Image( introHomeScreenImage ),
    tandem: tandem
  };

  Screen.call( this,
    function() { return new IntroModel( tandem.createTandem( 'model' ) ); },
    function( model ) { return new IntroScreenView( model, tandem.createTandem( 'view' ) ); },
    options
  );
}

massesAndSprings.register( 'IntroScreen', IntroScreen );
inherit( Screen, IntroScreen );
export default IntroScreen;