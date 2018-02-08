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
    // TODO: Think about creating mass objects above, and then passing into the constructor (instead of having to function-call to create, and then index into to modify)

    MassesAndSpringsModel.call( this, tandem );

    // Lab screen should have spring damping
    this.dampingProperty.set( 0.2 );

    this.createSpring( MassesAndSpringsConstants.RIGHT_SPRING_X - .01, tandem.createTandem( 'spring' ) );

    this.createMass( 0.100, MASS_X_POSITION, 'rgb(247,151,34)', null, tandem.createTandem( 'adjustableMass' ) );
    this.createMass( 0.300, MASS_X_POSITION + MASS_OFFSET, 'rgb(255, 120, 120)', null, tandem.createTandem( 'smallLabeledMass' ) );
    this.createMass( 0.230, MASS_X_POSITION + MASS_OFFSET * 2, 'rgb( 128, 197, 237)', null, tandem.createTandem( 'largeLabeledMass' ) );

    this.masses[ 0 ].adjustable = true;
    this.masses[ 1 ].options.mysteryLabel = true;
    this.masses[ 2 ].options.mysteryLabel = true;
    this.masses[ 1 ].options.densityProperty.set( 190 );
    this.masses[ 2 ].options.densityProperty.set( 100 );
  }

  massesAndSprings.register( 'LabModel', LabModel );

  return inherit( MassesAndSpringsModel, LabModel, {
    reset: function() {
      MassesAndSpringsModel.prototype.reset.call( this );
      this.dampingProperty.set( 0.2 );
    }
  } );
} );