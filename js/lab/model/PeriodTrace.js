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
  var Property = require( 'AXON/Property' );

  /**
   * @constructor
   * REVIEW: doc param
   */
  function PeriodTrace( spring ) {

    var self = this;

    //REVIEW: type/visibility docs
    //REVIEW: Wait, this value is only set, never read from? Can this be removed?
    this.originalY = 0;

    //TODO: Use numberProperty when applicable REVIEW: I probably marked these where necessary, remove this TODO?

    //REVIEW: Type docs of the Property's value?
    // @public {Property} mass which is being tracked
    this.springProperty = new Property( spring );

    //REVIEW: Type docs of the Property's value?
    // @public {Property} orientation of the spring's oscillation.
    this.directionProperty = new Property( null );

    //REVIEW: NumberProperty?
    //REVIEW: Type docs of the Property's value?
    // @public {Property} units the trace should be positioned away from the origin in the x direction
    this.xOffsetProperty = new Property( 0 );

    //REVIEW: NumberProperty?
    //REVIEW: Type docs of the Property's value?
    // @public {Property.number} determines how many times the trace has gone over its original Y position
    this.crossingProperty = new Property( 0 );

    // @public {Property.boolean} a flag for whether the trace is fading or not
    //REVIEW: Type docs of the Property's value?
    this.fadingProperty = new Property( false );


    // @public {Property.<number>} Follows pattern in Pendulum-Lab
    // 0: Trace hasn't started recording.
    // 1: Pendulum had its first zero-crossing, but hasn't reached its first peak.
    // 2: Pendulum reached first peak, and is swinging towards second peak.
    // 3: Pendulum had second peak, but hasn't crossed the zero-line since.
    // 4: Pendulum trace completed.
    //REVIEW: NumberProperty?
    //REVIEW: Type docs of the Property's value?
    this.stateProperty = new Property( 0 );

    //REVIEW: type/visibility docs
    this.firstPeakY = 0;
    this.secondPeakY = 0;

    // optional parameter used to measure rate of trace fading
    //REVIEW: NumberProperty?
    //REVIEW: JSDoc?
    this.alphaProperty = new Property( 1 );

    // When a mass is attached the origin of the trace should be the mass equilibrium.
    this.springProperty.value.massAttachedProperty.link( function( mass ) {
      if ( !mass ) {

        // If there isn't a mass attached then there is no mass displacement
        self.springProperty.value.massEquilibriumDisplacementProperty.reset();
      }
      else {
        self.originalY = self.springProperty.value.massEquilibriumYPositionProperty.value;
      }
    } );

    // When the mass equilibrium position changes reset the trace.
    spring.massEquilibriumYPositionProperty.link( function() {
      self.onFaded();
    } );

    //REVIEW: There is only one usage of this listener, so it could be inlined
    var peakListener = function( direction ) {
      if ( self.stateProperty.value !== 0 && self.stateProperty.value !== 4 ) {
          self.stateProperty.value += 1;
        if ( self.stateProperty.value === 2 ) {
          self.firstPeakY = self.springProperty.value.massEquilibriumDisplacementProperty.value;
        }
        if ( self.stateProperty.value === 3 ) {
          self.secondPeakY = self.springProperty.value.massEquilibriumDisplacementProperty.value;
        }
      }
      self.directionProperty.set( direction );
    };
    //REVIEW: There is only one usage of this listener, so it could be inlined
    var crossListener = function() {
        self.crossingProperty.value += 1;

      if ( self.crossingProperty.value === 1 || self.crossingProperty.value === 3 ) {
          self.stateProperty.value += 1;
      }

      //REVIEW: Spaces should be inside parens. Might want to check all of the code to make sure the spaces are there.
      if ( ((self.stateProperty.value % 5 === 0) && (self.stateProperty !== 0)) ) {
        self.stateProperty.reset();
      }
      if ( ((self.crossingProperty.value % 4 === 0) && (self.crossingProperty !== 0)) ) {
        self.crossingProperty.reset();
      }
    };
    //REVIEW: There is only one usage of this listener, so it could be inlined
    var droppedListener = function() {
      self.stateProperty.reset();
      self.crossingProperty.reset();
    };
    this.springProperty.value.peakEmitter.addListener( peakListener );
    this.springProperty.value.crossEmitter.addListener( crossListener );
    this.springProperty.value.droppedEmitter.addListener( droppedListener );

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