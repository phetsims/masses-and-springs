// Copyright 2017-2018, University of Colorado Boulder

/**
 * Energy model (base type) for Masses and Springs
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

  /**
   * @constructor
   * REVIEW: JSDoc for param
   */
  function EnergyModel( tandem ) {
    MassesAndSpringsModel.call( this, tandem );

    // Energy screen should have spring damping
    this.dampingProperty.set( 0.2 );

    // Creation of masses and springs specific for this screen
    this.createSpring( MassesAndSpringsConstants.RIGHT_SPRING_X - .01, tandem.createTandem( 'spring' ) );
    this.firstSpring = this.springs[ 0 ];

    this.createMass( 0.1, 0.7, 'rgb(247,151,34)', null, tandem.createTandem( 'adjustableMass' ) );

    this.masses[ 0 ].adjustable = true;
  }

  massesAndSprings.register( 'EnergyModel', EnergyModel );

  return inherit( MassesAndSpringsModel, EnergyModel, {
    /**
     * @public
     */
    reset: function() {
      MassesAndSpringsModel.prototype.reset.call( this );

      //REVIEW: The more "proper" way is to pass an initial value in to the supertype that is set as the Property's
      //REVIEW: actual initial value. Then it can be reset as normal.
      this.dampingProperty.set( 0.2 );
    }
    }
  );
} );