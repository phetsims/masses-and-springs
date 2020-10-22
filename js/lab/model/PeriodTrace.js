// Copyright 2018-2020, University of Colorado Boulder

/**
 * Model for period trace of mass's oscillation.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import massesAndSprings from '../../massesAndSprings.js';

class PeriodTrace {
  /**
   * @param {Spring} spring
   * @param {Property.<boolean>} simPlaying: is the sim playing or not
   *
   */
  constructor( spring, simPlaying ) {

    // @public (read-only) spring which is being tracked
    this.spring = spring;

    // @public {Property.<number>} orientation of the spring's oscillation.
    this.directionProperty = new Property( null );

    // @public {Property.<number>} units the trace should be positioned away from the origin in the x direction
    this.xOffsetProperty = new NumberProperty( 0 );

    // @public {Property.<number>} determines how many times the trace has gone over its original Y position
    this.crossingProperty = new NumberProperty( 0 );

    // @public {Property.<number>} Follows pattern in Pendulum-Lab
    // 0: Trace hasn't started recording.
    // 1: Pendulum had its first zero-crossing, but hasn't reached its first peak.
    // 2: Pendulum reached first peak, and is swinging towards second peak.
    // 3: Pendulum had second peak, but hasn't crossed the zero-line since.
    // 4: Pendulum trace completed.
    this.stateProperty = new NumberProperty( 0 );

    // @public {number}
    this.firstPeakY = 0;
    this.secondPeakY = 0;

    // @public {Property.<number>} optional parameter used to measure rate of trace fading
    this.alphaProperty = new NumberProperty( 1 );

    // When a mass is attached the origin of the trace should be the mass equilibrium.
    this.spring.massAttachedProperty.link( mass => {
      if ( !mass ) {

        // If there isn't a mass attached then there is no mass displacement
        this.spring.massEquilibriumDisplacementProperty.reset();
      }
    } );

    // When the mass equilibrium position changes reset the trace.
    spring.massEquilibriumYPositionProperty.link( () => {
      this.onFaded();
    } );

    this.spring.peakEmitter.addListener( direction => {
      if ( this.stateProperty.value !== 0 && this.stateProperty.value !== 4 ) {
        this.stateProperty.value += 1;
        if ( this.stateProperty.value === 2 ) {
          this.firstPeakY = this.spring.massEquilibriumDisplacementProperty.value;
        }
        if ( this.stateProperty.value === 3 ) {
          this.secondPeakY = this.spring.massEquilibriumDisplacementProperty.value;
        }
      }
      this.directionProperty.set( direction );
    } );

    this.spring.crossEmitter.addListener( () => {

      // If the mass crosses the mid point below a certain velocity, we don't want to show the trace.
      this.thresholdReached = Math.abs( spring.massAttachedProperty.value.verticalVelocityProperty.value ) <= 0.06;

      this.crossingProperty.value += 1;

      if ( this.crossingProperty.value === 1 || this.crossingProperty.value === 3 ) {
        this.stateProperty.value += 1;
      }

      if ( ( ( this.stateProperty.value % 5 === 0 ) && ( this.stateProperty !== 0 ) ) && simPlaying.value ) {
        this.stateProperty.reset();
      }
      if ( ( ( this.crossingProperty.value % 4 === 0 ) && ( this.crossingProperty !== 0 ) ) && simPlaying.value ) {
        this.crossingProperty.reset();
      }
    } );

    this.spring.periodTraceResetEmitter.addListener( () => {
      this.onFaded();
    } );

    this.directionProperty.lazyLink( ( oldValue, newValue ) => {
      if ( oldValue !== newValue ) {
        this.xOffsetProperty.set( this.xOffsetProperty.value + 20 );
      }
    } );
  }

  /**
   * Called when the trace has fully faded away.
   * @public
   */
  onFaded() {
    this.stateProperty.reset();
    this.crossingProperty.reset();
  }
}

massesAndSprings.register( 'PeriodTrace', PeriodTrace );

export default PeriodTrace;