// Copyright 2016-2019, University of Colorado Boulder

/**
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */

import Screen from '../../../joist/js/Screen.js';
import inherit from '../../../phet-core/js/inherit.js';
import Image from '../../../scenery/js/nodes/Image.js';
import vectorHomeScreenImage from '../../images/vectors_screen_icon_png.js';
import MassesAndSpringsModel from '../common/model/MassesAndSpringsModel.js';
import MassesAndSpringsColorProfile from '../common/view/MassesAndSpringsColorProfile.js';
import massesAndSpringsStrings from '../masses-and-springs-strings.js';
import massesAndSprings from '../massesAndSprings.js';
import VectorsScreenView from './view/VectorsScreenView.js';

const screenVectorsString = massesAndSpringsStrings.screen.vectors;

// image

/**
 * @param {Tandem} tandem
 *
 * @constructor
 */
function VectorsScreen( tandem ) {

  const options = {
    name: screenVectorsString,
    backgroundColorProperty: MassesAndSpringsColorProfile.backgroundProperty,
    homeScreenIcon: new Image( vectorHomeScreenImage ),
    tandem: tandem
  };

  Screen.call( this,
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

massesAndSprings.register( 'VectorsScreen', VectorsScreen );

inherit( Screen, VectorsScreen );
export default VectorsScreen;