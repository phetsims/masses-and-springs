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
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var MassesAndSpringsModel = require( 'MASSES_AND_SPRINGS/common/model/MassesAndSpringsModel' );
  var Property = require( 'AXON/Property' );


  // constants


  /**
   * @constructor
   */
  function PeriodTrace( spring ) {

    var self = this;

    this.originalY = 0;

    //TODO: Use numberProperty when applicable

    // @public {Property} mass which is being tracked
    this.springProperty = new Property( spring );

    // @public {Property} orientation of the spring's oscillation.
    this.directionProperty = new Property( null )

    // @public {Property} units the trace should be positioned away from the origin in the x direction
    this.xOffsetProperty = new Property( 0 );

    // @public {Property.number} determines how many times the trace has gone over its original Y position
    this.crossingProperty = new Property( 0 );

    // @public {Property.boolean} a flag for whether the trace is fading or not
    this.fadingProperty = new Property( false );


    // @public {Property.<number>} Follows pattern in Pendulum-Lab
    // 0: Trace hasn't started recording.
    // 1: Pendulum had its first zero-crossing, but hasn't reached its first peak.
    // 2: Pendulum reached first peak, and is swinging towards second peak.
    // 3: Pendulum had second peak, but hasn't crossed the zero-line since.
    // 4: Pendulum trace completed.
    this.stateProperty = new Property( 0 );

    this.firstPeakY = 0;
    this.secondPeakY = 0;

    // optional parameter used to measure rate of trace fading
    this.alphaProperty = new Property( 1 );

    // When a mass is attached the origin of the trace should be the mass equilibrium.
    this.springProperty.value.massAttachedProperty.link( function() {
      self.originalY = self.springProperty.value.massEquilibriumYPositionProperty.value;
    } );

    var peakListener = function( direction ) {
      if ( self.stateProperty.value != 0 ) {
        if ( crossingProperty.value > 1 ) {}
        if ( self.stateProperty.value === 2 ) {
          self.firstPeakY = self.springProperty.value.massEquilibriumDisplacementProperty.value
        }
        if ( self.stateProperty.value === 4 ) {
          self.secondPeakY = self.springProperty.value.massEquilibriumDisplacementProperty.value
        }
      }
      self.directionProperty.set( direction );
    };
    var crossListener = function() {

      self.crossingProperty.value += 1;

      if ( ((self.stateProperty.value % 5 === 0) && (self.stateProperty != 0)) || self.springProperty.value.massAttachedProperty.value.userControlledProperty.value ) {
        self.stateProperty.reset();
      }
    };

    var droppedListener = function() {
      self.stateProperty.reset();
      self.crossingProperty.reset();

    };

    this.springProperty.value.peakEmitter.addListener( peakListener );
    this.springProperty.value.crossEmitter.addListener( crossListener );
    this.springProperty.value.droppedEmitter.addListener( droppedListener );

    // this.springProperty.value.massAttachedProperty.link( function( mass ) {
    //   if ( mass && mass.userControlledProperty.value ) {
    //     self.stateProperty.reset();
    //     self.crossingProperty.reset();
    //   }
    // } )
    if ( this.springProperty.value.massAttachedProperty.value ) {
      value.userControlledProperty.link( userControlledListener );
    }
    this.directionProperty.lazyLink( function( oldValue, newValue ) {
      if ( oldValue !== newValue ) {
        // debugger;
        self.xOffsetProperty.set( self.xOffsetProperty.value + 20 );
        // debugger;
        self.crossingProperty.set( self.crossingProperty.value + 1 );
      }
    } )
  }

  massesAndSprings.register( 'PeriodTrace', PeriodTrace );

  return inherit( Object, PeriodTrace );
} );