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
  var MassesAndSpringsColorProfile = require( 'MASSES_AND_SPRINGS/common/view/MassesAndSpringsColorProfile' );

  // constants
  var MASS_OFFSET = 0.15;

  /**
   * @param {Tandem} tandem
   * @param {object} options
   *
   * @constructor
   */
  function LabModel( tandem, options ) {

    MassesAndSpringsModel.call( this, tandem, options );

    // Lab screen shouldn't have spring damping for non-basics version
    this.dampingProperty = new NumberProperty( this.options.basicsVersion ? 0 : 0.0575 );

    this.createSpring( MassesAndSpringsConstants.SPRING_X, tandem.createTandem( 'spring' ) );
    this.firstSpring = this.springs[ 0 ];

    // {boolean} Flag used to determine if this is the basics version.
    var basicsVersion = this.options.basicsVersion;
    var massXPosition = basicsVersion ? 0.13 : 0.625;
    var massValue;

    this.createMass( 0.100, massXPosition, MassesAndSpringsColorProfile.adjustableMassProperty, null, tandem.createTandem( 'adjustableMass' ), {
      adjustable: true
    } );

    if ( basicsVersion ) {
      this.createMass( 0.180, massXPosition + MASS_OFFSET * 2, MassesAndSpringsColorProfile.largeMysteryMassProperty, null, tandem.createTandem( 'largeLabeledMass2' ), {
        density: basicsVersion ? 80 : 120,
        mysteryLabel: true
      } );
    }
    massValue = basicsVersion ? 0.12 : 0.23;
    this.createMass( massValue, massXPosition + MASS_OFFSET * 1.5, MassesAndSpringsColorProfile.mediumMysteryMassProperty, null, tandem.createTandem( 'largeLabeledMass' ), {
      density: basicsVersion ? 80 : 110,
      mysteryLabel: true
    } );
    massValue = basicsVersion ? 0.060 : 0.37;
    this.createMass( massValue, massXPosition + MASS_OFFSET, MassesAndSpringsColorProfile.smallMysteryMassProperty, null, tandem.createTandem( 'smallLabeledMass' ), {
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