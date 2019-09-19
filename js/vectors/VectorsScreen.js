// Copyright 2016-2019, University of Colorado Boulder

/**
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Image = require( 'SCENERY/nodes/Image' );
  const inherit = require( 'PHET_CORE/inherit' );
  const massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  const MassesAndSpringsColorProfile = require( 'MASSES_AND_SPRINGS/common/view/MassesAndSpringsColorProfile' );
  const MassesAndSpringsModel = require( 'MASSES_AND_SPRINGS/common/model/MassesAndSpringsModel' );
  const Screen = require( 'JOIST/Screen' );
  const VectorsScreenView = require( 'MASSES_AND_SPRINGS/vectors/view/VectorsScreenView' );

  // strings
  const screenVectorsString = require( 'string!MASSES_AND_SPRINGS/screen.vectors' );

  // image
  const vectorHomeScreenImage = require( 'image!MASSES_AND_SPRINGS/vectors_screen_icon.png' );

  /**
   * @param {Tandem} tandem
   *
   * @constructor
   */
  function VectorsScreen( tandem ) {

    var options = {
      name: screenVectorsString,
      backgroundColorProperty: MassesAndSpringsColorProfile.backgroundProperty,
      homeScreenIcon: new Image( vectorHomeScreenImage ),
      tandem: tandem
    };

    Screen.call( this,
      function() {
        var modelTandem = tandem.createTandem( 'model' );
        var model = new MassesAndSpringsModel( modelTandem );
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

  return inherit( Screen, VectorsScreen );
} );
