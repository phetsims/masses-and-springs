// Copyright 2016-2017, University of Colorado Boulder

/**
 * Lab model (base type) for Masses and Springs
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var MassesAndSpringsModel = require( 'MASSES_AND_SPRINGS/common/model/MassesAndSpringsModel' );

  // constants
  var MASS_X_POSITION = 0.625;
  var MASS_OFFSET = 0.075;

  /**
   * @constructor
   */
  function LabModel( tandem ) {

    MassesAndSpringsModel.call( this, tandem );

    // Lab screen should have spring damping
    this.dampingProperty.set( 0.2 );

    this.createSpring( MassesAndSpringsConstants.RIGHT_SPRING_X - .01, tandem.createTandem( 'spring' ) );

    this.createMass( 0.100, MASS_X_POSITION, true, 'rgb(247,151,34)', null, tandem.createTandem( 'adjustableMass' ) );
    this.createMass( 0.125, MASS_X_POSITION + MASS_OFFSET, true, 'red', null, tandem.createTandem( 'redLabeledMass' ) );
    this.createMass( 0.150, MASS_X_POSITION + MASS_OFFSET * 2, true, 'green', null, tandem.createTandem( 'greenLabeledMass' ) );

    this.masses[ 0 ].adjustable = true;
    this.masses[ 1 ].options.mysteryLabel = true;
    this.masses[ 2 ].options.mysteryLabel = true;
  }

  massesAndSprings.register( 'LabModel', LabModel );

  return inherit( MassesAndSpringsModel, LabModel, {
    reset: function() {
      MassesAndSpringsModel.prototype.reset.call( this );
      this.dampingProperty.set( 0.2 );
    }
  } );
} );