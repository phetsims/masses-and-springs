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
  var Mass = require( 'MASSES_AND_SPRINGS/common/model/Mass' );
  var PeriodTrace = require( 'MASSES_AND_SPRINGS/lab/model/PeriodTrace' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var MassesAndSpringsModel = require( 'MASSES_AND_SPRINGS/common/model/MassesAndSpringsModel' );

  // constants
  var MASS_X_POSITION = 0.625;
  var MASS_OFFSET = 0.075;

  /**
   * @constructor
   * REVIEW: JSDoc the param
   */
  function LabModel( tandem ) {
    // TODO: Think about creating mass objects above, and then passing into the constructor (instead of having to function-call to create, and then index into to modify)

    MassesAndSpringsModel.call( this, tandem );

    // Lab screen should have spring damping
    //REVIEW: Some other screen overrides this also, to the same value. use the same "initial value" instead of a
    //REVIEW: custom reset.
    this.dampingProperty.set( 0.2 );

    //REVIEW: the 0.01 should be refactored out (mention in another review comment)
    this.createSpring( MassesAndSpringsConstants.RIGHT_SPRING_X - .01, tandem.createTandem( 'spring' ) );

    // REVIEW: Should these use MassesAndSpringsModel createMass? (or renamed method)?
    this.masses.push( new Mass( 0.100, MASS_X_POSITION, true, 'rgb(247,151,34)', this.gravityProperty, tandem.createTandem( 'adjustableMass' ), {
      adjustable: true
    } ) );
    this.masses.push( new Mass( 0.370, MASS_X_POSITION + MASS_OFFSET, true, 'rgb(255, 120, 120)', this.gravityProperty, tandem.createTandem( 'smallLabeledMass' ), {
      density: 220,
      mysteryLabel: true
    } ) );
    this.masses.push( new Mass( 0.230, MASS_X_POSITION + MASS_OFFSET * 2, true, 'rgb( 128, 197, 237)', this.gravityProperty, tandem.createTandem( 'largeLabeledMass' ), {
      density: 110,
      mysteryLabel: true
    } ) );

    // Initialize period trace.
    this.periodTrace = new PeriodTrace( this.springs[ 0 ] );
  }

  massesAndSprings.register( 'LabModel', LabModel );

  return inherit( MassesAndSpringsModel, LabModel, {
    /**
     * @override
     *
     * @public
     */
    reset: function() {
      MassesAndSpringsModel.prototype.reset.call( this );
      this.dampingProperty.set( 0.2 );
    }
  } );
} );