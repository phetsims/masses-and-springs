// Copyright 2016, University of Colorado Boulder

/**
 *
 * @author Matt Pennington
 */
define( function( require ) {
  'use strict';

  // modules
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Spring = require( 'MASSES_AND_SPRINGS/masses-and-springs/model/Spring' );

  /**
   * @constructor
   */
  function SingleSpringSystem( springOptions ) {

    //------------------------------------------------
    // Components of the system

    // @public spring
    this.spring = new Spring( springOptions );
 //   assert && assert( this.spring.displacementProperty.get() === 0 ); // spring is at equilibrium

    //// @public arm, left end attached to spring
    //this.roboticArm = new RoboticArm( {
    //  left: this.spring.rightProperty.get(),
    //  right: this.spring.rightProperty.get() + this.spring.lengthProperty.get()
    //} );

    //------------------------------------------------
    // Property observers

    var thisSystem = this;

    //// Connect arm to spring.
    //this.spring.rightProperty.link( function( right ) {
    //  thisSystem.roboticArm.leftProperty.set( right );
    //} );
    //
    //// Robotic arm sets displacement of spring.
    //this.roboticArm.leftProperty.link( function( left ) {
    //  thisSystem.spring.displacementProperty.set( left - thisSystem.spring.equilibriumXProperty.get() );
    //} );

    //------------------------------------------------
    // Check for conditions supported by the general Spring model that aren't allowed by this system

    this.spring.leftProperty.lazyLink( function( left ) {
      throw new Error( 'Left end of spring must remain fixed, left=' + left );
    } );

    this.spring.equilibriumXProperty.lazyLink( function( equilibriumX ) {
      throw new Error( 'Equilibrium position must remain fixed, equilibriumX=' + equilibriumX );
    } );
  }

  return inherit( Object, SingleSpringSystem, {


    reset: function() {
      this.spring.reset();
      //this.roboticArm.reset();
    }
  } );
} );
