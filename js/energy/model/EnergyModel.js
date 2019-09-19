// Copyright 2017-2019, University of Colorado Boulder

/**
 * Energy model (base type) for Masses and Springs
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  const MassesAndSpringsColorProfile = require( 'MASSES_AND_SPRINGS/common/view/MassesAndSpringsColorProfile' );
  const MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  const MassesAndSpringsModel = require( 'MASSES_AND_SPRINGS/common/model/MassesAndSpringsModel' );

  /**
   * @param {Tandem} tandem
   *
   * @constructor
   */
  function EnergyModel( tandem ) {
    MassesAndSpringsModel.call( this, tandem, {
      damping: 0.0575     // Energy screen should have spring damping
    } );
    this.basicsVersion = false;

    // Energy screen should have spring damping

    // Creation of masses and springs specific for this screen
    this.createSpring( MassesAndSpringsConstants.SPRING_X, tandem.createTandem( 'spring' ) );
    this.firstSpring = this.springs[ 0 ];

    this.createMass( 0.1, 0.72, MassesAndSpringsColorProfile.adjustableMassProperty, null, tandem.createTandem( 'adjustableMass' ) );

    this.masses[ 0 ].adjustable = true;
  }

  massesAndSprings.register( 'EnergyModel', EnergyModel );

  return inherit( MassesAndSpringsModel, EnergyModel, {
    /**
     * @public
     */
    reset: function() {
      MassesAndSpringsModel.prototype.reset.call( this );
    }
  } );
} );