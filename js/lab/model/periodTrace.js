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
  var X_OFFSET = 20;


  /**
   * @constructor
   */
  function PeriodTrace( mass ) {

    var self = this;

    var originalX = 0;
    var middleX = originalX + X_OFFSET;
    var lastX = originalX + 2 * X_OFFSET;
    var originY = 0;

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

    this.firstPeekY = null;
    this.secondPeekY = null;

    // optional parameter used to measure rate of trace fading
    this.alphaProperty = new Property( 1 );


    // function Trace( model ) {
    //   // this.stateProperty = new NumberProperty( 0 );
    //   // this.firstY = null;
    //   // this.secondY = null;
    //
    //   // optional
    //   // this.alphaProperty = new NumberProperty( 1 );
    //
    //
    //   // model.peakEmitter.addListener
    //   // model.crossEmitter.addListener
    // }
    //
    //
    // inherit( alkrsntalskrt, {
    //
    //   step: function( dt ) {
    //     if ( this.state === 4 ) {
    //       this.alpha = Math.max( 0, this.alpha - FADE_SPEED * dt );
    //     }
    //     if ( this.state > 0 && this.state < 4 ) {
    //
    //     }
    //   }
    //
    //   reset: function() {
    //     this.state = 0;
    //     this.alpha = 1;
    //   }
    // } );


    mass.peekEmitter.addListener( function( position, direction ) {
      // debugger;
      // console.log( self.xOffsetProperty.value );

      if ( (self.xOffsetProperty.value % 60 === 0) && (self.xOffsetProperty.value != 0) ) {
        // debugger;
        self.xOffsetProperty.set();
      }
      if ( (self.crossingProperty.value % 3 === 0) && (self.crossingProperty.value != 0) ) {
        // self.crossingProperty.reset();
      }
      self.directionProperty.set( direction );

      // console.log(direction);
    } );

    mass.crossEmitter.addListener( function() {
      self.stateProperty.value += 1;

      if ( (self.stateProperty.value % 5 === 0) && (self.stateProperty != 0) || mass.userControlledProperty.value ) {
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
        // console.log( self.xOffsetProperty.value )
        // console.log( self.crossingProperty.value )
      }
    } )

    mass.userControlledProperty.link( function( value ) {
      if ( !value ) {
        self.xOffsetProperty.reset();
        self.crossingProperty.reset();
      }
    } )

    Property.multilink( [ this.xOffsetProperty, this.crossingProperty ], function( xOffset, crossing ) {
      // console.log(xOffset)
      // console.log(crossing)


    } )
  }

  massesAndSprings.register( 'PeriodTrace', PeriodTrace );

  return inherit( Object, PeriodTrace );
} );