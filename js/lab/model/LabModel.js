// Copyright 2016-2021, University of Colorado Boulder

/**
 * Lab model (base type) for Masses and Springs
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import { Color } from '../../../../scenery/js/imports.js';
import MassesAndSpringsConstants from '../../common/MassesAndSpringsConstants.js';
import MassesAndSpringsModel from '../../common/model/MassesAndSpringsModel.js';
import MassesAndSpringsColors from '../../common/view/MassesAndSpringsColors.js';
import massesAndSprings from '../../massesAndSprings.js';
import PeriodTrace from './PeriodTrace.js';

// constants
const MASS_OFFSET = 0.15;

class LabModel extends MassesAndSpringsModel {
  /**
   * @param {Boolean} basicsVersion
   * @param {Tandem} tandem
   * @param {Object} [options]
   *
   */
  constructor( tandem, basicsVersion, options ) {

    super( tandem, options );
    this.basicsVersion = basicsVersion;

    // Lab screen shouldn't have spring damping for non-basics version
    this.dampingProperty = new NumberProperty( this.basicsVersion ? 0 : 0.0575 );

    this.createSpring( MassesAndSpringsConstants.SPRING_X, tandem.createTandem( 'spring' ) );
    this.firstSpring = this.springs[ 0 ];

    const massXPosition = this.basicsVersion ? 0.13 : 0.625;
    let massValue;
    let color;

    this.createMass( 0.100, massXPosition, MassesAndSpringsColors.adjustableMassProperty, null, tandem.createTandem( 'adjustableMass' ), {
      adjustable: true
    } );

    // Initialize additional mass for basics version
    if ( this.basicsVersion ) {

      // @public {BooleanProperty}
      this.gravityAccordionBoxExpandedProperty = new BooleanProperty( false );

      this.createMass( 0.180, massXPosition + MASS_OFFSET * 2, new Property( new Color( 'rgb( 195, 51, 115 )' ) ), null, tandem.createTandem( 'largeMysteryMass' ), {
        density: 80,
        mysteryLabel: true
      } );
    }

    // Initialize masses
    massValue = this.basicsVersion ? 0.12 : 0.23;
    color = this.basicsVersion ? new Color( 9, 19, 174 ) : new Color( 0, 222, 224 );
    this.createMass( massValue, massXPosition + MASS_OFFSET * 1.5, new Property( color ), null, tandem.createTandem( 'mediumMysteryMass' ), {
      density: this.basicsVersion ? 80 : 110,
      mysteryLabel: true
    } );

    massValue = this.basicsVersion ? 0.060 : 0.37;
    color = this.basicsVersion ? new Color( 10, 198, 157 ) : new Color( 246, 164, 255 );
    this.createMass( massValue, massXPosition + MASS_OFFSET, new Property( color ), null, tandem.createTandem( 'smallMysteryMass' ), {
      density: this.basicsVersion ? 80 : 220,
      mysteryLabel: true
    } );

    // The lab model spring is the only spring with a period trace.
    this.firstSpring.periodTrace = new PeriodTrace( this.firstSpring, this.playingProperty );
  }

  /**
   * @public
   */
  reset() {
    super.reset();
    this.gravityAccordionBoxExpandedProperty && this.gravityAccordionBoxExpandedProperty.reset();
  }
}

massesAndSprings.register( 'LabModel', LabModel );

export default LabModel;