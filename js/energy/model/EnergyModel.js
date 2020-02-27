// Copyright 2017-2019, University of Colorado Boulder

/**
 * Energy model (base type) for Masses and Springs
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */

import inherit from '../../../../phet-core/js/inherit.js';
import MassesAndSpringsConstants from '../../common/MassesAndSpringsConstants.js';
import MassesAndSpringsModel from '../../common/model/MassesAndSpringsModel.js';
import MassesAndSpringsColorProfile from '../../common/view/MassesAndSpringsColorProfile.js';
import massesAndSprings from '../../massesAndSprings.js';

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

export default inherit( MassesAndSpringsModel, EnergyModel, {
  /**
   * @public
   */
  reset: function() {
    MassesAndSpringsModel.prototype.reset.call( this );
  }
} );