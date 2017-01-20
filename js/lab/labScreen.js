// Copyright 2016, University of Colorado Boulder

/**
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var MassesAndSpringsModel = require( 'MASSES_AND_SPRINGS/masses-and-springs/model/MassesAndSpringsModel' );
  var LabScreenView = require( 'MASSES_AND_SPRINGS/lab/view/LabScreenView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Screen = require( 'JOIST/Screen' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var Property = require( 'AXON/Property' );
  var Color = require( 'SCENERY/util/Color' );

  // strings
  var labString = require( 'string!MASSES_AND_SPRINGS/lab' );

  /**
   * @constructor
   */
  function LabScreen() {

    var options = {
      name: labString,
      backgroundColorProperty: new Property( Color.toColor( 'white' ) )
    };

    Screen.call( this,
      function() { return new MassesAndSpringsModel(); },
      function( model ) { return new LabScreenView( model ); },
      options
    );
  }

  massesAndSprings.register( 'LabScreen', LabScreen );

  return inherit( Screen, LabScreen );
} );