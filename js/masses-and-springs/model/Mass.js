// Copyright 2016, University of Colorado Boulder

/**
 * @author Matt Pennington
 */

define( function( require ) {
  'use strict';

  // modules
  //var DerivedProperty = require( 'AXON/DerivedProperty' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Vector2 = require( 'DOT/Vector2' );
  //var Range = require( 'DOT/Range' );
  //var Vector2 = require( 'DOT/Vector2' );

  // constants
  var heightRatio = 2;
  var density = 8050; // density of steel in kg/m^3


  /**
   * @param {Vector2} initialPosition: initial coordinates of the mass
   * @param {number} massValue:  mass in kg
   * @constructor
   */
  function Mass( massValue, initialPosition ) {


    PropertySet.call( this, {
      // @public
      userControlled: false, // {boolean} indicates whether this mass is currently user controlled
      position: initialPosition, // {Vector2}  the position of a mass is the center top of the model object.
      spring: null, // {Spring|null}   is the mass attached to a Spring?
      verticalVelocity: 0 // {number} m/s
    } );

    // @public (read-only)
    this.mass = massValue;


    this.hookHeight = .03; // height in m
    this.radius = Math.pow( this.mass / (density * heightRatio * Math.PI ), 1/3 );
    this.cylinderHeight = this.radius * heightRatio;
    this.height = this.cylinderHeight + this.hookHeight;
  }

  massesAndSprings.register( 'Mass', Mass );

  return inherit( PropertySet, Mass, {
    /*
     * @param {number} gravity
     * @param {number} floorY
     * @param {number} dt
     */
    fallWithGravity: function( gravity, floorY, dt ) {
      var floorPosition = floorY + this.height;
      if (this.position.y !== floorPosition) {
        console.log( this.position.y );
        var newVerticalVelocity = this.verticalVelocity - gravity * dt;
        var newY = this.position.y + ( this.verticalVelocity + newVerticalVelocity) * dt / 2;
        if ( newY < floorPosition ) {
          // if we hit the ground stop falling
          this.position = new Vector2( this.position.x, floorPosition);
          this.verticalVelocity = 0;
        }
        else {
          this.verticalVelocity = newVerticalVelocity;
          this.position = new Vector2( this.position.x, newY);
        }
      }
    },

    /*
     *  @param {Spring} spring
     */
    attach: function( spring ) {
      this.spring = spring;
    },

    detach: function() {
      this.spring = null;
    }

  } );

} );