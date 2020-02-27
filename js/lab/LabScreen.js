// Copyright 2016-2019, University of Colorado Boulder

/**
 *  main file for the "Lab" screen
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */

import Screen from '../../../joist/js/Screen.js';
import inherit from '../../../phet-core/js/inherit.js';
import Image from '../../../scenery/js/nodes/Image.js';
import labHomeScreenImage from '../../images/lab_screen_icon_png.js';
import MassesAndSpringsColorProfile from '../common/view/MassesAndSpringsColorProfile.js';
import massesAndSpringsStrings from '../masses-and-springs-strings.js';
import massesAndSprings from '../massesAndSprings.js';
import LabModel from './model/LabModel.js';
import LabScreenView from './view/LabScreenView.js';

const screenLabString = massesAndSpringsStrings.screen.lab;

// image

/**
 * @param {Tandem} tandem
 *
 * @constructor
 */
function LabScreen( tandem ) {

  const options = {
    name: screenLabString,
    backgroundColorProperty: MassesAndSpringsColorProfile.backgroundProperty,
    homeScreenIcon: new Image( labHomeScreenImage ),
    tandem: tandem
  };

  Screen.call( this,
    function() {
      return new LabModel( tandem.createTandem( 'model' ), false );
    },
    function( model ) {
      return new LabScreenView( model, tandem.createTandem( 'view' ) );
    },
    options
  );
}

massesAndSprings.register( 'LabScreen', LabScreen );

inherit( Screen, LabScreen );
export default LabScreen;