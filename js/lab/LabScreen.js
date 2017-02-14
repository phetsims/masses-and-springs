// Copyright 2016, University of Colorado Boulder

/**
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var MassesAndSpringsModel = require( 'MASSES_AND_SPRINGS/common/model/MassesAndSpringsModel' );
  var LabScreenView = require( 'MASSES_AND_SPRINGS/lab/view/LabScreenView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Screen = require( 'JOIST/Screen' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var Property = require( 'AXON/Property' );

  // strings
  var labString = require( 'string!MASSES_AND_SPRINGS/lab' );

  /**
   * @param {Tandem} tandem
   *
   * @constructor
   */
  function LabScreen( tandem ) {

    var options = {
      name: labString,
      backgroundColorProperty: new Property( 'white' )
    };

    Screen.call( this,
      function() { return new MassesAndSpringsModel( tandem.createTandem( 'model' ) ); },
      function( model ) { return new LabScreenView( model, tandem.createTandem( 'view' ) ); },
      options
    );
  }

  massesAndSprings.register( 'LabScreen', LabScreen );

  return inherit( Screen, LabScreen );
} );
