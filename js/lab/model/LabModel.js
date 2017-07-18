// Copyright 2016-2017, University of Colorado Boulder

/**
 * Energy model (base type) for Masses and Springs
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var MassesAndSpringsModel = require( 'MASSES_AND_SPRINGS/common/model/MassesAndSpringsModel' );

  /**
   * TODO:: document all properties and items set on objects (entire sim)
   * @constructor
   */
  function LabModel( tandem ) {
    MassesAndSpringsModel.call( this, tandem, { springCount: 1, showVectors: true } );

    var massXPosition = this.springs[ 0 ].positionProperty.get().x;
    this.masses.push( this.createMass( .125, massXPosition - .02, true, 'red', null, tandem.createTandem( 'redLabeledMass' ) ) );
    this.masses.push( this.createMass( .150, massXPosition + .05, true, 'green', null, tandem.createTandem( 'greenLabeledMass' ) ) );

  }

  massesAndSprings.register( 'LabModel', LabModel );

  return inherit( MassesAndSpringsModel, LabModel );
} );