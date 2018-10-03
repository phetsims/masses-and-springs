// Copyright 2016-2018, University of Colorado Boulder

/**
 * Lab model (base type) for Masses and Springs
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var PeriodTrace = require( 'MASSES_AND_SPRINGS/lab/model/PeriodTrace' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var MassesAndSpringsModel = require( 'MASSES_AND_SPRINGS/common/model/MassesAndSpringsModel' );

  // constants
  var MASS_X_POSITION = 0.625;
  var MASS_OFFSET = 0.15;

  /**
   * @param {Tandem} tandem
   * @param {object} options
   *
   * @constructor
   */
  function LabModel( tandem, options ) {

    MassesAndSpringsModel.call( this, tandem, options );

    // Lab screen should have spring damping
    this.dampingProperty = new NumberProperty( 0.0575 );

    this.createSpring( MassesAndSpringsConstants.SPRING_X, tandem.createTandem( 'spring' ) );
    this.firstSpring = this.springs[ 0 ];

    this.createMass( 0.100, MASS_X_POSITION, 'rgb(247,151,34)', null, tandem.createTandem( 'adjustableMass' ), {
      adjustable: true
    } );
    this.createMass( 0.230, MASS_X_POSITION + MASS_OFFSET * 1.5, 'rgb( 128, 197, 237)', null, tandem.createTandem( 'largeLabeledMass' ), {
      density: 110,
      mysteryLabel: true
    } );
    this.createMass( 0.370, MASS_X_POSITION + MASS_OFFSET, 'rgb(255, 120, 120)', null, tandem.createTandem( 'smallLabeledMass' ), {
      density: 220,
      mysteryLabel: true
    } );

    // Initialize period trace.
    this.periodTrace = new PeriodTrace( this.springs[ 0 ], this.playingProperty );
  }

  massesAndSprings.register( 'LabModel', LabModel );

  return inherit( MassesAndSpringsModel, LabModel, {
    /**
     *
     * @public
     */
    reset: function() {
      MassesAndSpringsModel.prototype.reset.call( this );
    }
  } );
} );