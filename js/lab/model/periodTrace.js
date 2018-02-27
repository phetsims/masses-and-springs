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


    mass.directionEmitter.addListener( function( position, direction ) {
      // debugger;
      console.log( self.xOffsetProperty.value );

      if ( (self.xOffsetProperty.value % 60 === 0) && (self.xOffsetProperty.value != 0) ) {
        // debugger;
        self.xOffsetProperty.reset();
      }
      if ( (self.crossingProperty.value % 3 === 0) && (self.crossingProperty.value != 0) ) {
        // self.crossingProperty.reset();
      }
      self.directionProperty.set( direction );

      // console.log(direction);
    } );

    this.directionProperty.link( function( oldValue, newValue ) {
      if ( oldValue !== newValue ) {
        // debugger;
        self.xOffsetProperty.set( self.xOffsetProperty.value + 20 );
        // debugger;
        self.crossingProperty.set( self.crossingProperty.value + 1 );
        console.log( self.xOffsetProperty.value )
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