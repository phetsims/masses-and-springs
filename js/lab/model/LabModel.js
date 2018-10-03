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

    // {boolean} Flag used to determine if this is the basics version.
    var basicsVersion = this.options.basicsVersion;
    var massValue;

    if ( basicsVersion ) {
      this.createMass( 0.20, MASS_X_POSITION + MASS_OFFSET * 2, 'rgb( 0, 104, 55 )', null, tandem.createTandem( 'largeLabeledMass' ), {
        density: basicsVersion ? 80 : 120,
        mysteryLabel: true
      } );
    }
    massValue = basicsVersion ? 0.15 : 0.23;
    this.createMass( massValue, MASS_X_POSITION + MASS_OFFSET * 1.5, 'rgb( 128, 197, 237)', null, tandem.createTandem( 'largeLabeledMass' ), {
      density: basicsVersion ? 80 : 110,
      mysteryLabel: true
    } );
    massValue = basicsVersion ? 0.075 : 0.37;
    this.createMass( massValue, MASS_X_POSITION + MASS_OFFSET, 'rgb(255, 120, 120)', null, tandem.createTandem( 'smallLabeledMass' ), {
      density: basicsVersion ? 80 : 220,
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