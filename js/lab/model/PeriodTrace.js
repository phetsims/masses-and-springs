// Copyright 2018, University of Colorado Boulder

/**
 * Model for period trace of mass's oscillation.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var Property = require( 'AXON/Property' );

  /**
   * @param {Spring} spring
   * @param {Property.<boolean>} simPlaying: is the sim playing or not
   *
   * @constructor
   */
  function PeriodTrace( spring, simPlaying ) {
    var self = this;

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
    this.spring.massAttachedProperty.link( function( mass ) {
      if ( !mass ) {

        // If there isn't a mass attached then there is no mass displacement
        self.spring.massEquilibriumDisplacementProperty.reset();
      }
    } );

    // When the mass equilibrium position changes reset the trace.
    spring.massEquilibriumYPositionProperty.link( function() {
      self.onFaded();
    } );

    this.spring.peakEmitter.addListener( function( direction ) {
      if ( self.stateProperty.value !== 0 && self.stateProperty.value !== 4 ) {
        self.stateProperty.value += 1;
        if ( self.stateProperty.value === 2 ) {
          self.firstPeakY = self.spring.massEquilibriumDisplacementProperty.value;
        }
        if ( self.stateProperty.value === 3 ) {
          self.secondPeakY = self.spring.massEquilibriumDisplacementProperty.value;
        }
      }
      self.directionProperty.set( direction );
    } );

    this.spring.crossEmitter.addListener( function() {

      // If the mass crosses the mid point below a certain velocity, we don't want to show the trace.
      self.thresholdReached = Math.abs( spring.massAttachedProperty.value.verticalVelocityProperty.value ) <= 0.15;
      self.crossingProperty.value += 1;

      if ( self.crossingProperty.value === 1 || self.crossingProperty.value === 3 ) {
        self.stateProperty.value += 1;
      }

      if ( (( self.stateProperty.value % 5 === 0 ) && ( self.stateProperty !== 0 )) && simPlaying.value ) {
        self.stateProperty.reset();
      }
      if ( (( self.crossingProperty.value % 4 === 0 ) && ( self.crossingProperty !== 0 )) && simPlaying.value ) {
        self.crossingProperty.reset();
      }
    } );

    this.spring.droppedEmitter.addListener( function() {
      self.onFaded();
    } );

    this.directionProperty.lazyLink( function( oldValue, newValue ) {
      if ( oldValue !== newValue ) {
        self.xOffsetProperty.set( self.xOffsetProperty.value + 20 );
      }
    } );
  }

  massesAndSprings.register( 'PeriodTrace', PeriodTrace );

  return inherit( Object, PeriodTrace, {
    /**
     * Called when the trace has fully faded away.
     * @public
     */
    onFaded: function() {
      this.stateProperty.reset();
      this.crossingProperty.reset();
    }
  } );
} );