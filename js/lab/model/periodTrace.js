// Copyright 2018, University of Colorado Boulder

/**
 * Model for period trace of mass oscillation.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Mass = require( 'MASSES_AND_SPRINGS/common/model/Mass' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var MassesAndSpringsModel = require( 'MASSES_AND_SPRINGS/common/model/MassesAndSpringsModel' );
  var Property = require( 'AXON/Property' );


  // constants


  /**
   * @constructor
   */
  function PeriodTrace( mass ) {

    var self = this;

    this.originalY = 300;

    //TODO: Use numberProperty when applicable

    // @public {Property} mass which is being tracked
    this.massProperty = new Property( mass );


    // @public {Property} orientation of the mass oscillation.
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

    this.firstPeekY = this.originalY + 50;
    this.secondPeekY = this.originalY - 50;

    // optional parameter used to measure rate of trace fading
    this.alphaProperty = new Property( 1 );


    mass.peekEmitter.addListener( function( direction ) {

      if ( self.stateProperty.value === 1 ) {
        self.firstPeekY = mass.positionProperty.value.y
      }
      if ( self.stateProperty.value === 3 ) {
        self.secondPeekY = mass.positionProperty.value.y
      }
      self.directionProperty.set( direction );
      // if (this)

      // console.log(direction);
    } );

    mass.crossEmitter.addListener( function() {
      self.stateProperty.value += 1;

      if ( ((self.stateProperty.value % 5 === 0) && (self.stateProperty != 0)) || mass.userControlledProperty.value ) {
        self.stateProperty.reset();
      }
      // console.log(self.stateProperty.value);

    } );

    this.directionProperty.link( function( oldValue, newValue ) {
      if ( oldValue !== newValue ) {
        // debugger;
        self.xOffsetProperty.set( self.xOffsetProperty.value + 20 );
        // debugger;
        self.crossingProperty.set( self.crossingProperty.value + 1 );
      }
    } )

    mass.userControlledProperty.link( function( value ) {
      if ( !value ) {
        self.stateProperty.reset();
        self.crossingProperty.reset();
      }
    } )
  }

  massesAndSprings.register( 'PeriodTrace', PeriodTrace );

  return inherit( Object, PeriodTrace );
} );