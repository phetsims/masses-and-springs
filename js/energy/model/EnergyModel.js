// Copyright 2017-2020, University of Colorado Boulder

/**
 * Energy model (base type) for Masses and Springs
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */

import MassesAndSpringsConstants from '../../common/MassesAndSpringsConstants.js';
import MassesAndSpringsModel from '../../common/model/MassesAndSpringsModel.js';
import massesAndSpringsColorProfile from '../../common/view/massesAndSpringsColorProfile.js';
import massesAndSprings from '../../massesAndSprings.js';

class EnergyModel extends MassesAndSpringsModel {
  /**
   * @param {Tandem} tandem
   *
   */
  constructor( tandem ) {
    super( tandem, {
      damping: 0.0575     // Energy screen should have spring damping
    } );
    this.basicsVersion = false;

    // Energy screen should have spring damping

    // Creation of masses and springs specific for this screen
    this.createSpring( MassesAndSpringsConstants.SPRING_X, tandem.createTandem( 'spring' ) );
    this.firstSpring = this.springs[ 0 ];

    this.createMass( 0.1, 0.72, massesAndSpringsColorProfile.adjustableMassProperty, null, tandem.createTandem( 'adjustableMass' ) );

    this.masses[ 0 ].adjustable = true;
  }

  /**
   * @public
   */
  reset() {
    super.reset();
  }
}

massesAndSprings.register( 'EnergyModel', EnergyModel );

export default EnergyModel;